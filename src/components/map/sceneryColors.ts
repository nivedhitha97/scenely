import type { DayPhase, Scenery, Season } from "@/engine/scenery";

/**
 * Recolours the Amsterdam drawing for the time of day and the season, by rewriting its hex
 * colours. First the season swaps the colours of grass, trees and water (orange leaves, snow,
 * blossom); then the time of day grades every colour (golden evening, blue night) and lights the
 * windows and street lamps after dark.
 */

type RGB = [number, number, number];

const hex = (c: string): RGB => {
  let h = c.replace("#", "");
  if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
const toHex = ([r, g, b]: RGB): string =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** Season swaps, from the summer drawing. Keys are upper-case #RRGGBB. */
const SEASON: Record<Season, Record<string, string>> = {
  summer: {},
  spring: {
    "#8DBD55": "#A5D670", // fresh leaves
    "#B4D77E": "#F6C3D0", // blossom on the trees
    "#7DAE48": "#8CC25A",
    "#C9DE93": "#C4E59A", // bright grass
    "#B5D67F": "#B8E08A",
  },
  autumn: {
    "#7DAE48": "#D98A3D",
    "#8DBD55": "#E9A84C",
    "#6FA343": "#C4643A",
    "#B4D77E": "#F2C46B",
    "#C9DE93": "#DCCB8A",
    "#B5D67F": "#D2C27C",
    "#9DBB67": "#BFA867",
    "#86AE55": "#B69A5A",
  },
  winter: {
    "#7DAE48": "#E3EAED", // snow on the trees
    "#8DBD55": "#EEF3F5",
    "#6FA343": "#D5DEE2",
    "#B4D77E": "#FFFFFF",
    "#4E6B2E": "#7D8C93", // branch outlines
    "#C9DE93": "#EEF2F3", // snowy grass
    "#B5D67F": "#E8EEF0",
    "#9DBB67": "#C9D3D6",
    "#86AE55": "#C2CDD1",
    "#F3E4C4": "#EDEEEA", // snow on the streets
    "#EADBB9": "#F7F8F6",
    "#6CB2DC": "#A9D0E2", // icy canals
    "#4A8DB8": "#86B3CB",
    "#A9D4EC": "#E6F2F8",
    "#CFE6F0": "#DCE6EC", // pale winter sky
  },
};

/** Colours that are lit windows or lamps; they glow after dark instead of darkening. */
const LIGHTS = new Set(["#FBF4E8", "#F2D9A8", "#F7D58A", "#F6D776", "#DCEBEA"]);
const SKY = "#CFE6F0";

type Grade = { darken: number; tint: RGB; amount: number; sky: string; lights: boolean };
const GRADE: Record<DayPhase, Grade> = {
  dawn: { darken: 0.9, tint: [244, 166, 160], amount: 0.14, sky: "#F6C9C0", lights: false },
  morning: { darken: 1, tint: [255, 240, 214], amount: 0.06, sky: "#D8EEF7", lights: false },
  day: { darken: 1, tint: [255, 255, 255], amount: 0, sky: SKY, lights: false },
  evening: { darken: 0.95, tint: [255, 158, 94], amount: 0.16, sky: "#F7C59F", lights: false },
  dusk: { darken: 0.7, tint: [70, 60, 120], amount: 0.3, sky: "#6E5A8C", lights: true },
  night: { darken: 0.45, tint: [29, 43, 79], amount: 0.38, sky: "#172240", lights: true },
};
const LIT = "#FFD873";

/** The colour a single drawing colour becomes for this scenery. */
export function sceneryColour(colour: string, { phase, season }: Scenery): string {
  const key = toHex(hex(colour));
  const g = GRADE[phase];
  if (key === SKY) return season === "winter" && (phase === "day" || phase === "morning") ? SEASON.winter[SKY] : g.sky;
  if (g.lights && LIGHTS.has(key)) return LIT;
  const seasoned = hex(SEASON[season][key] ?? key);
  const darkened: RGB = [seasoned[0] * g.darken, seasoned[1] * g.darken, seasoned[2] * g.darken];
  return toHex(mix(darkened, g.tint, g.amount));
}

const cache = new Map<string, string>();

/** The drawing's SVG with every colour changed for this scenery. Cached per time and season. */
export function applyScenery(xml: string, scenery: Scenery): string {
  if (scenery.phase === "day" && scenery.season === "summer") return xml;
  const key = `${scenery.phase}/${scenery.season}/${xml.length}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const out = xml.replace(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g, (c) => sceneryColour(c, scenery));
  cache.set(key, out);
  return out;
}
