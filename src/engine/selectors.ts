import type { PlayState } from "./reducer";
import type { NpcTurn, Scene } from "./types";

/** The NPC line that leads into a player turn (shown above the stickers). */
export function promptFor(scene: Scene, playerTurnId: string): NpcTurn | undefined {
  return Object.values(scene.turns).find(
    (t): t is NpcTurn => t.kind === "npc" && t.next === playerTurnId,
  );
}

/** How many player turns the scene has (one tulip each). */
export function playerTurnCount(scene: Scene): number {
  return Object.values(scene.turns).filter((t) => t.kind === "player").length;
}

/** Player turns already answered correctly in this play-through. */
export function completedPlayerTurns(state: PlayState): number {
  return Object.keys(state.attempts).filter((id) => id !== state.currentTurnId).length;
}
