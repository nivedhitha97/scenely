import { createContext, useContext } from "react";

import { nl, nlDark } from "./nl";
import type { Theme } from "./types";

const themes: Record<string, { light: Theme; dark: Theme }> = { nl: { light: nl, dark: nlDark } };

/** Theme for a language tag such as "nl-NL" in light or dark. Falls back to Nederland. */
export function themeFor(language: string, scheme: "light" | "dark" = "light"): Theme {
  const pair = themes[language.split("-")[0].toLowerCase()] ?? themes.nl;
  return pair[scheme];
}

/** Supplied by SettingsProvider (light, dark or the phone's choice). Light when no provider is present. */
export const ThemeContext = createContext<Theme>(nl);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export type { Theme };
