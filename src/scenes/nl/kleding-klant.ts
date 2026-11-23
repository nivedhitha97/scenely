import type { Scene } from "@/engine/types";

/**
 * Kledingwinkel — the learner tries on a jumper. Level A2 (see docs/curriculum-nl.md): sizes and
 * colours, the fitting room, *te klein*, and the perfect tense in a wrong answer. Formal "u". Written for Scenely.
 */
export const kledingKlant: Scene = {
  id: "kleding-klant",
  language: "nl-NL",
  scenario: { id: "kleding", title: "Kledingwinkel" },
  role: { id: "klant", title: "Klant" },
  badge: { title: "Goed gekleed", message: "Je nieuwe trui past perfect!", icon: "badge-hanger" },
  background: "kleding",
  character: "verkoper",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Verkoper",
      text: "Hallo! Kan ik u helpen?",
      animation: "verkoper-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "trui", label: "Ja, graag. Ik zoek een trui.", icon: "hanger", correct: true, next: "t3", reaction: "tick" },
        { id: "koorts", label: "Ja, ik heb koorts.", icon: "steth", correct: false, next: "t2", reaction: "cross" },
        { id: "retour", label: "Een retour naar Leiden, graag.", icon: "train", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Verkoper",
      text: "Welke maat heeft u?",
      animation: "verkoper-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "maat-m", label: "Ik heb maat M.", icon: "hanger", correct: true, next: "t5", reaction: "tick" },
        { id: "kinderen", label: "Ik heb vier kinderen.", icon: "user", correct: false, next: "t4", reaction: "cross" },
        { id: "half-negen", label: "Om half negen.", icon: "clock", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Verkoper",
      text: "Deze trui is er in het blauw en in het groen.",
      animation: "verkoper-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "blauw", label: "Mag ik de blauwe passen?", icon: "hanger", correct: true, next: "t7", reaction: "tick" },
        { id: "groen", label: "Mag ik de groene passen?", icon: "hanger", correct: true, next: "t7", reaction: "tick" },
        { id: "kaas", label: "Ik wil graag een pond kaas.", icon: "cheese", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Verkoper",
      text: "Natuurlijk. De paskamer is daar achterin.",
      animation: "verkoper-talk",
      next: "t8",
    },
    t8: {
      kind: "npc",
      id: "t8",
      speaker: "Verkoper",
      text: "En? Past de trui?",
      animation: "verkoper-talk",
      next: "t9",
    },
    t9: {
      kind: "player",
      id: "t9",
      choices: [
        { id: "te-klein", label: "Hij is te klein. Heeft u ook maat L?", icon: "hanger", correct: true, next: "t10", reaction: "tick" },
        { id: "gemist", label: "Ik heb de trein gemist.", icon: "train", correct: false, next: "t9", reaction: "cross" },
        { id: "bon", label: "Wilt u de bon?", icon: "receipt", correct: false, next: "t9", reaction: "cross" },
      ],
    },
    t10: {
      kind: "npc",
      id: "t10",
      speaker: "Verkoper",
      text: "Ja hoor. Alstublieft, deze is maat L.",
      animation: "verkoper-talk",
      next: "t11",
    },
    t11: {
      kind: "player",
      id: "t11",
      choices: [
        { id: "neem", label: "Deze past goed. Ik neem hem.", icon: "tick", correct: true, next: "t12", reaction: "tick" },
        { id: "gegeten", label: "Ik heb hem gisteren gegeten.", icon: "bread", correct: false, next: "t11", reaction: "cross" },
        { id: "ons", label: "Twee ons, alstublieft.", icon: "cheese", correct: false, next: "t11", reaction: "cross" },
      ],
    },
    t12: {
      kind: "end",
      id: "t12",
      speaker: "Verkoper",
      text: "Mooi! U kunt bij de kassa betalen. Ruilen kan binnen dertig dagen.",
    },
  },
};
