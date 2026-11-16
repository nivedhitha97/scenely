/**
 * Compares a sentence the learner said with the sentence on screen, word by word.
 * Pure logic: the speech recognizer lives in src/services/listening.ts.
 */

/** ok: heard. miss: not heard (final result). wait: not heard yet (still listening). */
export type WordState = "ok" | "miss" | "wait";

export type WordMatch = {
  /** The word as written on screen, with its punctuation. */
  text: string;
  state: WordState;
};

export type SpeakVerdict = { kind: "good" } | { kind: "almost"; missed: string[] };

/** Lowercase, no accents, no punctuation; "€2,50" becomes ["2", "50"]. */
export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Close enough: small slips in long words are forgiven (one letter from 4 letters, two from 8). */
export function sameWord(target: string, heard: string): boolean {
  if (target === heard) return true;
  const allowed = target.length >= 8 ? 2 : target.length >= 4 ? 1 : 0;
  return allowed > 0 && distance(target, heard) <= allowed;
}

/**
 * Marks each written word as heard or not, in order. `final` is false while the recognizer
 * is still listening, so words not heard yet are "wait" instead of "miss".
 */
export function matchWords(sentence: string, heard: string, final: boolean): WordMatch[] {
  const heardTokens = tokens(heard);
  let from = 0;
  const out: WordMatch[] = [];
  for (const text of sentence.split(/\s+/).filter(Boolean)) {
    const parts = tokens(text);
    if (parts.length === 0) {
      out.push({ text, state: "ok" });
      continue;
    }
    // Every part of a written word ("€2,50" → 2, 50) must be heard, in order.
    let at = from;
    let found = true;
    for (const part of parts) {
      let k = at;
      while (k < heardTokens.length && !sameWord(part, heardTokens[k])) k++;
      if (k === heardTokens.length) {
        found = false;
        break;
      }
      at = k + 1;
    }
    if (found) from = at;
    out.push({ text, state: found ? "ok" : final ? "miss" : "wait" });
  }
  return out;
}

/** How many words were heard: used to pick the best of the recognizer's alternatives. */
export function score(matches: WordMatch[]): number {
  return matches.filter((m) => m.state === "ok").length;
}

/** The best match among the recognizer's alternative transcripts. */
export function bestMatch(sentence: string, alternatives: string[], final: boolean): WordMatch[] {
  let best = matchWords(sentence, "", final);
  for (const alt of alternatives) {
    const m = matchWords(sentence, alt, final);
    if (score(m) > score(best)) best = m;
  }
  return best;
}

export function verdict(matches: WordMatch[]): SpeakVerdict {
  const missed = matches.filter((m) => m.state !== "ok").map((m) => m.text);
  return missed.length === 0 ? { kind: "good" } : { kind: "almost", missed };
}

/** A word without its punctuation, for speaking it on its own or quoting it. */
export function bareWord(text: string): string {
  return text.replace(/^[^\p{L}\p{N}€]+|[^\p{L}\p{N}]+$/gu, "");
}
