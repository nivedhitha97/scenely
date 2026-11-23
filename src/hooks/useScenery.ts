import { useEffect, useMemo, useState } from "react";
import { AppState } from "react-native";

import { sceneryAt, skyBody, type DayPhase, type Scenery } from "@/engine/scenery";
import { useSettings } from "./useSettings";

/** A clock time that shows each phase, for previews. */
const PREVIEW_HOUR: Record<DayPhase, number> = { dawn: 6, morning: 9, day: 13, evening: 18.5, dusk: 20.7, night: 1 };

/**
 * The time of day and season for the map, from the phone's clock and time zone (or the preview
 * chosen in Settings). Re-reads the clock every minute and when the app comes back to the front.
 */
export function useScenery(): {
  scenery: Scenery;
  sky: ReturnType<typeof skyBody>;
  /** The time the map shows: the real time, or a time in the previewed part of the day. */
  clock: Date;
} {
  const [now, setNow] = useState(() => new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setNow(new Date());
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  const auto = sceneryAt(now);
  const phase = settings.mapLook.phase === "auto" ? auto.phase : settings.mapLook.phase;
  const season = settings.mapLook.season === "auto" ? auto.season : settings.mapLook.season;
  const scenery = useMemo(() => ({ phase, season }), [phase, season]);

  let skyTime = now;
  if (settings.mapLook.phase !== "auto") {
    const h = PREVIEW_HOUR[settings.mapLook.phase];
    skyTime = new Date(now);
    skyTime.setHours(Math.floor(h), Math.round((h % 1) * 60), 0, 0);
  }
  const sky = skyBody(skyTime);
  // Round so the map only redraws when the sun or moon has visibly moved.
  const rounded = useMemo(() => ({ body: sky.body, x: Math.round(sky.x * 200) / 200, height: Math.round(sky.height * 100) / 100 }), [sky.body, sky.x, sky.height]);
  return { scenery, sky: rounded, clock: skyTime };
}
