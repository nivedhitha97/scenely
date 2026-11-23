import { useEffect, useRef, useState } from "react";

import { mergeProgress } from "@/engine/progress";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useSettings } from "@/hooks/useSettings";
import { loadCloud, saveCloud } from "@/services/cloud";

const SAVE_DELAY_MS = 1000;

/**
 * Keeps a signed-in learner's account in step with this phone. On sign-in it merges the two
 * (no progress is lost on either side; the account's avatar and settings win), then it saves
 * every change a moment after it happens. Renders nothing; without an account it does nothing.
 */
export function CloudSync() {
  const { user } = useAuth();
  const game = useGame();
  const { ready: settingsReady, settings, replace } = useSettings();
  const [syncedUid, setSyncedUid] = useState<string | null>(null);
  const latest = useRef({ game, settings, replace });
  useEffect(() => {
    latest.current = { game, settings, replace };
  });

  const uid = user?.uid ?? null;
  const name = user?.displayName ?? null;

  // First sync after signing in.
  useEffect(() => {
    if (!uid || !game.ready || !settingsReady || syncedUid === uid) return;
    let alive = true;
    (async () => {
      const { game: g, settings: s, replace: setSettings } = latest.current;
      const remote = await loadCloud(uid);
      if (!alive) return;
      const remoteProgress = remote?.progress[g.language];
      const progress = remoteProgress ? mergeProgress(g.progress, remoteProgress) : g.progress;
      const avatar = remote?.avatar ?? g.avatar;
      const nextSettings = remote?.settings ?? s;
      g.replaceProgress(progress);
      if (avatar && avatar !== g.avatar) g.setAvatar(avatar);
      if (nextSettings !== s) setSettings(nextSettings);
      await saveCloud(uid, { avatar, settings: nextSettings, language: g.language, progress, name });
      if (alive) setSyncedUid(uid);
    })().catch(() => {
      // Offline or Firestore not set up: keep playing on this phone; try again next start.
    });
    return () => {
      alive = false;
    };
  }, [uid, name, game.ready, settingsReady, syncedUid]);

  // Save changes once synced.
  const { progress, avatar, language } = game;
  useEffect(() => {
    if (!uid || syncedUid !== uid) return;
    const id = setTimeout(() => {
      saveCloud(uid, { avatar, settings, language, progress }).catch(() => {});
    }, SAVE_DELAY_MS);
    return () => clearTimeout(id);
  }, [uid, syncedUid, progress, avatar, settings, language]);

  return null;
}
