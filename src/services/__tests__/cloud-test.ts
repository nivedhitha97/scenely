import { mergeProgress } from "@/engine/progress";
import { parseCloudProfile } from "../cloud";

const rec = (at: string) => ({ attempts: { t2: 1 }, completedAt: at });

describe("account progress", () => {
  it("merges phone and account progress without losing any", () => {
    const phone = { completed: { a: rec("2026-11-20T10:00:00Z"), b: rec("2026-11-20T10:00:00Z") }, badges: ["a", "b"] };
    const account = { completed: { b: rec("2026-11-21T10:00:00Z"), c: rec("2026-11-19T10:00:00Z") }, badges: ["c", "b"] };
    const merged = mergeProgress(phone, account);
    expect(Object.keys(merged.completed).sort()).toEqual(["a", "b", "c"]);
    expect(merged.completed.b.completedAt).toBe("2026-11-21T10:00:00Z"); // the most recent play
    expect(merged.badges).toEqual(["a", "b", "c"]);
  });

  it("reads a saved profile and drops malformed parts", () => {
    const p = parseCloudProfile({
      avatar: { look: 2, outfit: "#E8C25A" },
      settings: { theme: "dark" },
      progress: { "nl-NL": { completed: {}, badges: [] }, "xx": "broken" },
      updatedAt: 123,
    });
    expect(p.avatar).toEqual({ look: 2, outfit: "#E8C25A" });
    expect(p.settings?.theme).toBe("dark");
    expect(Object.keys(p.progress)).toEqual(["nl-NL"]);
    expect(parseCloudProfile(null)).toEqual({ avatar: null, settings: null, progress: {} });
  });
});
