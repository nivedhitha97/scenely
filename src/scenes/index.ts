import type { Scene } from "@/engine/types";
import { huisartsHuisarts } from "./nl/huisarts-huisarts";
import { huisartsPatient } from "./nl/huisarts-patient";
import { kledingKlant } from "./nl/kleding-klant";
import { kledingVerkoper } from "./nl/kleding-verkoper";
import { koffiebarBarista } from "./nl/koffiebar-barista";
import { koffiebarKlant } from "./nl/koffiebar-klant";
import { marktKaasboer } from "./nl/markt-kaasboer";
import { marktKlant } from "./nl/markt-klant";
import { schoolLeraar } from "./nl/school-leraar";
import { schoolOuder } from "./nl/school-ouder";
import { stationLoket } from "./nl/station-loket";
import { stationReiziger } from "./nl/station-reiziger";
import { supermarktKassa } from "./nl/supermarkt-kassa";
import { supermarktKlant } from "./nl/supermarkt-klant";
import { ziekenhuisPatient } from "./nl/ziekenhuis-patient";
import { ziekenhuisVerpleegkundige } from "./nl/ziekenhuis-verpleegkundige";

/**
 * Unlock order for Dutch. The first scene is open from the start; each
 * following scene opens when the one before it is completed.
 * To add a scene: create a file in ./nl/ and append it here.
 */
export const scenesNl: Scene[] = [
  koffiebarKlant,
  koffiebarBarista,
  supermarktKlant,
  supermarktKassa,
  marktKlant,
  marktKaasboer,
  kledingKlant,
  kledingVerkoper,
  huisartsPatient,
  huisartsHuisarts,
  ziekenhuisPatient,
  ziekenhuisVerpleegkundige,
  schoolOuder,
  schoolLeraar,
  stationReiziger,
  stationLoket,
];

export function findScene(id: string): Scene | undefined {
  return scenesNl.find((s) => s.id === id);
}
