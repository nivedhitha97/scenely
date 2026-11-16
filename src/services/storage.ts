import AsyncStorage from "@react-native-async-storage/async-storage";

import { emptyProgress, type Progress } from "@/engine/progress";

/** The learner's avatar: one of the looks plus a clothing colour. Shared by all languages. */
export type AvatarChoice = { look: number; outfit: string };

const AVATAR_KEY = "scenely/v1/avatar";
const progressKey = (language: string) => `scenely/v1/progress/${language}`;

function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<Progress>;
  return !!v.completed && typeof v.completed === "object" && Array.isArray(v.badges);
}

function isAvatar(value: unknown): value is AvatarChoice {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<AvatarChoice>;
  return typeof v.look === "number" && typeof v.outfit === "string";
}

async function readJson(key: string): Promise<unknown> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Unreadable or corrupt storage: start fresh rather than crash.
    return null;
  }
}

/** Progress is stored per language, so starting a new language starts a new map. */
export async function loadProgress(language: string): Promise<Progress> {
  const value = await readJson(progressKey(language));
  return isProgress(value) ? value : emptyProgress;
}

export async function saveProgress(language: string, progress: Progress): Promise<void> {
  await AsyncStorage.setItem(progressKey(language), JSON.stringify(progress));
}

export async function loadAvatar(): Promise<AvatarChoice | null> {
  const value = await readJson(AVATAR_KEY);
  return isAvatar(value) ? value : null;
}

export async function saveAvatar(avatar: AvatarChoice): Promise<void> {
  await AsyncStorage.setItem(AVATAR_KEY, JSON.stringify(avatar));
}
