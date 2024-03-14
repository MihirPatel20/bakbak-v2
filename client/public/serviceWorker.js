const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const saveSubscription = async (subscription) => {
  console.log("subscription: ", subscription);
  try {
    const response = await fetch(
      "http://localhost:8080/api/v1/notification/subscribe",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(subscription),
        credentials: "include", 
      }
    );
    if (!response.ok) self.registration.unregister();

    return response.json();
  } catch (error) {
    console.error("Error saving subscription:", error);
    //unregister the service worker
    self.registration.unregister();
    throw error;
  }
};

self.addEventListener("activate", async (e) => {
  console.log("active event");
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "BB4Le-0DZZyObayiEagTgTfc9pFfJ7Ix4or9uxY4VLb-vc71vvb6eVMzvUOqu1TnIsz_lLo20kA_2SiFv-5ZYtA"
    ),
  });
  const response = await saveSubscription(subscription);
  console.log(response);
});

self.addEventListener("push", (e) => {
  console.log("e: ", e);
  const data = e.data.json();
  console.log("data: ", data);
  self.registration.showNotification(data.title, data);
});
