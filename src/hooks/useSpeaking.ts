import { useCallback, useEffect, useRef, useState } from "react";

import { bestMatch, matchWords, verdict, type SpeakVerdict, type WordMatch } from "@/engine/speaking";
import { listen } from "@/services/listening";
import { stopSpeaking } from "@/services/speech";

export type SpeakPhase = "ready" | "listening" | "result";

const LEVEL_BARS = 20;

/** One "say it out loud" attempt: listen, light up words as they are heard, then judge. */
export function useSpeaking(sentence: string, language: string) {
  const [phase, setPhase] = useState<SpeakPhase>("ready");
  const [words, setWords] = useState<WordMatch[]>(() => matchWords(sentence, "", false));
  const [levels, setLevels] = useState<number[]>([]);
  const [result, setResult] = useState<SpeakVerdict | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const lastHeard = useRef<string[]>([]);
  const errorRef = useRef<string | null>(null);

  const start = useCallback(() => {
    stopSpeaking();
    lastHeard.current = [];
    errorRef.current = null;
    setNotice(null);
    setResult(null);
    setLevels([]);
    setWords(matchWords(sentence, "", false));
    setPhase("listening");
    stopRef.current = listen(language, [sentence], {
      onResult: (alternatives, final) => {
        lastHeard.current = alternatives;
        setWords(bestMatch(sentence, alternatives, final));
      },
      onVolume: (level) => setLevels((l) => [...l, level].slice(-LEVEL_BARS)),
      onError: (code) => {
        errorRef.current = code;
      },
      onEnd: () => {
        stopRef.current = null;
        const heard = lastHeard.current;
        if (heard.length === 0) {
          // Nothing recognised: try again rather than mark every word wrong.
          const code = errorRef.current;
          setNotice(
            code === "not-allowed" || code === "service-not-allowed"
              ? "Geen toegang tot de microfoon of spraakherkenning."
              : code === "language-not-supported"
                ? "Nederlandse spraakherkenning is niet beschikbaar op dit toestel."
                : "Ik hoorde niets. Tik op de microfoon en probeer het nog eens.",
          );
          setWords(matchWords(sentence, "", false));
          setPhase("ready");
          return;
        }
        const final = bestMatch(sentence, heard, true);
        setWords(final);
        setResult(verdict(final));
        setPhase("result");
      },
    });
  }, [sentence, language]);

  const stop = useCallback(() => stopRef.current?.(), []);

  // Stop listening when the screen goes away.
  useEffect(() => () => stopRef.current?.(), []);

  return { phase, words, levels, result, notice, start, stop };
}
