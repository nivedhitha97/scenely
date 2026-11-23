import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

import { setUpReminderHandler, syncReminder } from "@/services/reminders";
import { defaultSettings, loadSettings, saveSettings, type Settings } from "@/services/settings";
import { ThemeContext, themeFor } from "@/themes";

type SettingsState = {
  /** False until saved settings have been read. */
  ready: boolean;
  settings: Settings;
  /** Changes some settings and saves them. */
  update: (patch: Partial<Settings>) => void;
  /** Replaces all settings (used when an account brings its own). */
  replace: (next: Settings) => void;
  /** The light or dark scheme actually in use. */
  scheme: "light" | "dark";
};

const SettingsContext = createContext<SettingsState>({
  ready: true,
  settings: defaultSettings,
  update: () => {},
  replace: () => {},
  scheme: "light",
});

/** The learner's preferences, the theme that follows from them, and the daily reminder. */
export function SettingsProvider({ language, children }: { language: string; children: ReactNode }) {
  const system = useColorScheme();
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const settingsRef = useRef(settings);

  useEffect(() => {
    setUpReminderHandler();
    let alive = true;
    loadSettings().then((s) => {
      if (!alive) return;
      settingsRef.current = s;
      setSettings(s);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const replace = useCallback((next: Settings) => {
    settingsRef.current = next;
    setSettings(next);
    saveSettings(next).catch(() => {});
  }, []);

  const update = useCallback((patch: Partial<Settings>) => replace({ ...settingsRef.current, ...patch }), [replace]);

  // Keep the scheduled reminder in step with the setting (also re-picks the message each start).
  const { enabled, hour, minute } = settings.reminder;
  useEffect(() => {
    if (!ready) return;
    syncReminder({ enabled, hour, minute }).catch(() => {});
  }, [ready, enabled, hour, minute]);

  const scheme: "light" | "dark" = settings.theme === "system" ? (system === "dark" ? "dark" : "light") : settings.theme;
  const theme = useMemo(() => themeFor(language, scheme), [language, scheme]);
  const value = useMemo(() => ({ ready, settings, update, replace, scheme }), [ready, settings, update, replace, scheme]);

  return (
    <SettingsContext.Provider value={value}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsState {
  return useContext(SettingsContext);
}
