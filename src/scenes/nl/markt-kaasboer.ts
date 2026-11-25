import type { Scene } from "@/engine/types";

/**
 * Op de markt — the learner sells cheese at the stall. Level A1 (see docs/curriculum-nl.md): the same
 * conversation as Klant, from the other side, with *ons* instead of *pond*. Formal "u". Written for Scenely.
 */
export const marktKaasboer: Scene = {
  id: "markt-kaasboer",
  language: "nl-NL",
  scenario: { id: "markt", title: "Op de markt" },
  role: { id: "kaasboer", title: "Kaasboer" },
  badge: { title: "Kaasboer", message: "Jij verkoopt de lekkerste kaas!", icon: "badge-cash" },
  background: "markt",
  character: "klant",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Klant",
      text: "Goedemiddag. Ik wil graag kaas.",
      animation: "klant-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "jong-oud", label: "Goedemiddag! Jonge of oude kaas?", icon: "cheese", correct: true, next: "t3", reaction: "tick" },
        { id: "drinken", label: "Goedemiddag! Wat wilt u drinken?", icon: "cup", correct: false, next: "t2", reaction: "cross" },
        { id: "perron", label: "Het perron is daar.", icon: "train", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Klant",
      text: "Oude kaas, graag. Mag ik proeven?",
      animation: "klant-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "stukje", label: "Natuurlijk. Alstublieft, een stukje.", icon: "cheese", correct: true, next: "t5", reaction: "tick" },
        { id: "zondag", label: "Nee, het is zondag.", icon: "close", correct: false, next: "t4", reaction: "cross" },
        { id: "paskamer", label: "Ja, in de paskamer.", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Klant",
      text: "Lekker! Twee ons, alstublieft.",
      animation: "klant-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "twee-ons", label: "Twee ons oude kaas. Anders nog iets?", icon: "cheese", correct: true, next: "t7", reaction: "tick" },
        { id: "appels", label: "Twee kilo appels.", icon: "basket", correct: false, next: "t6", reaction: "cross" },
        { id: "kaartjes", label: "Twee kaartjes naar Utrecht.", icon: "train", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Klant",
      text: "Nee, dat was het. Kan ik pinnen?",
      animation: "klant-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "pinnen", label: "Ja hoor. Dat is dan €6,20.", icon: "card", correct: true, next: "t9", reaction: "tick" },
        { id: "perron-vijf", label: "Ja, op perron vijf.", icon: "train", correct: false, next: "t8", reaction: "cross" },
        { id: "geen-tijd", label: "Nee, ik heb geen tijd.", icon: "clock", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "end",
      id: "t9",
      speaker: "Klant",
      text: "Dank u wel. Fijne dag!",
    },
  },
};
