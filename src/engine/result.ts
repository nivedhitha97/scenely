/** How one play-through went: what the completion screen shows. */
export type SceneResult = {
  badgeEarned: boolean;
  /** Correct choice id per player turn. */
  answers: Record<string, string>;
  /** Player turns whose sentence was said out loud and understood. */
  spoken: string[];
};

/** Route params (strings only) for /done/[id]. */
export type ResultParams = { badge: string; answers: string; spoken: string };

export function encodeResult(r: SceneResult): ResultParams {
  return { badge: r.badgeEarned ? "1" : "0", answers: JSON.stringify(r.answers), spoken: r.spoken.join(",") };
}

/** Reads the params back. Returns null when they are missing or broken (e.g. the page was opened directly). */
export function decodeResult(p: Partial<Record<keyof ResultParams, string | string[]>>): SceneResult | null {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const answersRaw = one(p.answers);
  if (!answersRaw) return null;
  try {
    const parsed: unknown = JSON.parse(answersRaw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const answers: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") answers[k] = v;
    const spoken = (one(p.spoken) ?? "").split(",").filter(Boolean);
    return { badgeEarned: one(p.badge) === "1", answers, spoken };
  } catch {
    return null;
  }
}
