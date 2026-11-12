import type { Scene } from "@/engine/types";
import { koffiebarBarista } from "./nl/koffiebar-barista";
import { koffiebarKlant } from "./nl/koffiebar-klant";

/**
 * Unlock order for Dutch. The first scene is open from the start; each
 * following scene opens when the one before it is completed.
 * To add a scene: create a file in ./nl/ and append it here.
 */
export const scenesNl: Scene[] = [koffiebarKlant, koffiebarBarista];

export function findScene(id: string): Scene | undefined {
  return scenesNl.find((s) => s.id === id);
}
