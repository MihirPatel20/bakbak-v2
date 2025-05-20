// src/serviceWorkerRegistration.js
import api from "api";
import { urlBase64ToUint8Array } from "./utils/swUtils";

// Configuration
const subscriptionOptions = {
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(
    "BPXUXUqyCADcZ6LI4i5-ACoxW1r7ybjK03iDcfZ1Tfu9hw0S2MERHUrypZT8g01Vulmem8LH28Q-9yObZ-UcOn4"
  ),
};

// Get Push Subscription
const getPushSubscription = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service worker not supported.");
    return null;
  }

  try {
    const swRegistration = await navigator.serviceWorker.ready;
    const subscription = await swRegistration.pushManager.getSubscription();
    return subscription || null;
  } catch (error) {
    console.error("Failed to get push subscription:", error);
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
      registration.active?.scriptURL.includes("serviceWorker.js")
    );

    return isRegistered;
  } catch (error) {
    console.error("Error checking service worker registration:", error);
    return false;
  }
};

// Service Worker Registration
export const registerSW = async () => {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers not supported in this browser.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/serviceWorker.js"
    );
    return registration;
  } catch (error) {
    console.error("Failed to register service worker:", error);
    return null;
  }
};

// API Communication
const sendSubscriptionToServer = async (subscription) => {
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
      await sendSubscriptionToServer(subscription);
    }
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
  }
};

const updatePushSubscriptionStatus = async (action) => {
  const subscription = await getPushSubscription();

  if (subscription) {
    try {
      const response = await api.post(
        `${
          import.meta.env.VITE_SERVER_API_URI
        }/notificationSubscription/${action}`,
        subscription
      );
      return response;
    } catch (error) {
      console.error(`Error updating subscription to (${action}):`, error);
      return null;
    }
  }
};

// Remove Subscription from Server
const removeSubscriptionFromServer = async (subscription) => {
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
      await removeSubscriptionFromServer(subscription);
    }
  } catch (error) {
    console.error("Error unsubscribing from push notifications:", error);
  }
};

// Main Registration Process
const initializeServiceWorker = async () => {
  try {
    const registration = await registerSW();
    if (!registration) throw new Error("Service worker registration failed");

    await requestNotificationPermission();
    const swRegistration = await navigator.serviceWorker.ready;
    await subscribeToPushNotifications(swRegistration);

    return registration;
  } catch (error) {
    console.error("Error initializing service worker:", {
      message: error.message,
      stack: error.stack,
    });
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
