import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DayPhase, Season } from "@/engine/scenery";

export type ThemeChoice = "system" | "light" | "dark";

export type Reminder = {
  enabled: boolean;
  /** Local time of the daily reminder. */
  hour: number;
  minute: number;
};

/** The learner's preferences. Saved on this device; also kept with their account when signed in. */
export type Settings = {
  theme: ThemeChoice;
  reminder: Reminder;
  /** Offer "Zeg het hardop" after right answers (where speech recognition is available). */
  speaking: boolean;
  /** The map's sky and season: "auto" follows the phone's clock and time zone; a value previews it. */
  mapLook: { phase: DayPhase | "auto"; season: Season | "auto" };
};

const PHASES: readonly DayPhase[] = ["dawn", "morning", "day", "evening", "dusk", "night"];
const SEASONS: readonly Season[] = ["spring", "summer", "autumn", "winter"];

export const defaultSettings: Settings = {
  theme: "system",
  reminder: { enabled: false, hour: 19, minute: 0 },
  speaking: true,
  mapLook: { phase: "auto", season: "auto" },
};

const KEY = "scenely/v1/settings";

/** Keeps every valid field of `value` and fills the rest from the defaults. */
export function parseSettings(value: unknown): Settings {
  if (!value || typeof value !== "object") return defaultSettings;
  const v = value as Partial<Settings>;
  const r = (v.reminder ?? {}) as Partial<Reminder>;
  const inRange = (n: unknown, max: number): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= max;
  return {
    theme: v.theme === "light" || v.theme === "dark" || v.theme === "system" ? v.theme : defaultSettings.theme,
    reminder: {
      enabled: typeof r.enabled === "boolean" ? r.enabled : defaultSettings.reminder.enabled,
      hour: inRange(r.hour, 23) ? r.hour : defaultSettings.reminder.hour,
      minute: inRange(r.minute, 59) ? r.minute : defaultSettings.reminder.minute,
    },
    speaking: typeof v.speaking === "boolean" ? v.speaking : defaultSettings.speaking,
    mapLook: {
      phase: (PHASES as readonly string[]).includes(String(v.mapLook?.phase)) ? (v.mapLook!.phase as DayPhase) : "auto",
      season: (SEASONS as readonly string[]).includes(String(v.mapLook?.season)) ? (v.mapLook!.season as Season) : "auto",
    },
  };
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return parseSettings(raw ? JSON.parse(raw) : null);
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings));
}

/** "19:00" */
export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
