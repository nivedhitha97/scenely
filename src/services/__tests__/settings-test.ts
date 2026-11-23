import { defaultSettings, formatTime, parseSettings } from "../settings";

describe("settings", () => {
  it("falls back to the defaults for missing or broken data", () => {
    expect(parseSettings(null)).toEqual(defaultSettings);
    expect(parseSettings("nonsense")).toEqual(defaultSettings);
  });

  it("keeps valid fields and repairs invalid ones", () => {
    const s = parseSettings({ theme: "dark", speaking: false, reminder: { enabled: true, hour: 25, minute: 30 } });
    expect(s.theme).toBe("dark");
    expect(s.speaking).toBe(false);
    expect(s.reminder).toEqual({ enabled: true, hour: defaultSettings.reminder.hour, minute: 30 });
    expect(parseSettings({ theme: "purple" }).theme).toBe("system");
  });

  it("formats reminder times", () => {
    expect(formatTime(8, 0)).toBe("08:00");
    expect(formatTime(12, 30)).toBe("12:30");
  });
});
