import type { Scene } from "@/engine/types";

/**
 * Supermarkt — the learner is the customer at the checkout. Level A1 (see docs/curriculum-nl.md):
 * greeting, a bag, the total, paying and the receipt. Formal "u". Written for Scenely.
 */
export const supermarktKlant: Scene = {
  id: "supermarkt-klant",
  language: "nl-NL",
  scenario: { id: "supermarkt", title: "Supermarkt" },
  role: { id: "klant", title: "Klant" },
  badge: { title: "Boodschappen", message: "Alles zit in de tas!", icon: "badge-basket" },
  background: "supermarkt",
  character: "kassa",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Kassamedewerker",
      text: "Goedemiddag!",
      animation: "kassa-wave",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "goedemiddag", label: "Goedemiddag!", icon: "chat", correct: true, next: "t3", reaction: "tick" },
        { id: "welterusten", label: "Welterusten!", icon: "moon", correct: false, next: "t2", reaction: "cross" },
        { id: "doei", label: "Tot ziens!", icon: "wave", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Kassamedewerker",
      text: "Heeft u een tas nodig?",
      animation: "kassa-ask",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "eigen-tas", label: "Nee, dank u. Ik heb een tas.", icon: "bag", correct: true, next: "t5", reaction: "tick" },
        { id: "tas-graag", label: "Ja, graag. Eén tas, alstublieft.", icon: "bag", correct: true, next: "t5", reaction: "tick" },
        { id: "honger", label: "Ik heb honger.", icon: "bread", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Kassamedewerker",
      text: "Dat is dan €7,40.",
      animation: "kassa-register",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "pinnen", label: "Kan ik pinnen?", icon: "card", correct: true, next: "t7", reaction: "tick" },
        { id: "tijd", label: "Het is zeven uur.", icon: "clock", correct: false, next: "t6", reaction: "cross" },
        { id: "koffie", label: "Een koffie, alstublieft.", icon: "coffee", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Kassamedewerker",
      text: "Ja hoor. Wilt u de bon?",
      animation: "kassa-ask",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "geen-bon", label: "Nee, dank u.", icon: "close", correct: true, next: "t9", reaction: "tick" },
        { id: "bon-graag", label: "Ja, graag.", icon: "receipt", correct: true, next: "t9", reaction: "tick" },
        { id: "naam", label: "Mijn naam is Sam.", icon: "user", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "end",
      id: "t9",
      speaker: "Kassamedewerker",
      text: "Alstublieft. Fijne dag nog!",
    },
  },
};
