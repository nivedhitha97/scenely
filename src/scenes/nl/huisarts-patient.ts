import type { Scene } from "@/engine/types";

/**
 * Huisarts — the learner sees the GP. Level A2 (see docs/curriculum-nl.md): saying what hurts, since
 * when, the perfect tense (*ik heb gemeten*) and making a new appointment. Formal "u". Written for Scenely.
 */
export const huisartsPatient: Scene = {
  id: "huisarts-patient",
  language: "nl-NL",
  scenario: { id: "huisarts", title: "Huisarts" },
  role: { id: "patient", title: "Patiënt" },
  badge: { title: "Beterschap", message: "Je hebt de huisarts goed verteld wat je hebt.", icon: "badge-steth" },
  background: "huisarts",
  character: "dokter",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Huisarts",
      text: "Goedemorgen, gaat u zitten. Wat kan ik voor u doen?",
      animation: "dokter-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "ziek", label: "Ik ben ziek. Ik heb hoofdpijn en keelpijn.", icon: "steth", correct: true, next: "t3", reaction: "tick" },
        { id: "appels", label: "Ik wil graag een kilo appels.", icon: "basket", correct: false, next: "t2", reaction: "cross" },
        { id: "trui", label: "Ik zoek een trui in maat M.", icon: "hanger", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Huisarts",
      text: "Sinds wanneer heeft u dat?",
      animation: "dokter-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "gisteren", label: "Sinds gisteren.", icon: "clock", correct: true, next: "t5", reaction: "tick" },
        { id: "drie-dagen", label: "Al drie dagen.", icon: "clock", correct: true, next: "t5", reaction: "tick" },
        { id: "supermarkt", label: "In de supermarkt.", icon: "basket", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Huisarts",
      text: "Heeft u ook koorts?",
      animation: "dokter-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "gemeten", label: "Ja, ik heb vanochtend 38 graden gemeten.", icon: "sun", correct: true, next: "t7", reaction: "tick" },
        { id: "geen-koorts", label: "Nee, ik heb geen koorts.", icon: "close", correct: true, next: "t7", reaction: "tick" },
        { id: "fiets", label: "Ja, ik heb een nieuwe fiets.", icon: "bag", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Huisarts",
      text: "Ik kijk even in uw keel. Het is griep. Rust goed uit en drink veel water.",
      animation: "dokter-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "terugkomen", label: "Moet ik nog terugkomen?", icon: "clock", correct: true, next: "t9", reaction: "tick" },
        { id: "de-bon", label: "Mag ik de bon?", icon: "receipt", correct: false, next: "t8", reaction: "cross" },
        { id: "maat-l", label: "Ik heb maat L.", icon: "hanger", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Huisarts",
      text: "Dat hoeft niet. Bent u volgende week nog ziek? Bel dan voor een nieuwe afspraak.",
      animation: "dokter-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "doe-ik", label: "Goed, dat doe ik. Dank u wel.", icon: "tick", correct: true, next: "t11", reaction: "tick" },
        { id: "twee-ons", label: "Goed, twee ons, alstublieft.", icon: "cheese", correct: false, next: "t10", reaction: "cross" },
        { id: "perron", label: "Goed, perron zes.", icon: "train", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Huisarts",
      text: "Graag gedaan. Beterschap!",
    },
  },
};
