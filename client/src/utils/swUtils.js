export const saveSubscription = async (subscription) => {
  try {
    const response = await fetch("http://localhost:8080/subscribe", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(subscription),
    });
    return response.json();
  } catch (error) {
    console.error("Error saving subscription:", error);
    throw error;
  }
};

export const registerSW = async () => {
  try {
    if (!("serviceWorker" in navigator)) {
      throw new Error("No support for service worker!");
    }
    const registration = await navigator.serviceWorker.register("/serviceWorker.js");
    console.log("Service worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("Error registering service worker:", error);
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  try {
    if (!("Notification" in window)) {
      throw new Error("No support for notification API");
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }
    console.log("Notification permission granted");
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    throw error;
  }
};
