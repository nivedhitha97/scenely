import type { Scene } from "@/engine/types";

/**
 * Op de markt — the learner buys cheese at a market stall. Level A1 (see docs/curriculum-nl.md):
 * amounts and weight (een pond), tasting, *anders nog iets?* Formal "u". Written for Scenely.
 */
export const marktKlant: Scene = {
  id: "markt-klant",
  language: "nl-NL",
  scenario: { id: "markt", title: "Op de markt" },
  role: { id: "klant", title: "Klant" },
  badge: { title: "Kaasliefhebber", message: "Jij koopt kaas op de markt!", icon: "badge-cheese" },
  background: "markt",
  character: "kaasboer",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Kaasboer",
      text: "Goedemorgen! Zegt u het maar.",
      animation: "kaasboer-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "kaas", label: "Goedemorgen. Ik wil graag kaas.", icon: "cheese", correct: true, next: "t3", reaction: "tick" },
        { id: "kaartje", label: "Ik wil graag een kaartje naar Utrecht.", icon: "train", correct: false, next: "t2", reaction: "cross" },
        { id: "slaap", label: "Goedenavond. Slaap lekker!", icon: "moon", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Kaasboer",
      text: "Jonge of oude kaas?",
      animation: "kaasboer-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "jong", label: "Jonge kaas, alstublieft.", icon: "cheese", correct: true, next: "t5", reaction: "tick" },
        { id: "oud", label: "Oude kaas, graag.", icon: "cheese", correct: true, next: "t5", reaction: "tick" },
        { id: "leeftijd", label: "Ik ben dertig jaar.", icon: "user", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Kaasboer",
      text: "Wilt u eerst even proeven?",
      animation: "kaasboer-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "proeven", label: "Ja, graag. Mmm, lekker!", icon: "tick", correct: true, next: "t7", reaction: "tick" },
        { id: "niet-proeven", label: "Nee, dank u.", icon: "close", correct: true, next: "t7", reaction: "tick" },
        { id: "fiets", label: "Ja, ik heb een fiets.", icon: "bag", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Kaasboer",
      text: "Hoeveel wilt u hebben?",
      animation: "kaasboer-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "pond", label: "Een pond, alstublieft.", icon: "cheese", correct: true, next: "t9", reaction: "tick" },
        { id: "drie-uur", label: "Om drie uur.", icon: "clock", correct: false, next: "t8", reaction: "cross" },
        { id: "koffie", label: "Een koffie met melk.", icon: "coffee", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Kaasboer",
      text: "Alstublieft, een pond kaas. Anders nog iets?",
      animation: "kaasboer-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "dat-was-het", label: "Nee, dat was het. Wat kost het?", icon: "cash", correct: true, next: "t11", reaction: "tick" },
        { id: "utrecht", label: "Ja, ik woon in Utrecht.", icon: "user", correct: false, next: "t10", reaction: "cross" },
        { id: "hoofdpijn", label: "Ja, ik heb hoofdpijn.", icon: "steth", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Kaasboer",
      text: "Dat is dan €8,50. Dank u wel en tot de volgende keer!",
    },
  },
};
