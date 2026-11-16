import { useEffect, useState } from "react";

import { loadVoice } from "@/services/speech";

export type VoiceState =
  | { status: "loading" }
  | { status: "ready"; voice: string }
  | { status: "missing" };

/** Finds the device voice for a language. "missing" means the learner must install one. */
export function useVoice(language: string): VoiceState {
  const [state, setState] = useState<VoiceState>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    loadVoice(language).then((voice) => {
      if (alive) setState(voice ? { status: "ready", voice } : { status: "missing" });
    });
    return () => {
      alive = false;
    };
  }, [language]);

  return state;
}
