import type { Scene } from "@/engine/types";

/**
 * Huisarts — the learner is the GP. Level A2 (see docs/curriculum-nl.md): asking where it hurts, the
 * perfect tense (*ik ben gevallen*) and asking someone to come back. Formal "u". Written for Scenely.
 */
export const huisartsHuisarts: Scene = {
  id: "huisarts-huisarts",
  language: "nl-NL",
  scenario: { id: "huisarts", title: "Huisarts" },
  role: { id: "huisarts", title: "Huisarts" },
  badge: { title: "Dokter", message: "Jij hebt je patiënt goed geholpen.", icon: "badge-hospital" },
  background: "huisarts",
  character: "klant",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Patiënt",
      text: "Goedemiddag, dokter.",
      animation: "klant-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "helpen", label: "Goedemiddag. Wat kan ik voor u doen?", icon: "steth", correct: true, next: "t3", reaction: "tick" },
        { id: "bon", label: "Goedemiddag. Wilt u de bon?", icon: "receipt", correct: false, next: "t2", reaction: "cross" },
        { id: "kaas", label: "Goedemiddag. Jonge of oude kaas?", icon: "cheese", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Patiënt",
      text: "Ik heb pijn in mijn rug. Ik ben gisteren van mijn fiets gevallen.",
      animation: "klant-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "waar", label: "Oei. Waar doet het pijn?", icon: "steth", correct: true, next: "t5", reaction: "tick" },
        { id: "leuk", label: "Wat leuk! Gefeliciteerd.", icon: "wave", correct: false, next: "t4", reaction: "cross" },
        { id: "maat", label: "Welke maat heeft u?", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Patiënt",
      text: "Hier, onderin. Ik kan niet goed lopen.",
      animation: "klant-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "liggen", label: "Ik ga even kijken. Kunt u hier gaan liggen?", icon: "steth", correct: true, next: "t7", reaction: "tick" },
        { id: "trein", label: "Dan neemt u de trein.", icon: "train", correct: false, next: "t6", reaction: "cross" },
        { id: "pinnen", label: "Dan pint u maar.", icon: "card", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Patiënt",
      text: "Is het erg, dokter?",
      animation: "klant-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "niet-gebroken", label: "Nee, er is niets gebroken. Rust een paar dagen goed uit.", icon: "tick", correct: true, next: "t9", reaction: "tick" },
        { id: "lekker", label: "Ja, het is erg lekker.", icon: "cheese", correct: false, next: "t8", reaction: "cross" },
        { id: "dicht", label: "Nee, de winkel is dicht.", icon: "lock", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Patiënt",
      text: "Gelukkig. Moet ik terugkomen?",
      animation: "klant-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "volgende-week", label: "Ja, kom volgende week terug. Maak een afspraak bij de assistent.", icon: "clock", correct: true, next: "t11", reaction: "tick" },
        { id: "vijf-uur", label: "Ja, de trein gaat om vijf uur.", icon: "train", correct: false, next: "t10", reaction: "cross" },
        { id: "kaas-kopen", label: "Ja, kom morgen kaas kopen.", icon: "cheese", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Patiënt",
      text: "Dat doe ik. Dank u wel, dokter.",
    },
  },
};
