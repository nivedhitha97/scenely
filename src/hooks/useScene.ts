import { useCallback, useEffect, useMemo, useReducer } from "react";

import { currentTurn, getTurn, initialState, reducer } from "@/engine/reducer";
import { completedPlayerTurns, playerTurnCount, promptFor } from "@/engine/selectors";
import type { PlayerTurn, Scene } from "@/engine/types";
import { speak, stopSpeaking } from "@/services/speech";
import { useVoice } from "./useVoice";

export type Line = { turnId: string; speaker: string; text: string };

/** Wires the pure reducer to speech and timing. All scene rules stay in the engine. */
export function useScene(scene: Scene) {
  const [state, dispatch] = useReducer(reducer, scene, initialState);
  const voice = useVoice(scene.language);
  const turn = currentTurn(scene, state);

  /**
   * The answers on screen. An NPC line that leads into a question shows the answers right away
   * (as in the v7 design); during feedback the answers of the turn just answered stay visible.
   */
  const choiceTurn: PlayerTurn | undefined = useMemo(() => {
    if (state.status === "feedback" && state.lastReaction) {
      const t = getTurn(scene, state.lastReaction.turnId);
      return t.kind === "player" ? t : undefined;
    }
    if (turn.kind === "player") return turn;
    if (turn.kind === "npc") {
      const next = getTurn(scene, turn.next);
      if (next.kind === "player") return next;
    }
    return undefined;
  }, [scene, state.status, state.lastReaction, turn]);

  /** The line in the speech bubble: the NPC's current line, or the question being answered. */
  const line: Line | undefined = useMemo(() => {
    if (choiceTurn) {
      const prompt = promptFor(scene, choiceTurn.id);
      return prompt && { turnId: prompt.id, speaker: prompt.speaker, text: prompt.text };
    }
    if (turn.kind === "player") return undefined;
    return { turnId: turn.id, speaker: turn.speaker, text: turn.text };
  }, [scene, choiceTurn, turn]);

  const say = useCallback(
    (slow = false) => {
      if (voice.status !== "ready" || !line) return;
      void speak(line.text, { language: scene.language, voice: voice.voice, slow });
    },
    [voice, line, scene.language],
  );

  /** Speaks any text in the scene's language, e.g. the learner's own sentence as an example. */
  const sayText = useCallback(
    (text: string, slow = false) => {
      if (voice.status !== "ready") return;
      void speak(text, { language: scene.language, voice: voice.voice, slow });
    },
    [voice, scene.language],
  );

  // Speak each new NPC line once the voice is known (not again during feedback).
  const speakKey = state.status === "feedback" || turn.kind === "player" ? null : state.currentTurnId;
  const voiceReady = voice.status === "ready";
  useEffect(() => {
    if (speakKey && voiceReady) say(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- speak only when the line changes
  }, [speakKey, voiceReady]);

  // A wrong answer: the NPC repeats the question slowly.
  const reaction = state.lastReaction;
  useEffect(() => {
    if (reaction && !reaction.correct) say(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per wrong answer
  }, [reaction]);

  // A right answer stays on screen ("Goed zo!") until the learner taps Verder.

  useEffect(() => stopSpeaking, []);

  return {
    state,
    turn,
    line,
    choiceTurn,
    voiceStatus: voice.status,
    tulips: { total: playerTurnCount(scene), done: completedPlayerTurns(state) },
    say,
    sayText,
    choose: (choiceId: string) => {
      // Answering while the NPC line is showing first moves on to the question it leads into.
      if (turn.kind === "npc") dispatch({ type: "NEXT", scene });
      dispatch({ type: "CHOOSE", scene, choiceId });
    },
    next: () => dispatch({ type: "NEXT", scene }),
    restart: () => dispatch({ type: "RESTART", scene }),
  };
}
