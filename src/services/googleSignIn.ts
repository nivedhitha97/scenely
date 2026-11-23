import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signOut, type User } from "firebase/auth";
import { Platform, TurboModuleRegistry } from "react-native";

import { firebaseAuth, firebaseConfigured } from "./firebase";

type GoogleModule = typeof import("@react-native-google-signin/google-signin");

let cached: GoogleModule | null | undefined;

/** The native Google sign-in library, or null where it isn't built in (Expo Go, tests). */
function google(): GoogleModule | null {
  if (cached !== undefined) return cached;
  cached = null;
  if (Platform.OS === "web" || !TurboModuleRegistry.get("RNGoogleSignin")) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("@react-native-google-signin/google-signin") as GoogleModule;
    mod.GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    });
    cached = mod;
  } catch {
    cached = null;
  }
  return cached;
}

/** True when "Doorgaan met Google" can work here: a development build or the web, with Firebase set up. */
export function canSignInWithGoogle(): boolean {
  if (!firebaseConfigured) return false;
  return Platform.OS === "web" || google() !== null;
}

/**
 * Signs in with Google and then with Firebase. Resolves the Firebase user, or null when the
 * learner closed the Google sheet.
 */
export async function signInWithGoogle(): Promise<User | null> {
  const auth = firebaseAuth();
  if (!auth) throw new Error("Firebase is not set up");
  if (Platform.OS === "web") {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result.user;
  }
  const g = google();
  if (!g) throw new Error("Google sign-in needs a development build");
  await g.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await g.GoogleSignin.signIn();
  if (!g.isSuccessResponse(response)) return null;
  const idToken = response.data.idToken;
  if (!idToken) throw new Error("Google returned no ID token");
  const result = await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
  return result.user;
}

/** Signs out of Firebase and Google, so the next sign-in asks which account to use. */
export async function signOutEverywhere(): Promise<void> {
  const auth = firebaseAuth();
  if (auth) await signOut(auth);
  const g = google();
  if (g) await g.GoogleSignin.signOut().catch(() => {});
}
