import type { Scene } from "@/engine/types";

/** Bij de koffiebar — the learner is the customer (klant). Formal "u" register. */
export const koffiebarKlant: Scene = {
  id: "koffiebar-klant",
  language: "nl-NL",
  scenario: { id: "koffiebar", title: "Bij de koffiebar" },
  role: { id: "klant", title: "Klant" },
  badge: { title: "Klant", message: "Lekker besteld!", icon: "badge-coffee" },
  background: "cafe",
  character: "barista",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Barista",
      text: "Goedemorgen! Wat wilt u drinken?",
      animation: "barista-wave",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "koffie", label: "Een koffie, alstublieft.", icon: "coffee", correct: true, next: "t3", reaction: "coffee" },
        { id: "bier", label: "Een bier, alstublieft.", icon: "beer", correct: false, next: "t2", reaction: "cross" },
        { id: "brood", label: "Een brood, alstublieft.", icon: "bread", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Barista",
      text: "Met melk of zwart?",
      animation: "barista-ask",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "melk", label: "Met melk, alstublieft.", icon: "milk", correct: true, next: "t5", reaction: "tick" },
        { id: "zwart", label: "Zwart, alstublieft.", icon: "coffee-black", correct: true, next: "t5", reaction: "tick" },
        { id: "bier", label: "Ja, graag bier.", icon: "beer", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Barista",
      text: "Dat is €2,50. Pinnen of contant?",
      animation: "barista-register",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "pinnen", label: "Pinnen, alstublieft.", icon: "card", correct: true, next: "t7", reaction: "tick" },
        { id: "contant", label: "Contant, alstublieft.", icon: "cash", correct: true, next: "t7", reaction: "tick" },
        { id: "doei", label: "Dank u wel, tot ziens.", icon: "wave", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "end",
      id: "t7",
      speaker: "Barista",
      text: "Alstublieft! Fijne dag nog.",
    },
  },
};
