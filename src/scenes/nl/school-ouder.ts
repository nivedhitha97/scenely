import type { Scene } from "@/engine/types";

/**
 * School — the learner is a parent at a parent-teacher talk. Level B1 (see docs/curriculum-nl.md):
 * how the child is doing, practising at home and reporting an absence with *omdat*. Formal "u". Written for Scenely.
 */
export const schoolOuder: Scene = {
  id: "school-ouder",
  language: "nl-NL",
  scenario: { id: "school", title: "School" },
  role: { id: "ouder", title: "Ouder" },
  badge: { title: "Betrokken ouder", message: "Je hebt een goed gesprek gehad met de leraar.", icon: "badge-school" },
  background: "school",
  character: "leraar",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Leraar",
      text: "Goedemiddag! Fijn dat u er bent. Gaat u zitten.",
      animation: "leraar-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "uitnodiging", label: "Goedemiddag. Dank u wel voor de uitnodiging.", icon: "chat", correct: true, next: "t3", reaction: "tick" },
        { id: "retour", label: "Goedemiddag. Een retour Utrecht, graag.", icon: "train", correct: false, next: "t2", reaction: "cross" },
        { id: "keelpijn", label: "Goedemiddag. Ik heb keelpijn.", icon: "steth", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Leraar",
      text: "Ik wil graag over Noor praten. Ze doet goed mee in de klas.",
      animation: "leraar-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "fijn", label: "Wat fijn! Thuis vertelt ze veel over school.", icon: "school", correct: true, next: "t5", reaction: "tick" },
        { id: "maat", label: "Wat fijn! Heeft u maat M?", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
        { id: "kaas", label: "Jammer. Wat kost de kaas?", icon: "cheese", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Leraar",
      text: "Ze vindt rekenen nog wel moeilijk. Kunt u thuis met haar oefenen?",
      animation: "leraar-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "oefenen", label: "Ja, dat doen we graag. Welke oefeningen zijn goed?", icon: "school", correct: true, next: "t7", reaction: "tick" },
        { id: "perron", label: "Ja, op perron twee.", icon: "train", correct: false, next: "t6", reaction: "cross" },
        { id: "pinnen", label: "Nee, ik wil pinnen.", icon: "card", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Leraar",
      text: "Ik geef u een paar spelletjes mee. Tien minuten per dag is genoeg.",
      animation: "leraar-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "tandarts", label: "Goed. Volgende week dinsdag is Noor er niet, omdat ze naar de tandarts moet.", icon: "clock", correct: true, next: "t9", reaction: "tick" },
        { id: "ons", label: "Goed. Twee ons, alstublieft.", icon: "cheese", correct: false, next: "t8", reaction: "cross" },
        { id: "trui", label: "Goed. Ik neem de blauwe trui.", icon: "hanger", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Leraar",
      text: "Dank u dat u het zegt. Wilt u het ook in de app van school zetten?",
      animation: "leraar-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "vandaag", label: "Ja, dat doe ik vandaag nog.", icon: "tick", correct: true, next: "t11", reaction: "tick" },
        { id: "gegeten", label: "Ja, ik heb het gisteren gegeten.", icon: "bread", correct: false, next: "t10", reaction: "cross" },
        { id: "lift", label: "Nee, de lift is kapot.", icon: "hospital", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Leraar",
      text: "Prima. Dank u wel voor het gesprek. Tot ziens!",
    },
  },
};
