import { sceneryColour } from "@/components/map/sceneryColors";
import type { Scenery } from "@/engine/scenery";

export type IntroShotId = "landing" | "airport" | "train" | "bike" | "cafe";

export type IntroShot = {
  id: IntroShotId;
  /** The line read aloud and shown large. */
  line: string;
  /** A short second line under it. */
  sub: string;
  /** What the picture shows, for screen readers. */
  label: string;
};

/** The five shots of the intro story, in order. All Dutch, all original. */
export const INTRO_SHOTS: readonly IntroShot[] = [
  {
    id: "landing",
    line: "Je vliegt naar Nederland.",
    sub: "Een nieuw land. Een nieuwe taal.",
    label: "Een vliegtuig daalt boven rijen bloeiende tulpen en een molen.",
  },
  {
    id: "airport",
    line: "Welkom in Nederland!",
    sub: "Je bent geland op het vliegveld.",
    label: "Jij loopt met een koffer door de aankomsthal, onder een groot bord: Welkom in Nederland.",
  },
  {
    id: "train",
    line: "Je neemt de trein naar de stad.",
    sub: "Kijk, de grachten!",
    label: "Een trein rijdt over een brug langs grachtenpanden. Jij zwaait uit het raam.",
  },
  {
    id: "bike",
    line: "In de stad pak je de fiets.",
    sub: "Iedereen fietst hier.",
    label: "Jij fietst langs een gracht. Er vaart een bootje voorbij.",
  },
  {
    id: "cafe",
    line: "Hier begint je verhaal.",
    sub: "Je eerste koffie in het Nederlands.",
    label: "Jouw fiets staat voor een koffiebar met een gestreepte luifel. Jij loopt naar de deur.",
  },
];

const painted = new Map<string, string>();

/**
 * Recolours a drawing for the time of day and the season, like the map. Cached per layer, so
 * `key` must name the layer (and anything else that changes its colours, like the avatar).
 */
export function paint(key: string, xml: string, scenery: Scenery): string {
  if (scenery.phase === "day" && scenery.season === "summer") return xml;
  const id = `${key}/${xml.length}/${scenery.phase}/${scenery.season}`;
  const hit = painted.get(id);
  if (hit) return hit;
  const out = xml.replace(/#[0-9A-Fa-f]{6}\b/g, (c) => sceneryColour(c, scenery));
  painted.set(id, out);
  return out;
}
