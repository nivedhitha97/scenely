import type { Scene } from "@/engine/types";

/**
 * Ziekenhuis — the learner reports at the hospital desk. Level A2 → B1 (see docs/curriculum-nl.md):
 * an appointment, date of birth, the insurance card, directions and *omdat*. Formal "u". Written for Scenely.
 */
export const ziekenhuisPatient: Scene = {
  id: "ziekenhuis-patient",
  language: "nl-NL",
  scenario: { id: "ziekenhuis", title: "Ziekenhuis" },
  role: { id: "patient", title: "Patiënt" },
  badge: { title: "Op tijd", message: "Je hebt je gemeld en de weg gevonden.", icon: "badge-hospital" },
  background: "ziekenhuis",
  character: "verpleegkundige",
  start: "t1",
  turns: {
    t1: {
      kind: "npc",
      id: "t1",
      speaker: "Verpleegkundige",
      text: "Goedemorgen. Kan ik u helpen?",
      animation: "verpleegkundige-talk",
      next: "t2",
    },
    t2: {
      kind: "player",
      id: "t2",
      choices: [
        { id: "afspraak", label: "Goedemorgen. Ik heb om tien uur een afspraak bij Radiologie.", icon: "hospital", correct: true, next: "t3", reaction: "tick" },
        { id: "trui", label: "Goedemorgen. Ik zoek een blauwe trui.", icon: "hanger", correct: false, next: "t2", reaction: "cross" },
        { id: "kaas", label: "Goedemorgen. Twee ons oude kaas, graag.", icon: "cheese", correct: false, next: "t2", reaction: "cross" },
      ],
    },
    t3: {
      kind: "npc",
      id: "t3",
      speaker: "Verpleegkundige",
      text: "Wat is uw geboortedatum?",
      animation: "verpleegkundige-talk",
      next: "t4",
    },
    t4: {
      kind: "player",
      id: "t4",
      choices: [
        { id: "geboortedatum", label: "Mijn geboortedatum is 12 maart 1990.", icon: "user", correct: true, next: "t5", reaction: "tick" },
        { id: "gekomen", label: "Ik ben om negen uur gekomen.", icon: "clock", correct: false, next: "t4", reaction: "cross" },
        { id: "maat", label: "Mijn maat is M.", icon: "hanger", correct: false, next: "t4", reaction: "cross" },
      ],
    },
    t5: {
      kind: "npc",
      id: "t5",
      speaker: "Verpleegkundige",
      text: "Dank u. Heeft u uw zorgpas bij u?",
      animation: "verpleegkundige-talk",
      next: "t6",
    },
    t6: {
      kind: "player",
      id: "t6",
      choices: [
        { id: "pas", label: "Ja, alstublieft. Hier is mijn pas.", icon: "card", correct: true, next: "t7", reaction: "tick" },
        { id: "honger", label: "Nee, ik heb geen honger.", icon: "bread", correct: false, next: "t6", reaction: "cross" },
        { id: "fiets", label: "Ja, mijn fiets staat buiten.", icon: "bag", correct: false, next: "t6", reaction: "cross" },
      ],
    },
    t7: {
      kind: "npc",
      id: "t7",
      speaker: "Verpleegkundige",
      text: "Prima. Radiologie is op de eerste verdieping. Neem de lift en ga dan naar links.",
      animation: "verpleegkundige-talk",
      next: "t8",
    },
    t8: {
      kind: "player",
      id: "t8",
      choices: [
        { id: "herhalen", label: "Dus met de lift naar de eerste verdieping en dan links?", icon: "hospital", correct: true, next: "t9", reaction: "tick" },
        { id: "perron", label: "Dus perron één en dan de trein?", icon: "train", correct: false, next: "t8", reaction: "cross" },
        { id: "paskamer", label: "Dus maat L en dan de paskamer?", icon: "hanger", correct: false, next: "t8", reaction: "cross" },
      ],
    },
    t9: {
      kind: "npc",
      id: "t9",
      speaker: "Verpleegkundige",
      text: "Ja, precies. U moet daar even wachten, omdat de dokter nog bezig is.",
      animation: "verpleegkundige-talk",
      next: "t10",
    },
    t10: {
      kind: "player",
      id: "t10",
      choices: [
        { id: "bedankt", label: "Duidelijk. Dank u wel voor de hulp.", icon: "tick", correct: true, next: "t11", reaction: "tick" },
        { id: "prijs", label: "Duidelijk. Dat is dan €6,20.", icon: "cash", correct: false, next: "t10", reaction: "cross" },
        { id: "welterusten", label: "Duidelijk. Welterusten!", icon: "moon", correct: false, next: "t10", reaction: "cross" },
      ],
    },
    t11: {
      kind: "end",
      id: "t11",
      speaker: "Verpleegkundige",
      text: "Graag gedaan. Sterkte vandaag!",
    },
  },
};
