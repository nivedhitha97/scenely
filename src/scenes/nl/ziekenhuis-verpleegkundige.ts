import type { Scene } from "@/engine/types";

/**
 * Ziekenhuis — the learner works at the hospital desk. Level A2 → B1 (see docs/curriculum-nl.md):
 * checking an appointment, the insurance card and giving directions. Formal "u". Written for Scenely.
 */
export const ziekenhuisVerpleegkundige: Scene = {
  id: "ziekenhuis-verpleegkundige",
  language: "nl-NL",
  scenario: { id: "ziekenhuis", title: "Ziekenhuis" },
  role: { id: "verpleegkundige", title: "Verpleegkundige" },
  badge: { title: "Zorgverlener", message: "Jij wijst iedereen de weg in het ziekenhuis.", icon: "badge-steth" },
  background: "ziekenhuis",
  character: "shopper",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Patiënt",
      text: "Goedemiddag. Ik moet me melden voor een afspraak.",
      animation: "shopper-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "afdeling", label: "Goedemiddag. Bij welke afdeling heeft u een afspraak?", icon: "hospital", correct: true, next: "t3", reaction: "tick" },
        { id: "maat", label: "Goedemiddag. Welke maat heeft u?", icon: "hanger", correct: false, next: "t2", reaction: "cross" },
        { id: "proeven", label: "Goedemiddag. Wilt u proeven?", icon: "cheese", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Patiënt",
      text: "Bij Cardiologie, om twee uur.",
      animation: "shopper-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "zorgpas", label: "Mag ik uw zorgpas en uw geboortedatum?", icon: "card", correct: true, next: "t5", reaction: "tick" },
        { id: "bon", label: "Mag ik uw bon? Dan kunt u ruilen.", icon: "receipt", correct: false, next: "t4", reaction: "cross" },
        { id: "kaartje", label: "Mag ik uw kaartje? De trein vertrekt.", icon: "train", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Patiënt",
      text: "Alstublieft. Ik ben geboren op 3 juni 1985.",
      animation: "shopper-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "verdieping", label: "Dank u. Cardiologie is op de tweede verdieping.", icon: "hospital", correct: true, next: "t7", reaction: "tick" },
        { id: "totaal", label: "Dank u. Dat is dan €12,80.", icon: "cash", correct: false, next: "t6", reaction: "cross" },
        { id: "kaas-op", label: "Dank u. De kaas is op.", icon: "cheese", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Patiënt",
      text: "Ik kan niet zo goed lopen. Is er een lift?",
      animation: "shopper-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "lift", label: "Ja, de lift is hier rechts. Of wilt u een rolstoel?", icon: "hospital", correct: true, next: "t9", reaction: "tick" },
        { id: "lift-maat", label: "Ja, de lift is maat L.", icon: "hanger", correct: false, next: "t8", reaction: "cross" },
        { id: "zondag", label: "Nee, omdat het zondag is.", icon: "close", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Patiënt",
      text: "De lift is goed. Dank u wel.",
      animation: "shopper-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "balie", label: "Graag gedaan. Meld u boven bij de balie van Cardiologie.", icon: "tick", correct: true, next: "t11", reaction: "tick" },
        { id: "vakantie", label: "Graag gedaan. Fijne vakantie!", icon: "sun", correct: false, next: "t10", reaction: "cross" },
        { id: "welterusten", label: "Graag gedaan. Welterusten!", icon: "moon", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Patiënt",
      text: "Dat doe ik. Tot ziens!",
    },
  },
};
