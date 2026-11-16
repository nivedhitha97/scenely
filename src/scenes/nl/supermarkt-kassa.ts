import type { Scene } from "@/engine/types";

/**
 * Supermarkt — the learner works at the checkout. Level A1 (see docs/curriculum-nl.md): the same
 * conversation as Klant, from the other side. Formal "u". Written for Scenely.
 */
export const supermarktKassa: Scene = {
  id: "supermarkt-kassa",
  language: "nl-NL",
  scenario: { id: "supermarkt", title: "Supermarkt" },
  role: { id: "kassa", title: "Kassa" },
  badge: { title: "Kassa", message: "Jij rekent alles af!", icon: "badge-receipt" },
  background: "supermarkt",
  character: "shopper",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Klant",
      text: "Goedemorgen.",
      animation: "shopper-wave",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "groet-tas", label: "Goedemorgen! Heeft u een tas nodig?", icon: "bag", correct: true, next: "t3", reaction: "tick" },
        { id: "drinken", label: "Wat wilt u drinken?", icon: "cup", correct: false, next: "t2", reaction: "cross" },
        { id: "welterusten", label: "Welterusten.", icon: "moon", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Klant",
      text: "Nee, dank u. Ik heb een tas.",
      animation: "shopper-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "totaal", label: "Dat is dan €12,80.", icon: "cash", correct: true, next: "t5", reaction: "tick" },
        { id: "kilo", label: "Dat is dan twaalf kilo.", icon: "basket", correct: false, next: "t4", reaction: "cross" },
        { id: "laat", label: "Hoe laat is het?", icon: "clock", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Klant",
      text: "Kan ik pinnen?",
      animation: "shopper-ask",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "kan", label: "Ja hoor, dat kan.", icon: "card", correct: true, next: "t7", reaction: "tick" },
        { id: "maandag", label: "Nee, het is maandag.", icon: "close", correct: false, next: "t6", reaction: "cross" },
        { id: "woon", label: "Ja, ik woon hier.", icon: "user", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Klant",
      text: "Zo. Is het gelukt?",
      animation: "shopper-pay",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "gelukt-bon", label: "Ja, het is gelukt. Wilt u de bon?", icon: "receipt", correct: true, next: "t9", reaction: "tick" },
        { id: "koffie", label: "Wilt u een koffie?", icon: "coffee", correct: false, next: "t8", reaction: "cross" },
        { id: "waar", label: "Waar woont u?", icon: "user", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "end",
      id: "t9",
      speaker: "Klant",
      text: "Nee, dank u. Fijne dag!",
    },
  },
};
