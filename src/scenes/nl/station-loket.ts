import type { Scene } from "@/engine/types";

/**
 * Station — the learner works at the ticket desk. Level A2 (see docs/curriculum-nl.md): single or
 * return, departure time and platform, the price and how to pay. Formal "u". Written for Scenely.
 */
export const stationLoket: Scene = {
  id: "station-loket",
  language: "nl-NL",
  scenario: { id: "station", title: "Station" },
  role: { id: "loket", title: "Loket" },
  badge: { title: "Loket", message: "Jij helpt elke reiziger op weg.", icon: "badge-clock" },
  background: "station",
  character: "shopper",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Reiziger",
      text: "Goedemiddag. Een kaartje naar Amersfoort, alstublieft.",
      animation: "shopper-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "enkele-retour", label: "Goedemiddag. Enkele reis of retour?", icon: "train", correct: true, next: "t3", reaction: "tick" },
        { id: "kaas", label: "Goedemiddag. Jonge of oude kaas?", icon: "cheese", correct: false, next: "t2", reaction: "cross" },
        { id: "maat", label: "Goedemiddag. Welke maat?", icon: "hanger", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Reiziger",
      text: "Een enkele reis. Gaat er vandaag een directe trein?",
      animation: "shopper-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "kwart-over", label: "Ja, hij vertrekt om kwart over twee van perron drie.", icon: "clock", correct: true, next: "t5", reaction: "tick" },
        { id: "trein-maat", label: "Ja, de trein heeft maat M.", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
        { id: "buikpijn", label: "Nee, ik heb buikpijn.", icon: "steth", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Reiziger",
      text: "Fijn. Wat kost het?",
      animation: "shopper-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "prijs", label: "Dat is dan €12,40.", icon: "cash", correct: true, next: "t7", reaction: "tick" },
        { id: "perron-vier", label: "Dat is dan perron vier.", icon: "train", correct: false, next: "t6", reaction: "cross" },
        { id: "twee-ons", label: "Dat is dan twee ons.", icon: "cheese", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Reiziger",
      text: "Kan ik contant betalen?",
      animation: "shopper-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "alleen-pinnen", label: "Nee, sorry. Hier kunt u alleen pinnen.", icon: "card", correct: true, next: "t9", reaction: "tick" },
        { id: "paskamer", label: "Ja, in de paskamer.", icon: "hanger", correct: false, next: "t8", reaction: "cross" },
        { id: "dokter", label: "Nee, de dokter is er niet.", icon: "steth", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Reiziger",
      text: "Geen probleem, dan pin ik.",
      animation: "shopper-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "kaartje", label: "Alstublieft, uw kaartje. Goede reis!", icon: "tick", correct: true, next: "t11", reaction: "tick" },
        { id: "smakelijk", label: "Alstublieft, uw kaas. Eet smakelijk!", icon: "cheese", correct: false, next: "t10", reaction: "cross" },
        { id: "beterschap", label: "Alstublieft. Beterschap!", icon: "steth", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Reiziger",
      text: "Dank u wel. Tot ziens!",
    },
  },
};
