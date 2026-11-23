import type { Scene } from "@/engine/types";

/**
 * Station — the learner buys a train ticket. Level A2 (see docs/curriculum-nl.md): where to, single
 * or return, the platform, times and a delay. Formal "u". Written for Scenely.
 */
export const stationReiziger: Scene = {
  id: "station-reiziger",
  language: "nl-NL",
  scenario: { id: "station", title: "Station" },
  role: { id: "reiziger", title: "Reiziger" },
  badge: { title: "Op reis", message: "Je hebt een kaartje en je weet je perron.", icon: "badge-train" },
  background: "station",
  character: "loket",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Loketmedewerker",
      text: "Goedemorgen. Waar wilt u naartoe?",
      animation: "loket-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "utrecht", label: "Goedemorgen. Ik wil graag naar Utrecht.", icon: "train", correct: true, next: "t3", reaction: "tick" },
        { id: "bed", label: "Goedemorgen. Ik wil graag naar bed.", icon: "moon", correct: false, next: "t2", reaction: "cross" },
        { id: "kaas", label: "Goedemorgen. Ik wil graag kaas.", icon: "cheese", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Loketmedewerker",
      text: "Een enkele reis of een retour?",
      animation: "loket-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "retour", label: "Een retour, alstublieft.", icon: "train", correct: true, next: "t5", reaction: "tick" },
        { id: "enkele", label: "Een enkele reis, graag.", icon: "train", correct: true, next: "t5", reaction: "tick" },
        { id: "maat", label: "Maat M, alstublieft.", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Loketmedewerker",
      text: "Dat is dan €17,80. Wilt u pinnen?",
      animation: "loket-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "pin", label: "Ja, ik pin.", icon: "card", correct: true, next: "t7", reaction: "tick" },
        { id: "hoofdpijn", label: "Ja, ik heb hoofdpijn.", icon: "steth", correct: false, next: "t6", reaction: "cross" },
        { id: "maat-l", label: "Nee, ik heb maat L.", icon: "hanger", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Loketmedewerker",
      text: "Alstublieft, uw kaartje.",
      animation: "loket-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "perron", label: "Dank u. Van welk perron vertrekt de trein?", icon: "train", correct: true, next: "t9", reaction: "tick" },
        { id: "paskamer", label: "Dank u. Waar is de paskamer?", icon: "hanger", correct: false, next: "t8", reaction: "cross" },
        { id: "proeven", label: "Dank u. Mag ik proeven?", icon: "cheese", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Loketmedewerker",
      text: "Van perron vijf, om tien over negen. Maar hij heeft vijf minuten vertraging.",
      animation: "loket-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "koffie", label: "Oké, dan heb ik nog tijd voor een koffie.", icon: "coffee", correct: true, next: "t11", reaction: "tick" },
        { id: "koorts", label: "Oké, dan heb ik koorts.", icon: "steth", correct: false, next: "t10", reaction: "cross" },
        { id: "gekocht", label: "Oké, ik heb gisteren kaas gekocht.", icon: "cheese", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Loketmedewerker",
      text: "Goed idee. Goede reis!",
    },
  },
};
