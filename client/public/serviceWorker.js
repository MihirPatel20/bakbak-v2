// public/serviceWorker.js

self.addEventListener("install", (event) => {
  console.log("Service worker installed", event);
});

self.addEventListener("activate", async (event) => {
  console.log("Service worker activated", event);
});

self.addEventListener("push", async (event) => {
  try {
    const data = event.data.json();
    self.registration.showNotification(data.title, data);
  } catch (error) {
    console.error("Error handling push event:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  event.waitUntil(
    (async () => {
      const targetUrl = event.notification.data.url || "/";
      const clientList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // Case 1: User has opened our website but are on a different location
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const targetUrlObj = new URL(targetUrl, self.location.origin);

        if (clientUrl.origin === targetUrlObj.origin) {
          // Found a client with our origin, navigate it
          await client.navigate(targetUrl);
          await client.focus();
          return;
        }
      }

      // Case 2: User has not opened the website, open a new tab
      await clients.openWindow(targetUrl);
    })()
  );
});

// Cleanup event listeners when service worker is being terminated or unregistered
self.addEventListener("message", (event) => {
  if (event.data.action === "cleanup") {
    self.removeEventListener("push", handlePush);
    self.removeEventListener("notificationclick", handleNotificationClick);
  }
});
