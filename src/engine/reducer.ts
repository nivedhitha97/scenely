import type { Scene, Turn } from "./types";

export type Reaction = {
  correct: boolean;
  reaction: string;
  choiceId: string;
  /** The player turn the choice was made on. */
  turnId: string;
};

export type PlayState = {
  sceneId: string;
  currentTurnId: string;
  /** Number of choices made per player turn (correct and incorrect). */
  attempts: Record<string, number>;
  /**
   * playing:  waiting for the NPC line to finish or for the learner to choose
   * feedback: a correct choice was made; the UI plays the reaction, then sends NEXT
   * done:     an end turn was reached
   */
  status: "playing" | "feedback" | "done";
  lastReaction?: Reaction;
};

export type Action =
  | { type: "START"; scene: Scene }
  | { type: "CHOOSE"; scene: Scene; choiceId: string }
  | { type: "NEXT"; scene: Scene }
  | { type: "RESTART"; scene: Scene };

export function getTurn(scene: Scene, turnId: string): Turn {
  const turn = scene.turns[turnId];
  if (!turn) {
    throw new Error(`Scene "${scene.id}" has no turn "${turnId}"`);
  }
  return turn;
}

export function currentTurn(scene: Scene, state: PlayState): Turn {
  return getTurn(scene, state.currentTurnId);
}

function enter(scene: Scene, turnId: string): Pick<PlayState, "currentTurnId" | "status"> {
  const turn = getTurn(scene, turnId);
  return { currentTurnId: turnId, status: turn.kind === "end" ? "done" : "playing" };
}

export function initialState(scene: Scene): PlayState {
  return { sceneId: scene.id, attempts: {}, ...enter(scene, scene.start) };
}

/** Pure state transitions. No speech, animation or storage here. */
export function reducer(state: PlayState, action: Action): PlayState {
  switch (action.type) {
    case "START":
    case "RESTART":
      return initialState(action.scene);

    case "CHOOSE": {
      const { scene, choiceId } = action;
      if (state.status !== "playing") return state;
      const turn = currentTurn(scene, state);
      if (turn.kind !== "player") return state;
      const choice = turn.choices.find((c) => c.id === choiceId);
      if (!choice) return state;

      const attempts = { ...state.attempts, [turn.id]: (state.attempts[turn.id] ?? 0) + 1 };
      const lastReaction: Reaction = {
        correct: choice.correct,
        reaction: choice.reaction,
        choiceId: choice.id,
        turnId: turn.id,
      };

      if (!choice.correct) {
        return { ...state, attempts, lastReaction };
      }
      getTurn(scene, choice.next); // fail fast on broken data
      return { ...state, attempts, lastReaction, currentTurnId: choice.next, status: "feedback" };
    }

    case "NEXT": {
      const { scene } = action;
      if (state.status === "feedback") {
        return { ...state, lastReaction: undefined, ...enter(scene, state.currentTurnId) };
      }
      if (state.status !== "playing") return state;
      const turn = currentTurn(scene, state);
      if (turn.kind !== "npc") return state;
      return { ...state, lastReaction: undefined, ...enter(scene, turn.next) };
    }
  }
}
