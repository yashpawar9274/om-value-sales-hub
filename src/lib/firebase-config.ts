/**
 * Firebase Web Push (FCM) configuration.
 *
 * These are PUBLISHABLE values (safe in client code). Fill them from your
 * Firebase console: Project settings → General → Your apps → Web app,
 * and Cloud Messaging → Web Push certificates → Key pair (vapidKey).
 *
 * Until they are filled in, the CRM still delivers live in-app notifications
 * and browser notifications while the app is open — only background push
 * (app fully closed) stays disabled.
 */
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

export const firebaseVapidKey = "";

export const isPushConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId && firebaseConfig.appId,
);
