import type { Scene } from "@/engine/types";

/**
 * Kledingwinkel — the learner works in the shop. Level A2 (see docs/curriculum-nl.md): sizes, the
 * fitting room, the price and exchanging. Formal "u". Written for Scenely.
 */
export const kledingVerkoper: Scene = {
  id: "kleding-verkoper",
  language: "nl-NL",
  scenario: { id: "kleding", title: "Kledingwinkel" },
  role: { id: "verkoper", title: "Verkoper" },
  badge: { title: "Verkoper", message: "Jij helpt elke klant aan de juiste maat!", icon: "badge-bag" },
  background: "kleding",
  character: "shopper",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Klant",
      text: "Goedemiddag. Ik zoek een jas.",
      animation: "shopper-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "maat", label: "Welkom! Welke maat heeft u?", icon: "hanger", correct: true, next: "t3", reaction: "tick" },
        { id: "klachten", label: "Welkom! Wat zijn uw klachten?", icon: "steth", correct: false, next: "t2", reaction: "cross" },
        { id: "enkele", label: "Welkom! Enkele reis of retour?", icon: "train", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Klant",
      text: "Maat L. Heeft u hem ook in het zwart?",
      animation: "shopper-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "zwart", label: "Ja, deze is zwart. Wilt u hem passen?", icon: "hanger", correct: true, next: "t5", reaction: "tick" },
        { id: "kaas-op", label: "Nee, de kaas is op.", icon: "cheese", correct: false, next: "t4", reaction: "cross" },
        { id: "tien-uur", label: "Ja, om tien uur.", icon: "clock", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Klant",
      text: "Ja, graag. Waar is de paskamer?",
      animation: "shopper-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "links", label: "De paskamer is daar, links.", icon: "hanger", correct: true, next: "t7", reaction: "tick" },
        { id: "morgen", label: "De paskamer is morgen.", icon: "clock", correct: false, next: "t6", reaction: "cross" },
        { id: "perron", label: "Op perron drie.", icon: "train", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Klant",
      text: "Hij past goed. Wat kost hij?",
      animation: "shopper-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "prijs", label: "Hij kost €79,95.", icon: "cash", correct: true, next: "t9", reaction: "tick" },
        { id: "koorts", label: "Hij heeft koorts.", icon: "steth", correct: false, next: "t8", reaction: "cross" },
        { id: "proeven", label: "Wilt u eerst proeven?", icon: "cheese", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Klant",
      text: "Mag ik hem later nog ruilen?",
      animation: "shopper-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "ruilen", label: "Ja, dat kan binnen dertig dagen, met de bon.", icon: "receipt", correct: true, next: "t11", reaction: "tick" },
        { id: "opgegeten", label: "Nee, ik heb hem opgegeten.", icon: "bread", correct: false, next: "t10", reaction: "cross" },
        { id: "bus", label: "Ja, de bus komt om drie uur.", icon: "clock", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Klant",
      text: "Prima. Dan neem ik hem. Dank u wel!",
    },
  },
};
