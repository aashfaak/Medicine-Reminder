"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  dueDoses,
  getZonedDateParts,
  isMedicineActive,
  validateSubscription
} = require("./server");

test("uses the subscriber time zone for the reminder date and time", () => {
  assert.deepEqual(
    getZonedDateParts(
      new Date("2026-10-09T05:30:00.000Z"),
      "America/New_York"
    ),
    {
      dateKey: "2026-10-09",
      time: "01:30"
    }
  );
});

test("stops a seven-day course at the start of its eighth local day", () => {
  const medicine = {
    repeatType: "days",
    repeatDays: 7,
    repeatStartDate: "2026-10-01",
    active: true
  };

  assert.equal(isMedicineActive(medicine, "2026-10-07"), true);
  assert.equal(isMedicineActive(medicine, "2026-10-08"), false);
});

test("keeps a 30-day course active through day 30, but not day 31", () => {
  const medicine = {
    repeatType: "days",
    repeatDays: 30,
    repeatStartDate: "2026-10-01",
    active: true
  };

  assert.equal(isMedicineActive(medicine, "2026-10-30"), true);
  assert.equal(isMedicineActive(medicine, "2026-10-31"), false);
  assert.equal(
    isMedicineActive(
      { repeatType: "until", active: true },
      "2026-10-31"
    ),
    true
  );
});

test("only returns due doses once for each local date and minute", () => {
  const record = {
    timeZone: "Asia/Dhaka",
    language: "en",
    medicines: [
      {
        id: "medicine-1",
        name: "Example",
        dosage: "1 tablet",
        repeatType: "until",
        active: true,
        doses: [
          { time: "11:30", lastPushKey: null },
          { time: "11:30", lastPushKey: "2026-10-0911:30" }
        ]
      }
    ]
  };

  const due = dueDoses(
    record,
    new Date("2026-10-09T05:30:00.000Z")
  );

  assert.equal(due.length, 1);
  assert.equal(due[0].pushKey, "2026-10-0911:30");
});

test("accepts known browser push services and rejects arbitrary endpoints", () => {
  const validSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/test",
    keys: {
      p256dh: "public-key",
      auth: "auth-key"
    }
  };

  assert.equal(validateSubscription(validSubscription), true);
  assert.equal(
    validateSubscription({
      ...validSubscription,
      endpoint: "https://127.0.0.1/internal"
    }),
    false
  );
});
