import { nl } from "./nl";
import type { Theme } from "./types";

const themes: Record<string, Theme> = { nl };

/** Theme for a language tag such as "nl-NL". Falls back to Nederland until more themes exist. */
export function themeFor(language: string): Theme {
  return themes[language.split("-")[0].toLowerCase()] ?? nl;
}

/** The app currently teaches Dutch only. */
export function useTheme(): Theme {
  return nl;
}

export type { Theme };
