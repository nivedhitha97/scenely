import { sceneStatus, type Progress } from "./progress";
import type { Scene } from "./types";

/** A spot on a country's map. Each place holds the scenes (one per role) of one scenario. */
export type Place = {
  id: string;
  title: string;
  /** One short line about the goal, in the target language. */
  blurb: string;
  icon: string;
  /** Scene ids in role order. Empty while the place's scenes are still being written. */
  sceneIds: string[];
  /** Role names shown on the map for places whose scenes don't exist yet. */
  roles: string[];
  /** Where the avatar stands, in map coordinates (the map is 900 × 1180). */
  door: { x: number; y: number };
};

/** soon: no scenes yet. locked: scenes exist but none is open. open: at least one scene to play. done: every scene completed. */
export type PlaceStatus = "soon" | "locked" | "open" | "done";

export function placeStatus(place: Place, scenes: Scene[], progress: Progress): PlaceStatus {
  if (place.sceneIds.length === 0) return "soon";
  const statuses = place.sceneIds.map((id) => sceneStatus(scenes, progress, id));
  if (statuses.every((s) => s === "completed")) return "done";
  if (statuses.some((s) => s === "unlocked")) return "open";
  return "locked";
}

/**
 * The place where the learner's avatar stands: the first place not yet finished
 * (so after finishing a place, the avatar waits at the next one), else the last place.
 */
export function currentPlace(places: Place[], scenes: Scene[], progress: Progress): Place {
  return places.find((p) => placeStatus(p, scenes, progress) !== "done") ?? places[places.length - 1];
}

/** Places the learner has reached: finished or open. */
export function discoveredCount(places: Place[], scenes: Scene[], progress: Progress): number {
  return places.filter((p) => {
    const st = placeStatus(p, scenes, progress);
    return st === "done" || st === "open";
  }).length;
}

/**
 * After a completion: if it finished a place for the first time, the avatar walks from there
 * to the next place on the map. Returns null when no walk is due.
 */
export function walkAfter(
  places: Place[],
  scenes: Scene[],
  before: Progress,
  after: Progress,
): { from: Place; to: Place } | null {
  const index = places.findIndex(
    (p) => placeStatus(p, scenes, after) === "done" && placeStatus(p, scenes, before) !== "done",
  );
  if (index === -1 || index === places.length - 1) return null;
  return { from: places[index], to: places[index + 1] };
}

export function placeForScene(places: Place[], sceneId: string): Place | undefined {
  return places.find((p) => p.sceneIds.includes(sceneId));
}
