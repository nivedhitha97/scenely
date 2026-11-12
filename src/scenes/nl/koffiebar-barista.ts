import type { Scene } from "@/engine/types";

/** Bij de koffiebar — the learner is the barista; the customer is the NPC. Formal "u" register. */
export const koffiebarBarista: Scene = {
  id: "koffiebar-barista",
  language: "nl-NL",
  scenario: { id: "koffiebar", title: "Bij de koffiebar" },
  role: { id: "barista", title: "Barista" },
  badge: { title: "Barista", message: "Je bent nu barista!", icon: "badge-barista" },
  background: "cafe-counter",
  character: "klant",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Klant",
      text: "Goedemorgen! Mag ik een koffie, alstublieft?",
      animation: "klant-wave",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "melk-zwart", label: "Met melk of zwart?", icon: "milk", correct: true, next: "t3", reaction: "tick" },
        { id: "nog-iets", label: "Wilt u er nog iets bij?", icon: "cup", correct: true, next: "t3", reaction: "tick" },
        { id: "bier", label: "Hier is uw bier.", icon: "beer", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Klant",
      text: "Zwart, alstublieft.",
      animation: "klant-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "prijs", label: "Dat is €2,50.", icon: "card", correct: true, next: "t5", reaction: "coffee" },
        { id: "doei", label: "Tot ziens, fijne dag.", icon: "wave", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Klant",
      text: "Pinnen, alstublieft.",
      animation: "klant-pay",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "dank", label: "Alstublieft, dank u wel!", icon: "tick", correct: true, next: "t7", reaction: "tick" },
        { id: "bier", label: "Een bier, alstublieft.", icon: "beer", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "end",
      id: "t7",
      speaker: "Klant",
      text: "Dank u wel. Tot ziens!",
    },
  },
};
