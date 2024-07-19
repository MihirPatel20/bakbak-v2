// src/serviceWorkerRegistration.js

import api from "api";
import { urlBase64ToUint8Array } from "./utils/swUtils";

const subscriptionOptions = {
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(
    "BB4Le-0DZZyObayiEagTgTfc9pFfJ7Ix4or9uxY4VLb-vc71vvb6eVMzvUOqu1TnIsz_lLo20kA_2SiFv-5ZYtA"
  ),
};

const saveSubscription = async (subscription) => {
  console.log("subscription: ", subscription);
  try {
    const response = await api.post(
      `${
        import.meta.env.VITE_SERVER_API_URI
      }/notificationSubscription/subscribe`,
      subscription
    );
    return response;
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

    const registration = await navigator.serviceWorker.register(
      "serviceWorker.js"
    );
    console.log("Service worker registered ✅", registration);

    // Wait for the service worker to be ready
    const swRegistration = await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    try {
      const existingSubscription =
        await swRegistration.pushManager.getSubscription();
      if (!existingSubscription) {
        // Subscribe to push notifications
        const subscription = await swRegistration.pushManager.subscribe(
          subscriptionOptions
        );

        const res = await saveSubscription(subscription); // Save subscription details
        console.log("Subscription saved:", res);
      } else {
        console.log("Already subscribed:", existingSubscription);
      }
    } catch (error) {
      console.error("Error handling subscription:", error);
    }

    return registration;
  } catch (error) {
    console.error("Error registering service worker:", error);
    throw error;
  }
};
