import type { Choice, Scene, Turn } from "./types";

export type PractisedPhrase = {
  turnId: string;
  text: string;
  /** True when the learner said this sentence out loud and it was understood. */
  spoken: boolean;
};

export type SceneSummary = {
  /** Lines the other person said, the closing line included. */
  linesHeard: number;
  /** Player turns answered. */
  answers: number;
  /** Sentences said out loud and understood. */
  spokenAloud: number;
  /** The learner's correct answers, in the order they were given. */
  phrases: PractisedPhrase[];
};

/**
 * What the learner did in one play-through, for the completion screen. Follows the path through the
 * scene that the learner's answers took, from the start to the end turn.
 *
 * @param answers the correct choice id per player turn (PlayState.answers)
 * @param spoken  ids of player turns whose sentence was said out loud and understood
 */
export function sceneSummary(scene: Scene, answers: Record<string, string>, spoken: readonly string[]): SceneSummary {
  const phrases: PractisedPhrase[] = [];
  let linesHeard = 0;
  let id: string | undefined = scene.start;
  const seen = new Set<string>();

  while (id && !seen.has(id)) {
    seen.add(id);
    const turn: Turn | undefined = scene.turns[id];
    if (!turn) break;
    if (turn.kind === "end") {
      linesHeard += 1;
      break;
    }
    if (turn.kind === "npc") {
      linesHeard += 1;
      id = turn.next;
      continue;
    }
    const choice: Choice | undefined = turn.choices.find((c) => c.id === answers[turn.id] && c.correct);
    if (!choice) break; // the learner never answered this turn
    phrases.push({ turnId: turn.id, text: choice.label, spoken: spoken.includes(turn.id) });
    id = choice.next;
  }

  return {
    linesHeard,
    answers: phrases.length,
    spokenAloud: phrases.filter((p) => p.spoken).length,
    phrases,
  };
}
