import type { Scene } from "./types";

/**
 * Checks a scene's data for broken links and dead ends.
 * Returns a list of problems; an empty list means the scene is playable.
 */
export function validateScene(scene: Scene): string[] {
  const errors: string[] = [];
  const has = (id: string) => Object.prototype.hasOwnProperty.call(scene.turns, id);

  if (!has(scene.start)) errors.push(`start turn "${scene.start}" does not exist`);

  for (const [key, turn] of Object.entries(scene.turns)) {
    if (turn.id !== key) errors.push(`turn key "${key}" does not match its id "${turn.id}"`);
    if (turn.kind === "npc" && !has(turn.next)) {
      errors.push(`npc turn "${turn.id}" points to missing turn "${turn.next}"`);
    }
    if (turn.kind === "player") {
      if (!turn.choices.some((c) => c.correct)) {
        errors.push(`player turn "${turn.id}" has no correct choice`);
      }
      const ids = new Set<string>();
      for (const c of turn.choices) {
        if (ids.has(c.id)) errors.push(`player turn "${turn.id}" repeats choice id "${c.id}"`);
        ids.add(c.id);
        if (c.correct && !has(c.next)) {
          errors.push(`choice "${c.id}" points to missing turn "${c.next}"`);
        }
      }
    }
  }

  if (has(scene.start)) {
    const seen = new Set<string>();
    const queue = [scene.start];
    let reachesEnd = false;
    while (queue.length > 0) {
      const id = queue.shift() as string;
      if (seen.has(id) || !has(id)) continue;
      seen.add(id);
      const turn = scene.turns[id];
      if (turn.kind === "end") reachesEnd = true;
      else if (turn.kind === "npc") queue.push(turn.next);
      else turn.choices.filter((c) => c.correct).forEach((c) => queue.push(c.next));
    }
    if (!reachesEnd) errors.push("no end turn is reachable from the start");
  }

  return errors;
}
