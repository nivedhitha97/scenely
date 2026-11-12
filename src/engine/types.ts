/**
 * Scene data model. Scenes are plain data: adding a scene never requires
 * engine changes. All learner-facing text is in the scene's target language.
 */

/** BCP 47 language tag of the language being learned, e.g. "nl-NL". */
export type LanguageCode = string;

export type Choice = {
  id: string;
  /** Target-language text shown on the sticker, e.g. "Een koffie, alstublieft." */
  label: string;
  /** Asset key for the sticker icon. */
  icon: string;
  correct: boolean;
  /** Turn to move to when this choice is correct. Ignored for incorrect choices. */
  next: string;
  /** Lottie key for the feedback animation. */
  reaction: string;
};

export type NpcTurn = {
  kind: "npc";
  id: string;
  /** Who is speaking, shown on the speech-bubble tag (e.g. "Barista"). */
  speaker: string;
  text: string;
  /** Character animation key. */
  animation: string;
  /** Optional pre-recorded audio key; falls back to device speech when missing. */
  audio?: string;
  next: string;
};

export type PlayerTurn = {
  kind: "player";
  id: string;
  /** Optional target-language hint shown above the stickers. */
  prompt?: string;
  choices: Choice[];
};

/** Final NPC line. Reaching it completes the scene. */
export type EndTurn = {
  kind: "end";
  id: string;
  speaker: string;
  text: string;
  audio?: string;
};

export type Turn = NpcTurn | PlayerTurn | EndTurn;

export type Badge = {
  title: string;
  message: string;
  icon: string;
};

export type Scene = {
  id: string;
  language: LanguageCode;
  /** Scenes of the same scenario (one per role) are listed together. */
  scenario: { id: string; title: string };
  /** The role the learner plays in this version. */
  role: { id: string; title: string };
  badge: Badge;
  background: string;
  /** Animation key of the character the learner talks to. */
  character: string;
  start: string;
  turns: Record<string, Turn>;
};
