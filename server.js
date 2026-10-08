"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const webpush = require("web-push");
require("dotenv").config();

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const DATA_FILE = path.resolve(
  process.env.DATA_FILE || "./private-data/subscriptions.json"
);
const FRONTEND_ORIGINS = new Set(
  (process.env.FRONTEND_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const APP_DIR = __dirname;

function readStore() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

let subscriptions = readStore();

function saveStore() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const temporaryFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(subscriptions), {
    mode: 0o600
  });
  fs.renameSync(temporaryFile, DATA_FILE);
}

function subscriptionId(subscription) {
  return crypto
    .createHash("sha256")
    .update(subscription.endpoint)
    .digest("hex");
}

function validateSubscription(subscription) {
  if (
    !subscription ||
    typeof subscription.endpoint !== "string" ||
    subscription.endpoint.length > 4096 ||
    !subscription.keys ||
    typeof subscription.keys.p256dh !== "string" ||
    typeof subscription.keys.auth !== "string"
  ) {
    return false;
  }

  let endpoint;
  try {
    endpoint = new URL(subscription.endpoint);
  } catch {
    return false;
  }

  const allowedHosts = new Set([
    "fcm.googleapis.com",
    "android.googleapis.com",
    "updates.push.services.mozilla.com",
    "push.services.mozilla.com",
    "web.push.apple.com"
  ]);

  return (
    endpoint.protocol === "https:" &&
    !endpoint.username &&
    !endpoint.password &&
    (!endpoint.port || endpoint.port === "443") &&
    (allowedHosts.has(endpoint.hostname) ||
      endpoint.hostname.endsWith(".notify.windows.com"))
  );
}

function getZonedDateParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    dateKey: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}`
  };
}

function isMedicineActive(medicine, dateKey) {
  if (medicine.active === false) {
    return false;
  }

  if (medicine.repeatType !== "days") {
    return true;
  }

  const repeatDays = Number(medicine.repeatDays);
  if (!Number.isInteger(repeatDays) || repeatDays < 1) {
    return false;
  }

  const startDate = medicine.repeatStartDate || dateKey;
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const today = Date.parse(`${dateKey}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(today)) {
    return false;
  }

  const elapsedDays =
    Math.floor((today - start) / 86400000);

  return elapsedDays >= 0 && elapsedDays < repeatDays;
}

function dueDoses(record, now) {
  const { dateKey, time } = getZonedDateParts(now, record.timeZone);
  const due = [];

  for (const medicine of record.medicines) {
    if (!isMedicineActive(medicine, dateKey)) {
      continue;
    }

    for (const dose of medicine.doses) {
      const pushKey = `${dateKey}${time}`;
      if (dose.time === time && dose.lastPushKey !== pushKey) {
        due.push({ medicine, dose, pushKey });
      }
    }
  }

  return due;
}

function localizedMessage(record, medicine) {
  if (record.language === "bn") {
    return `${medicine.name} খাওয়ার সময় হয়েছে — ${medicine.dosage}`;
  }
  return `Time to take ${medicine.name} — ${medicine.dosage}`;
}

async function sendDueNotifications(now = new Date()) {
  let changed = false;

  for (const [id, record] of Object.entries(subscriptions)) {
    for (const { medicine, dose, pushKey } of dueDoses(record, now)) {
      try {
        await webpush.sendNotification(
          record.subscription,
          JSON.stringify({
            title: "💊 Medicine Reminder",
            body: localizedMessage(record, medicine),
            tag: `medicine-${medicine.id}-${dose.time}`,
            url: record.appUrl
          })
        );
        dose.lastPushKey = pushKey;
        changed = true;
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 410) {
          delete subscriptions[id];
          changed = true;
          break;
        }
        console.error("Push delivery failed:", error);
      }
    }
  }

  if (changed) {
    saveStore();
  }
}

const app = express();
app.disable("x-powered-by");
app.use((request, response, next) => {
  const origin = request.get("origin");

  if (!origin) {
    return next();
  }

  if (!FRONTEND_ORIGINS.has(origin)) {
    return response.status(403).json({ error: "Origin is not allowed." });
  }

  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  return next();
});
app.use(express.json({ limit: "256kb" }));

app.get("/api/push/public-key", (_request, response) => {
  response.json({ publicKey: PUBLIC_KEY });
});

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/push/subscribe", (request, response) => {
  const { subscription, language, timeZone, appUrl } = request.body || {};
  if (!validateSubscription(subscription)) {
    return response.status(400).json({ error: "Invalid push subscription." });
  }

  let validAppUrl;
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    validAppUrl = new URL(appUrl);
  } catch {
    return response.status(400).json({
      error: "Invalid time zone or app URL."
    });
  }

  if (
    validAppUrl.protocol !== "https:" &&
    !(
      validAppUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(validAppUrl.hostname)
    )
  ) {
    return response.status(400).json({ error: "Invalid app URL." });
  }

  const id = subscriptionId(subscription);
  const existing = subscriptions[id];
  subscriptions[id] = {
    subscription,
    language: language === "bn" ? "bn" : "en",
    timeZone,
    appUrl: validAppUrl.href,
    medicines: existing ? existing.medicines : []
  };
  saveStore();

  return response.json({ ok: true });
});

