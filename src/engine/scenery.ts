/**
 * What the sky and the trees on the map look like: the time of day on the learner's phone and the
 * season where they live. Pure functions; the phone's own time zone decides the local time.
 */

export type DayPhase = "dawn" | "morning" | "day" | "evening" | "dusk" | "night";
export type Season = "spring" | "summer" | "autumn" | "winter";
export type Scenery = { phase: DayPhase; season: Season };

/** Local clock time as hours with a fraction (13:30 → 13.5). */
export function localHours(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}

/**
 * The part of the day: dawn 5–7, morning 7–11, day 11–17, evening 17–20 (golden light),
 * dusk 20–21:30, night after that.
 */
export function dayPhase(date: Date): DayPhase {
  const h = localHours(date);
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 11) return "morning";
  if (h >= 11 && h < 17) return "day";
  if (h >= 17 && h < 20) return "evening";
  if (h >= 20 && h < 21.5) return "dusk";
  return "night";
}

/** Time zones south of the equator (where December is summer). Prefix matches, e.g. "Australia/". */
const SOUTHERN = [
  "Australia/", "Antarctica/", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Fiji", "Pacific/Tongatapu", "Pacific/Apia", "Pacific/Noumea", "Pacific/Efate",
  "America/Argentina/", "America/Buenos_Aires", "America/Sao_Paulo", "America/Santiago", "America/Montevideo", "America/Asuncion", "America/La_Paz", "America/Lima",
  "America/Punta_Arenas", "America/Campo_Grande", "America/Cuiaba", "America/Recife", "America/Bahia", "America/Fortaleza", "America/Maceio", "America/Belem",
  "Africa/Johannesburg", "Africa/Maputo", "Africa/Harare", "Africa/Lusaka", "Africa/Windhoek", "Africa/Gaborone", "Africa/Maseru", "Africa/Mbabane",
  "Africa/Lubumbashi", "Africa/Luanda", "Africa/Blantyre", "Africa/Dar_es_Salaam", "Indian/Antananarivo", "Indian/Mauritius", "Indian/Reunion", "Indian/Mayotte",
  "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "Asia/Dili", "Pacific/Port_Moresby",
];

export function isSouthernHemisphere(timeZone: string | undefined): boolean {
  if (!timeZone) return false;
  return SOUTHERN.some((z) => timeZone === z || (z.endsWith("/") && timeZone.startsWith(z)));
}

/** Meteorological seasons: spring Mar–May, summer Jun–Aug, autumn Sep–Nov, winter Dec–Feb (flipped south of the equator). */
export function seasonOf(date: Date, timeZone?: string): Season {
  const m = date.getMonth(); // 0 = January
  const north: Season = m >= 2 && m <= 4 ? "spring" : m >= 5 && m <= 7 ? "summer" : m >= 8 && m <= 10 ? "autumn" : "winter";
  if (!isSouthernHemisphere(timeZone)) return north;
  return ({ spring: "autumn", summer: "winter", autumn: "spring", winter: "summer" } as const)[north];
}

/** The phone's time zone name, e.g. "Europe/Amsterdam"; undefined where it can't be read. */
export function deviceTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

export function sceneryAt(date: Date, timeZone: string | undefined = deviceTimeZone()): Scenery {
  return { phase: dayPhase(date), season: seasonOf(date, timeZone) };
}

/**
 * Where the sun (by day) or the moon (by night) sits in the sky band, as fractions:
 * x from 0 (left, east) to 1 (right, west), height from 0 (horizon) to 1 (top).
 */
export function skyBody(date: Date): { body: "sun" | "moon"; x: number; height: number } {
  const h = localHours(date);
  if (h >= 6 && h < 21) {
    const t = (h - 6) / 15; // sunrise 6:00 → sunset 21:00
    return { body: "sun", x: t, height: Math.sin(Math.PI * t) };
  }
  const t = ((h - 21 + 24) % 24) / 9; // 21:00 → 6:00
  return { body: "moon", x: t, height: Math.sin(Math.PI * t) };
}

/** Dutch greeting for the time of day (also a small language lesson on the map). */
export function greeting(date: Date): string {
  const h = localHours(date);
  if (h >= 6 && h < 12) return "Goedemorgen!";
  if (h >= 12 && h < 18) return "Goedemiddag!";
  if (h >= 18 && h < 24) return "Goedenavond!";
  return "Goedenacht!";
}
