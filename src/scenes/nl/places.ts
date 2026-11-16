import type { Place } from "@/engine/places";

/**
 * Places on the map of the Netherlands, in unlock order. The avatar walks from one to the
 * next. Only the café has scenes so far; the rest show as "binnenkort" (coming soon).
 * `door` matches the buildings drawn in src/components/map/NlTownMap.tsx.
 */
export const placesNl: Place[] = [
  { id: "koffiebar", title: "Bij de koffiebar", blurb: "Bestel een koffie en betaal.", icon: "coffee", sceneIds: ["koffiebar-klant", "koffiebar-barista"], roles: ["Klant", "Barista"], door: { x: 470, y: 640 } },
  { id: "supermarkt", title: "Supermarkt", blurb: "Boodschappen doen en afrekenen.", icon: "basket", sceneIds: [], roles: ["Klant", "Kassa"], door: { x: 300, y: 470 } },
  { id: "markt", title: "Op de markt", blurb: "Kaas kopen op de markt.", icon: "cheese", sceneIds: [], roles: ["Klant", "Kaasboer"], door: { x: 470, y: 480 } },
  { id: "kleding", title: "Kledingwinkel", blurb: "Iets passen en een maat vragen.", icon: "hanger", sceneIds: [], roles: ["Klant", "Verkoper"], door: { x: 640, y: 470 } },
  { id: "huisarts", title: "Huisarts", blurb: "Een afspraak maken en vertellen wat je hebt.", icon: "steth", sceneIds: [], roles: ["Patiënt", "Huisarts"], door: { x: 230, y: 700 } },
  { id: "ziekenhuis", title: "Ziekenhuis", blurb: "De weg vragen en je melden.", icon: "hospital", sceneIds: [], roles: ["Patiënt", "Verpleegkundige"], door: { x: 690, y: 720 } },
  { id: "school", title: "School", blurb: "Praten met de leraar van je kind.", icon: "school", sceneIds: [], roles: ["Ouder", "Leraar"], door: { x: 240, y: 250 } },
  { id: "station", title: "Station", blurb: "Een kaartje kopen en het perron vinden.", icon: "train", sceneIds: [], roles: ["Reiziger", "Loket"], door: { x: 800, y: 140 } },
];