app.put("/api/push/medicines", (request, response) => {
  const {
    subscription,
    medicines,
    language,
    timeZone,
    appUrl
  } = request.body || {};
  if (!validateSubscription(subscription)) {
    return response.status(400).json({ error: "Invalid push subscription." });
  }
  if (!Array.isArray(medicines) || medicines.length > 100) {
    return response.status(400).json({ error: "Invalid medicine list." });
  }

  try {
    new Intl.DateTimeFormat("en", { timeZone });
  } catch {
    return response.status(400).json({ error: "Invalid time zone." });
  }

  let validAppUrl;
  try {
    validAppUrl = new URL(appUrl);
  } catch {
    return response.status(400).json({ error: "Invalid app URL." });
  }

  if (
    validAppUrl.protocol !== "https:" &&
    !(
      validAppUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(validAppUrl.hostname)
    )
  ) {
    return response.status(400).json({ error: "Invalid app URL." });
  }

  const id = subscriptionId(subscription);
  const existing = subscriptions[id];
  const safeMedicines = [];
  for (const medicine of medicines) {
    if (
      !medicine ||
      typeof medicine.id !== "string" ||
      typeof medicine.name !== "string" ||
      typeof medicine.dosage !== "string" ||
      !Array.isArray(medicine.doses) ||
      medicine.doses.length > 24
    ) {
      return response.status(400).json({ error: "Invalid medicine data." });
    }

    const existingMedicine = existing
      ? existing.medicines.find((item) => item.id === medicine.id)
      : null;
    const doses = medicine.doses.map((dose) => {
      if (
        !dose ||
        typeof dose.time !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(dose.time)
      ) {
        return null;
      }
      const existingDose = existingMedicine
        ? existingMedicine.doses.find((item) => item.time === dose.time)
        : null;
      return {
        time: dose.time,
        lastPushKey: existingDose ? existingDose.lastPushKey : null
      };
    });

    if (doses.includes(null)) {
      return response.status(400).json({ error: "Invalid dose time." });
    }

    safeMedicines.push({
      id: medicine.id.slice(0, 100),
      name: medicine.name.slice(0, 200),
      dosage: medicine.dosage.slice(0, 200),
      repeatType: medicine.repeatType === "days" ? "days" : "until",
      repeatDays: medicine.repeatDays,
      repeatStartDate: medicine.repeatStartDate,
      active: medicine.active !== false,
      doses
    });
  }

  if (!existing) {
    return response.status(404).json({
      error: "Push subscription is not registered."
    });
  }

  existing.medicines = safeMedicines;
  existing.language = language === "bn" ? "bn" : "en";
  existing.timeZone = timeZone;
  existing.appUrl = validAppUrl.href;
  saveStore();

  return response.json({ ok: true });
});

const publicFiles = {
  "/": "index.html",
  "/index.html": "index.html",
  "/app.js": "app.js",
  "/config.js": "config.js",
  "/style.css": "style.css",
  "/manifest.json": "manifest.json",
  "/sw.js": "sw.js"
};

for (const [route, file] of Object.entries(publicFiles)) {
  app.get(route, (_request, response) => {
    if (file === "sw.js") {
      response.setHeader("Cache-Control", "no-cache");
    }
    response.sendFile(path.join(APP_DIR, file));
  });
}

function startServer() {
  if (!PUBLIC_KEY || !PRIVATE_KEY || !VAPID_SUBJECT) {
    throw new Error(
      "Set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT before starting."
    );
  }

  webpush.setVapidDetails(VAPID_SUBJECT, PUBLIC_KEY, PRIVATE_KEY);

  let schedulerRunning = false;
  const scheduler = setInterval(async () => {
    if (schedulerRunning) {
      return;
    }
    schedulerRunning = true;
    try {
      await sendDueNotifications();
    } catch (error) {
      console.error("Reminder scheduler failed:", error);
    } finally {
      schedulerRunning = false;
    }
  }, 15000);

  const server = app.listen(PORT, () => {
    console.log(`Medicine Reminder server listening on port ${PORT}`);
  });

  function shutdown() {
    clearInterval(scheduler);
    server.close(() => process.exit(0));
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

if (require.main === module) {
  startServer();
}

module.exports = {
  dueDoses,
  getZonedDateParts,
  isMedicineActive,
  localizedMessage,
  startServer,
  validateSubscription
};
