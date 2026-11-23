import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import type { Progress } from "@/engine/progress";
import { firestore } from "./firebase";
import { parseSettings, type Settings } from "./settings";
import { isAvatar, isProgress, type AvatarChoice } from "./storage";

/**
 * What a learner's account keeps in Firestore, at users/{uid}. Only the learner can read or
 * write it (see firestore.rules).
 */
export type CloudProfile = {
  avatar: AvatarChoice | null;
  settings: Settings | null;
  /** Progress per language, keyed like "nl-NL". */
  progress: Record<string, Progress>;
};

/** Reads a Firestore document body into a CloudProfile, dropping anything malformed. */
export function parseCloudProfile(data: unknown): CloudProfile {
  const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const progress: Record<string, Progress> = {};
  if (d.progress && typeof d.progress === "object") {
    for (const [lang, p] of Object.entries(d.progress as Record<string, unknown>)) if (isProgress(p)) progress[lang] = p;
  }
  return {
    avatar: isAvatar(d.avatar) ? d.avatar : null,
    settings: d.settings ? parseSettings(d.settings) : null,
    progress,
  };
}

/** The learner's saved profile, or null when the account has nothing saved yet. */
export async function loadCloud(uid: string): Promise<CloudProfile | null> {
  const db = firestore();
  if (!db) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? parseCloudProfile(snap.data()) : null;
}

/** Saves part of the profile; fields not given are kept. */
export async function saveCloud(
  uid: string,
  data: { avatar?: AvatarChoice | null; settings?: Settings; language?: string; progress?: Progress; name?: string | null },
): Promise<void> {
  const db = firestore();
  if (!db) return;
  const body: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (data.avatar !== undefined) body.avatar = data.avatar;
  if (data.settings) body.settings = data.settings;
  if (data.name !== undefined) body.name = data.name;
  if (data.language && data.progress) body.progress = { [data.language]: data.progress };
  await setDoc(doc(db, "users", uid), body, { merge: true });
}

/** Removes everything the account stored. */
export async function deleteCloud(uid: string): Promise<void> {
  const db = firestore();
  if (!db) return;
  await deleteDoc(doc(db, "users", uid));
}
