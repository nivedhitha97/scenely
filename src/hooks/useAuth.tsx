import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteUser, onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { deleteCloud } from "@/services/cloud";
import { firebaseAuth } from "@/services/firebase";
import { canSignInWithGoogle, signInWithGoogle, signOutEverywhere } from "@/services/googleSignIn";

const WELCOME_KEY = "scenely/v1/welcome-done";

export type AuthError = "cancelled" | "unavailable" | "network" | "recent-login" | "unknown";

type AuthState = {
  /** False until the saved sign-in and the welcome flag have been read. */
  ready: boolean;
  user: User | null;
  /** True once the learner has signed in or chosen to continue without an account. */
  welcomed: boolean;
  /** Whether "Doorgaan met Google" works here (a development build or the web). */
  canSignIn: boolean;
  signIn: () => Promise<AuthError | null>;
  continueWithoutAccount: () => void;
  signOut: () => Promise<void>;
  /** Deletes the account and its saved data. Progress on this phone stays. */
  deleteAccount: () => Promise<AuthError | null>;
};

const AuthContext = createContext<AuthState>({
  ready: true,
  user: null,
  welcomed: true,
  canSignIn: false,
  signIn: async () => "unavailable",
  continueWithoutAccount: () => {},
  signOut: async () => {},
  deleteAccount: async () => "unavailable",
});

function errorKind(e: unknown): AuthError {
  const code = String((e as { code?: unknown })?.code ?? "");
  if (/cancel|popup-closed|SIGN_IN_CANCELLED|12501/i.test(code)) return "cancelled";
  if (/network/i.test(code)) return "network";
  if (/requires-recent-login/.test(code)) return "recent-login";
  return "unknown";
}

/** The signed-in learner (Google via Firebase), or nobody when they use Scenely without an account. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Without Firebase there is nothing to wait for.
  const [authReady, setAuthReady] = useState(() => firebaseAuth() === null);
  const [welcomed, setWelcomed] = useState(false);
  const [welcomeReady, setWelcomeReady] = useState(false);
  const [canSignIn] = useState(canSignInWithGoogle);

  useEffect(() => {
    const auth = firebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(WELCOME_KEY)
      .then((v) => setWelcomed(v === "1"))
      .catch(() => {})
      .finally(() => setWelcomeReady(true));
  }, []);

  const markWelcomed = useCallback(() => {
    setWelcomed(true);
    AsyncStorage.setItem(WELCOME_KEY, "1").catch(() => {});
  }, []);

  const signIn = useCallback(async (): Promise<AuthError | null> => {
    if (!canSignIn) return "unavailable";
    try {
      const u = await signInWithGoogle();
      if (!u) return "cancelled";
      markWelcomed();
      return null;
    } catch (e) {
      return errorKind(e);
    }
  }, [canSignIn, markWelcomed]);

  const signOut = useCallback(() => signOutEverywhere(), []);

  const deleteAccount = useCallback(async (): Promise<AuthError | null> => {
    const u = firebaseAuth()?.currentUser;
    if (!u) return "unavailable";
    try {
      await deleteCloud(u.uid);
      await deleteUser(u);
      await signOutEverywhere();
      return null;
    } catch (e) {
      return errorKind(e);
    }
  }, []);

  const value = useMemo(
    () => ({ ready: authReady && welcomeReady, user, welcomed: welcomed || !!user, canSignIn, signIn, continueWithoutAccount: markWelcomed, signOut, deleteAccount }),
    [authReady, welcomeReady, user, welcomed, canSignIn, signIn, markWelcomed, signOut, deleteAccount],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
