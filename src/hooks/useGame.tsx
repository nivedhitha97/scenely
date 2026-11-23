import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { completeScene, emptyProgress, type Progress } from "@/engine/progress";
import { loadAvatar, loadProgress, saveAvatar, saveProgress, type AvatarChoice } from "@/services/storage";

type Game = {
  /** False until saved progress and avatar have been read. */
  ready: boolean;
  language: string;
  progress: Progress;
  avatar: AvatarChoice | null;
  setAvatar: (avatar: AvatarChoice) => void;
  /** Saves a completion and returns the progress before and after it. */
  recordCompletion: (sceneId: string, attempts: Record<string, number>) => { before: Progress; after: Progress; badgeEarned: boolean };
  /** Place ids of a walk the map should play next (set after finishing a place). Not saved. */
  pendingWalk: { from: string; to: string } | null;
  setPendingWalk: (walk: { from: string; to: string } | null) => void;
  /** Replaces all progress for this language (account sync, "Voortgang wissen") and saves it. */
  replaceProgress: (next: Progress) => void;
};

const GameContext = createContext<Game | null>(null);

/** Holds the learner's saved state for one language and writes every change to storage. */
export function GameProvider({ language, children }: { language: string; children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [avatar, setAvatarState] = useState<AvatarChoice | null>(null);
  const [pendingWalk, setPendingWalk] = useState<{ from: string; to: string } | null>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    let alive = true;
    Promise.all([loadProgress(language), loadAvatar()]).then(([p, a]) => {
      if (!alive) return;
      progressRef.current = p;
      setProgress(p);
      setAvatarState(a);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [language]);

  const setAvatar = useCallback((next: AvatarChoice) => {
    setAvatarState(next);
    saveAvatar(next).catch(() => {});
  }, []);

  const replaceProgress = useCallback(
    (next: Progress) => {
      progressRef.current = next;
      setProgress(next);
      saveProgress(language, next).catch(() => {});
    },
    [language],
  );

  const recordCompletion = useCallback(
    (sceneId: string, attempts: Record<string, number>) => {
      const before = progressRef.current;
      const { progress: after, badgeEarned } = completeScene(before, sceneId, attempts);
      progressRef.current = after;
      setProgress(after);
      saveProgress(language, after).catch(() => {});
      return { before, after, badgeEarned };
    },
    [language],
  );

  const value = useMemo(
    () => ({ ready, language, progress, avatar, setAvatar, recordCompletion, pendingWalk, setPendingWalk, replaceProgress }),
    [ready, language, progress, avatar, setAvatar, recordCompletion, pendingWalk, replaceProgress],
  );
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): Game {
  const game = useContext(GameContext);
  if (!game) throw new Error("useGame must be used inside <GameProvider>");
  return game;
}
