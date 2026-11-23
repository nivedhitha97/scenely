import type { Scene } from "@/engine/types";

/**
 * School — the learner is the teacher talking with a parent. Level B1 (see docs/curriculum-nl.md):
 * telling how a child is doing, a polite suggestion and arranging an early pick-up. Formal "u". Written for Scenely.
 */
export const schoolLeraar: Scene = {
  id: "school-leraar",
  language: "nl-NL",
  scenario: { id: "school", title: "School" },
  role: { id: "leraar", title: "Leraar" },
  badge: { title: "Juf of meester", message: "Jij hebt de ouder goed geholpen.", icon: "badge-chat" },
  background: "school",
  character: "klant",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Ouder",
      text: "Goedemorgen. Ik ben de vader van Daan.",
      animation: "klant-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "welkom", label: "Goedemorgen! Welkom. Gaat u zitten.", icon: "school", correct: true, next: "t3", reaction: "tick" },
        { id: "enkele", label: "Goedemorgen! Enkele reis of retour?", icon: "train", correct: false, next: "t2", reaction: "cross" },
        { id: "klachten", label: "Goedemorgen! Wat zijn uw klachten?", icon: "steth", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Ouder",
      text: "Hoe gaat het met Daan in de klas?",
      animation: "klant-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "goed", label: "Het gaat goed. Hij leest heel goed en hij helpt andere kinderen.", icon: "school", correct: true, next: "t5", reaction: "tick" },
        { id: "maat", label: "Het gaat goed. Hij heeft maat L.", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
        { id: "kost", label: "Het gaat goed. Hij kost €8,50.", icon: "cash", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Ouder",
      text: "Wat fijn. Maar hij is vaak moe, omdat hij laat naar bed gaat.",
      animation: "klant-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "eerder", label: "Dat zie ik ook. Kan hij misschien wat eerder naar bed?", icon: "moon", correct: true, next: "t7", reaction: "tick" },
        { id: "bon", label: "Dat zie ik ook. Wilt u de bon?", icon: "receipt", correct: false, next: "t6", reaction: "cross" },
        { id: "proeven", label: "Dat zie ik ook. Wilt u proeven?", icon: "cheese", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Ouder",
      text: "Ja, dat gaan we proberen. Mag hij morgen eerder weg? Hij moet naar de huisarts.",
      animation: "klant-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "hoe-laat", label: "Ja, dat mag. Hoe laat komt u hem halen?", icon: "clock", correct: true, next: "t9", reaction: "tick" },
        { id: "perron", label: "Ja, de trein vertrekt van perron vijf.", icon: "train", correct: false, next: "t8", reaction: "cross" },
        { id: "kaas-op", label: "Nee, de kaas is op.", icon: "cheese", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Ouder",
      text: "Om half twaalf, bij het hek.",
      animation: "klant-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "agenda", label: "Prima, dan zet ik het in mijn agenda.", icon: "tick", correct: true, next: "t11", reaction: "tick" },
        { id: "passen", label: "Prima, dan ga ik de trui passen.", icon: "hanger", correct: false, next: "t10", reaction: "cross" },
        { id: "welterusten", label: "Prima. Welterusten!", icon: "moon", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Ouder",
      text: "Dank u wel. Tot morgen!",
    },
  },
};
