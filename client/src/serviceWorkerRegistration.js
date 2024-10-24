// src/serviceWorkerRegistration.js
import api from "api";
import { urlBase64ToUint8Array } from "./utils/swUtils";

// Configuration
const subscriptionOptions = {
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(
    "BB4Le-0DZZyObayiEagTgTfc9pFfJ7Ix4or9uxY4VLb-vc71vvb6eVMzvUOqu1TnIsz_lLo20kA_2SiFv-5ZYtA"
  ),
};

// Get Push Subscription
const getPushSubscription = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("No support for service worker!");
    return null;
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      return subscription;
    } else {
      console.log("No existing subscription found.");
      return null;
    }
  } catch (error) {
    console.error("Error getting push subscription:", error);
    return null;
  }
};

// Permission Handling
const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }
};

// Service Worker Registration Check
export const checkSWRegistration = async () => {
  try {
    if (!("serviceWorker" in navigator)) {
      console.log("No support for service worker!");
      return false;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length === 0) {
      console.log("No service worker registered for this origin.");
      return false;
    }
    const isRegistered = registrations.some((registration) =>
      registration.active.scriptURL.includes("serviceWorker.js")
    );
    console.log(
      isRegistered
        ? "Service worker already registered."
        : "No matching service worker found."
    );
    return isRegistered;
  } catch (error) {
    console.error("Error checking service worker registration:", error);
    return false;
  }
};

// Service Worker Registration
export const registerSW = async () => {
  try {
    if (!("serviceWorker" in navigator)) {
      console.error("No support for service worker!");
      return null;
    }
    const registration = await navigator.serviceWorker.register(
      "serviceWorker.js"
    );
    console.log("Service worker registered ✅", registration);
    return registration;
  } catch (error) {
    console.error("Error registering service worker:", error);
    return null;
  }
};

// API Communication
const sendSubscriptionToServer = async (subscription) => {
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
    return null;
  }
};

// Push Notification Subscription
const subscribeToPushNotifications = async (swRegistration) => {
  try {
    const existingSubscription =
      await swRegistration.pushManager.getSubscription();
    if (!existingSubscription) {
      const subscription = await swRegistration.pushManager.subscribe(
        subscriptionOptions
      );
      const res = await sendSubscriptionToServer(subscription);
    } else {
      console.log("Already subscribed:", existingSubscription);
    }
  } catch (error) {
    console.error("Error handling subscription:", error);
  }
};

const updatePushSubscriptionStatus = async (action) => {
  const subscription = await getPushSubscription();

  if (subscription) {
    try {
      const response = await api.post(
        import.meta.env.VITE_SERVER_API_URI +
          `/notificationSubscription/${action}`,
        subscription
      );
      console.log(`Subscription ${action} response: `, response);
      return response;
    } catch (error) {
      console.error(`Error ${action} subscription:`, error);
      return null;
    }
  } else {
    console.log("User has not subscribed to push notifications.");
  }
};

const removeSubscriptionFromServer = async (subscription) => {
  console.log("Removing subscription: ", subscription);
  try {
    const response = await api.post(
      `${
        import.meta.env.VITE_SERVER_API_URI
      }/notificationSubscription/unsubscribe`,
      subscription
    );
    return response;
  } catch (error) {
    console.error("Error removing subscription:", error);
    return null;
  }
};

// Push Notification Unsubscription
const unsubscribeFromPushNotifications = async () => {
  const swRegistration = await navigator.serviceWorker.ready;

  try {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      const res = await removeSubscriptionFromServer(subscription);
    } else {
      console.log("No subscription found to unsubscribe.");
    }
  } catch (error) {
    console.error("Error handling unsubscription:", error);
  }
};

// Main Registration Process
const initializeServiceWorker = async () => {
  try {
    const registration = await registerSW();
    if (registration) {
      await requestNotificationPermission();
      const swRegistration = await navigator.serviceWorker.ready;
      await subscribeToPushNotifications(swRegistration);
    }
    return registration;
  } catch (error) {
    console.error("Error initializing service worker:", error);
    return null;
  }
};

export {
  initializeServiceWorker,
  getPushSubscription,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  updatePushSubscriptionStatus,
};
