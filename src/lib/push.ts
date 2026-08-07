import { supabase } from "@/integrations/supabase/client";
import { firebaseConfig, firebaseVapidKey, isPushConfigured } from "@/lib/firebase-config";

let registered = false;

/** Ask for browser notification permission (safe to call repeatedly). */
export async function ensureNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

/** Show a browser notification for a live event (app open / minimised). */
export function showLocalNotification(title: string, body: string, link?: string | null) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    const n = new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: link ?? title,
    });
    n.onclick = () => {
      window.focus();
      if (link) window.location.assign(link);
      n.close();
    };
  } catch {
    /* some browsers require the SW path; ignored */
  }
}

/**
 * Register this device for Firebase Cloud Messaging background push and store
 * the token in Supabase. No-ops safely when Firebase keys aren't configured yet.
 */
export async function registerPushToken(userId: string) {
  if (registered || !isPushConfigured) return;
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if ((await ensureNotificationPermission()) !== "granted") return;

  try {
    const [{ initializeApp, getApps }, { getMessaging, getToken, onMessage, isSupported }] = await Promise.all([
      import("firebase/app"),
      import("firebase/messaging"),
    ]);
    if (!(await isSupported())) return;

    const app = getApps()[0] ?? initializeApp(firebaseConfig);
    const swUrl = `/firebase-messaging-sw.js?config=${encodeURIComponent(JSON.stringify(firebaseConfig))}`;
    const swReg = await navigator.serviceWorker.register(swUrl, { scope: "/firebase-cloud-messaging-push-scope" });

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: swReg,
    });
    if (!token) return;

    registered = true;
    await supabase.from("push_tokens").upsert(
      { user_id: userId, token, platform: "web", updated_at: new Date().toISOString() },
      { onConflict: "token" },
    );

    onMessage(messaging, (payload) => {
      const n = payload.notification;
      if (n?.title) showLocalNotification(n.title, n.body ?? "", (payload.data?.["link"] as string) ?? null);
    });
  } catch {
    /* push is optional; in-app realtime keeps working */
  }
}
