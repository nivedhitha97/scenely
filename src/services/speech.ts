import * as Speech from "expo-speech";

export const NORMAL_RATE = 0.9;
export const SLOW_RATE = 0.75;

type VoiceLike = Pick<Speech.Voice, "identifier" | "language" | "name" | "quality">;

const normalize = (tag: string) => tag.replace(/_/g, "-").toLowerCase();

function score(v: VoiceLike): number {
  let s = 0;
  if (v.quality === Speech.VoiceQuality.Enhanced) s += 4;
  const id = `${v.identifier} ${v.name}`.toLowerCase();
  if (id.includes("premium")) s += 2;
  if (id.includes("enhanced")) s += 1;
  if (id.includes("network")) s += 1; // Android's higher-quality network voices
  return s;
}

/**
 * Picks the best installed voice for an exact language tag (e.g. "nl-NL").
 * A different region of the same language (e.g. "nl-BE") is never used.
 */
export function pickVoice<V extends VoiceLike>(voices: V[], language: string): V | undefined {
  const want = normalize(language);
  return voices
    .filter((v) => normalize(v.language) === want)
    .sort((a, b) => score(b) - score(a))[0];
}

const voiceCache = new Map<string, string>();

/**
 * Resolves the identifier of the best voice for `language`, or null when none is installed.
 * Only found voices are cached, so a voice installed while the app runs is picked up next time.
 */
export async function loadVoice(language: string): Promise<string | null> {
  const cached = voiceCache.get(language);
  if (cached) return cached;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const id = pickVoice(voices, language)?.identifier;
    if (id) voiceCache.set(language, id);
    return id ?? null;
  } catch {
    return null;
  }
}

/** For tests: forget remembered voices. */
export function clearVoiceCache(): void {
  voiceCache.clear();
}

let token = 0;

/** Stops any line in progress, then speaks `text`. Never overlaps two lines. */
export async function speak(
  text: string,
  opts: { language: string; voice: string; slow?: boolean; onDone?: () => void },
): Promise<void> {
  const mine = ++token;
  await Speech.stop();
  if (mine !== token) return; // a newer line was requested meanwhile
  Speech.speak(text, {
    language: opts.language,
    voice: opts.voice,
    rate: opts.slow ? SLOW_RATE : NORMAL_RATE,
    onDone: opts.onDone,
  });
}

export function stopSpeaking(): void {
  token++;
  void Speech.stop();
}
