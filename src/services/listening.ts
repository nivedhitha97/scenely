import { requireOptionalNativeModule } from "expo";
import type { ExpoSpeechRecognitionModule as RecognitionModule } from "expo-speech-recognition";
import { Platform } from "react-native";

/**
 * Wrapper around expo-speech-recognition. The native module is missing in Expo Go, so it is
 * loaded defensively: without it, speaking exercises are simply not offered.
 */
type Module = typeof RecognitionModule;

let cached: Module | null | undefined;
function recognizer(): Module | null {
  if (cached === undefined) {
    // Check first: in Expo Go the package throws while loading, and React Native's dev overlay
    // reports that error even though it is caught below. The web version needs no native module.
    if (Platform.OS !== "web" && !requireOptionalNativeModule("ExpoSpeechRecognition")) {
      cached = null;
      return cached;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      cached = (require("expo-speech-recognition") as { ExpoSpeechRecognitionModule: Module }).ExpoSpeechRecognitionModule;
    } catch {
      cached = null;
    }
  }
  return cached;
}

/** True when this device can recognise speech right now. */
export function canListen(): boolean {
  try {
    return !!recognizer()?.isRecognitionAvailable();
  } catch {
    return false;
  }
}

export type MicPermission = "granted" | "denied" | "undetermined";

export async function micPermission(): Promise<MicPermission> {
  const r = recognizer();
  if (!r) return "denied";
  const p = await r.getPermissionsAsync();
  return p.granted ? "granted" : p.canAskAgain ? "undetermined" : "denied";
}

/** Asks for microphone and speech-recognition access (the system dialog). */
export async function askMicPermission(): Promise<boolean> {
  const r = recognizer();
  if (!r) return false;
  const p = await r.requestPermissionsAsync();
  return p.granted;
}

export type ListenHandlers = {
  /** Every transcript alternative the recognizer offers, best first. */
  onResult: (alternatives: string[], final: boolean) => void;
  /** Microphone level from about -2 (silent) to 10. */
  onVolume: (level: number) => void;
  /** Listening stopped (after a final result, an error, or stop()). */
  onEnd: () => void;
  onError: (code: string) => void;
};

/**
 * Starts listening for one sentence in `language`. `hints` (the expected sentence) help the
 * recognizer. Audio stays on the phone where the device supports it; nothing is saved.
 * Returns a function that stops listening.
 */
export function listen(language: string, hints: string[], handlers: ListenHandlers): () => void {
  const r = recognizer();
  if (!r) {
    handlers.onError("not-available");
    handlers.onEnd();
    return () => {};
  }
  const subs = [
    r.addListener("result", (e) => handlers.onResult(e.results.map((x) => x.transcript), e.isFinal)),
    r.addListener("volumechange", (e) => handlers.onVolume(e.value)),
    r.addListener("error", (e) => handlers.onError(e.error)),
    r.addListener("end", () => {
      subs.forEach((s) => s.remove());
      handlers.onEnd();
    }),
  ];
  let onDevice = false;
  try {
    onDevice = r.supportsOnDeviceRecognition();
  } catch {
    onDevice = false;
  }
  r.start({
    lang: language,
    interimResults: true,
    maxAlternatives: 3,
    continuous: false,
    contextualStrings: hints,
    requiresOnDeviceRecognition: onDevice,
    addsPunctuation: false,
    volumeChangeEventOptions: { enabled: true, intervalMillis: 100 },
  });
  return () => {
    try {
      r.stop();
    } catch {
      // already stopped
    }
  };
}
