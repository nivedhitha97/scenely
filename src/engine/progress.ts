import type { Scene } from "./types";

export type SceneRecord = {
  /** Attempts per player turn from the most recent completion. */
  attempts: Record<string, number>;
  completedAt: string;
};

export type Progress = {
  completed: Record<string, SceneRecord>;
  /** Scene ids whose badge has been earned, in the order they were earned. */
  badges: string[];
};

export type SceneStatus = "locked" | "unlocked" | "completed";

export const emptyProgress: Progress = { completed: {}, badges: [] };

/** The first scene is always open; each later scene opens when the previous one is completed. */
export function sceneStatus(ordered: Scene[], progress: Progress, sceneId: string): SceneStatus {
  const index = ordered.findIndex((s) => s.id === sceneId);
  if (index === -1) throw new Error(`Unknown scene "${sceneId}"`);
  if (progress.completed[sceneId]) return "completed";
  if (index === 0) return "unlocked";
  return progress.completed[ordered[index - 1].id] ? "unlocked" : "locked";
}

/**
 * Records a completed play-through. The badge is awarded only the first time.
 * Returns a new Progress object; the input is not changed.
 */
export function completeScene(
  progress: Progress,
  sceneId: string,
  attempts: Record<string, number>,
  now: Date = new Date(),
): { progress: Progress; badgeEarned: boolean } {
  const badgeEarned = !progress.badges.includes(sceneId);
  return {
    badgeEarned,
    progress: {
      completed: {
        ...progress.completed,
        [sceneId]: { attempts: { ...attempts }, completedAt: now.toISOString() },
      },
      badges: badgeEarned ? [...progress.badges, sceneId] : progress.badges,
    },
  };
}

/**
 * Tulip rating from 1 to 3: 3 when every turn was right first time,
 * 2 when at most one extra try was needed overall, otherwise 1.
 */
export function rating(attempts: Record<string, number>): 1 | 2 | 3 {
  const extra = Object.values(attempts).reduce((sum, n) => sum + Math.max(0, n - 1), 0);
  if (extra === 0) return 3;
  if (extra === 1) return 2;
  return 1;
}
