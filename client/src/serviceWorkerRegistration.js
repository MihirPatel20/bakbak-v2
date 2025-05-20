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
  console.log("🔍 Checking for service worker support...");
  if (!("serviceWorker" in navigator)) {
    console.error("❌ No support for service worker!");
    return null;
  }

  try {
    console.log("⏳ Waiting for service worker to be ready...");
    const swRegistration = await navigator.serviceWorker.ready;
    console.log("✅ Service worker is ready");

    console.log("🔍 Checking for existing push subscription...");
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      console.log("✅ Found existing subscription:", subscription);
      return subscription;
    } else {
      console.log("ℹ️ No existing subscription found.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error getting push subscription:", error);
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
let isSWRegistered = false;

export const registerSW = async () => {
  if (isSWRegistered) {
    console.log("🟡 Service worker already registered.");
    return;
  }

  if (!("serviceWorker" in navigator)) {
    console.error("Service workers not supported in this browser. ❌");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      "/serviceWorker.js"
    );
    console.log("Service worker registered ✅:", registration);
    isSWRegistered = true;
    return registration;
  } catch (error) {
    console.error("Failed to register service worker ❌:", error);
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
  console.log("Updating push subscription status: ", action);
  const subscription = await getPushSubscription();
  console.log("Subscription: ", subscription);

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
  console.log("🚀 Starting service worker initialization...");
  try {
    console.log("📥 Attempting to register service worker...");
    const registration = await registerSW();

    if (registration) {
      console.log("✅ Service worker registration successful:", registration);
      console.log("🔔 Requesting notification permission...");

      try {
        await requestNotificationPermission();
        console.log("✅ Notification permission granted");
      } catch (permError) {
        console.error("❌ Notification permission error:", permError);
        throw permError;
      }

      console.log("⏳ Waiting for service worker to be ready...");
      const swRegistration = await navigator.serviceWorker.ready;
      console.log("✅ Service worker is ready:", swRegistration);

      console.log("📱 Setting up push notification subscription...");
      await subscribeToPushNotifications(swRegistration);
      console.log("✅ Push notification setup complete");
    } else {
      console.error("❌ Service worker registration failed");
    }
    return registration;
  } catch (error) {
    console.error("💥 Error in service worker initialization:", {
      message: error.message,
      stack: error.stack,
    });
    return null;
  } finally {
    console.log("🏁 Service worker initialization process completed");
  }
};

export {
  initializeServiceWorker,
  getPushSubscription,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  updatePushSubscriptionStatus,
};
