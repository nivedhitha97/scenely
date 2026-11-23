import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import { getAuth, initializeAuth, type Auth, type Persistence } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { Platform } from "react-native";

/**
 * Firebase for accounts and cloud progress (project scenely-eff51). The config comes from
 * EXPO_PUBLIC_FIREBASE_* in .env.local (see .env.example); without it the app runs without
 * accounts, on this device only.
 */
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = !!(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function firebaseApp(): FirebaseApp | null {
  if (!firebaseConfigured) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

/** Auth that stays signed in between launches (AsyncStorage on phones, the browser's storage on web). */
export function firebaseAuth(): Auth | null {
  const a = firebaseApp();
  if (!a) return null;
  if (!auth) {
    // Exported by the React Native build of firebase/auth only; missing from the default types.
    const rnPersistence = (FirebaseAuth as unknown as { getReactNativePersistence?: (s: typeof AsyncStorage) => Persistence })
      .getReactNativePersistence;
    auth = Platform.OS !== "web" && rnPersistence ? initializeAuth(a, { persistence: rnPersistence(AsyncStorage) }) : getAuth(a);
  }
  return auth;
}

export function firestore(): Firestore | null {
  const a = firebaseApp();
  if (!a) return null;
  if (!db) db = getFirestore(a);
  return db;
}
