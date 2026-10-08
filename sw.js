const CACHE_NAME = "medicine-reminder-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./config.js",
  "./app.js",
  "./manifest.json"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Push notification
self.addEventListener("push", (event) => {
  let data = {
    title: "💊 Medicine Reminder",
    body: "It's time to take your medicine.",
    tag: "medicine-reminder",
    url: "./"
  };

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json()
      };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,
      data: {
        url: data.url || "./"
      },
      vibrate: [200, 100, 200],
      requireInteraction: true
    })
  );
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(
          event.notification.data?.url || "./"
        );
      }
    })
  );
});