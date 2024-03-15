// public/sw.js

self.addEventListener("install", (event) => {
  console.log("Service worker installed", event);
});

self.addEventListener("activate", async (event) => {
  console.log("Service worker activated", event);
});

self.addEventListener("push", async (event) => {
  try {
    const data = event.data.json();
    console.log("Push data:", data);
    self.registration.showNotification(data.title, data);
  } catch (error) {
    console.error("Error handling push event:", error);
  }
});

self.addEventListener("notificationclick", (event) => {
  console.log("On notification click: ", event.notification);
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/");
      })
  );
});

//---------------------------------------------------------------//
//                    Cleanup event listeners
//---------------------------------------------------------------//

// Remove event listeners when they're no longer needed
const cleanupListeners = () => {
  self.removeEventListener("push", handlePush);
  self.removeEventListener("notificationclick", handleNotificationClick);
};
// Cleanup event listeners when service worker is being terminated or unregistered
self.addEventListener("message", (event) => {
  if (event.data.action === "cleanup") {
    cleanupListeners();
  }
});
