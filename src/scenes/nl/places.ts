import type { Place } from "@/engine/places";

/**
 * Places on the illustrated Amsterdam map, in unlock order. The avatar cycles from one to the
 * next along the bike route. Every place has two scenes, one per role.
 * `door` is the place's stop on the route (ROUTE_STOPS in src/components/map/amsterdamMapData.ts);
 * `label` is where its name tag goes, above the building.
 */
export const placesNl: Place[] = [
  { id: "koffiebar", title: "Bij de koffiebar", blurb: "Bestel een koffie en betaal.", icon: "coffee", sceneIds: ["koffiebar-klant", "koffiebar-barista"], roles: ["Klant", "Barista"], door: { x: 250, y: 330 }, label: { x: 210, y: 182 } },
  { id: "supermarkt", title: "Supermarkt", blurb: "Boodschappen doen en afrekenen.", icon: "basket", sceneIds: ["supermarkt-klant", "supermarkt-kassa"], roles: ["Klant", "Kassa"], door: { x: 470, y: 335 }, label: { x: 450, y: 186 } },
  { id: "markt", title: "Op de markt", blurb: "Kaas kopen op de markt.", icon: "cheese", sceneIds: ["markt-klant", "markt-kaasboer"], roles: ["Klant", "Kaasboer"], door: { x: 860, y: 306 }, label: { x: 860, y: 184 } },
  { id: "kleding", title: "Kledingwinkel", blurb: "Iets passen en een maat vragen.", icon: "hanger", sceneIds: ["kleding-klant", "kleding-verkoper"], roles: ["Klant", "Verkoper"], door: { x: 1080, y: 326 }, label: { x: 1088, y: 330 } },
  { id: "huisarts", title: "Huisarts", blurb: "Een afspraak maken en vertellen wat je hebt.", icon: "steth", sceneIds: ["huisarts-patient", "huisarts-huisarts"], roles: ["Patiënt", "Huisarts"], door: { x: 1062, y: 590 }, label: { x: 1100, y: 490 } },
  { id: "ziekenhuis", title: "Ziekenhuis", blurb: "De weg vragen en je melden.", icon: "hospital", sceneIds: ["ziekenhuis-patient", "ziekenhuis-verpleegkundige"], roles: ["Patiënt", "Verpleegkundige"], door: { x: 620, y: 708 }, label: { x: 470, y: 630 } },
  { id: "school", title: "School", blurb: "Praten met de leraar van je kind.", icon: "school", sceneIds: ["school-ouder", "school-leraar"], roles: ["Ouder", "Leraar"], door: { x: 230, y: 680 }, label: { x: 120, y: 560 } },
  { id: "station", title: "Station", blurb: "Een kaartje kopen en het perron vinden.", icon: "train", sceneIds: ["station-reiziger", "station-loket"], roles: ["Reiziger", "Loket"], door: { x: 600, y: 186 }, label: { x: 610, y: 194 } },
];
