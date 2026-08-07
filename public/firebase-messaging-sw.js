/* Firebase Cloud Messaging background worker (push only — not an app-shell cache).
   Config is passed as a query param by src/lib/push.ts so there is a single source of truth. */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

try {
  const params = new URL(self.location.href).searchParams;
  const config = JSON.parse(params.get("config") || "{}");

  if (config && config.apiKey) {
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(function (payload) {
      const n = (payload && payload.notification) || {};
      const data = (payload && payload.data) || {};
      self.registration.showNotification(n.title || "OM Value Homes CRM", {
        body: n.body || "",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        data: { link: data.link || "/dashboard" },
      });
    });
  }
} catch (e) {
  /* keep the worker alive even if config is missing */
}

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const link = (event.notification.data && event.notification.data.link) || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(link);
          return client.focus();
        }
      }
      return self.clients.openWindow(link);
    }),
  );
});
