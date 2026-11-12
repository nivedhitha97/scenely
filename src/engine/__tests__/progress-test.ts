import { scenesNl } from "@/scenes";
import { completeScene, emptyProgress, rating, sceneStatus } from "../progress";

const [klant, barista] = scenesNl;

describe("progress", () => {
  it("only the first scene is unlocked on a fresh install", () => {
    expect(sceneStatus(scenesNl, emptyProgress, klant.id)).toBe("unlocked");
    expect(sceneStatus(scenesNl, emptyProgress, barista.id)).toBe("locked");
  });

  it("completing a scene marks it completed and unlocks the next", () => {
    const { progress, badgeEarned } = completeScene(emptyProgress, klant.id, { t2: 1 });
    expect(badgeEarned).toBe(true);
    expect(progress.badges).toEqual([klant.id]);
    expect(sceneStatus(scenesNl, progress, klant.id)).toBe("completed");
    expect(sceneStatus(scenesNl, progress, barista.id)).toBe("unlocked");
  });

  it("replaying a completed scene does not award the badge again", () => {
    const first = completeScene(emptyProgress, klant.id, { t2: 2 }).progress;
    const replay = completeScene(first, klant.id, { t2: 1 });
    expect(replay.badgeEarned).toBe(false);
    expect(replay.progress.badges).toEqual([klant.id]);
    expect(replay.progress.completed[klant.id].attempts).toEqual({ t2: 1 });
  });

  it("each role version earns its own badge", () => {
    const p1 = completeScene(emptyProgress, klant.id, {}).progress;
    const p2 = completeScene(p1, barista.id, {});
    expect(p2.badgeEarned).toBe(true);
    expect(p2.progress.badges).toEqual([klant.id, barista.id]);
  });

  it("resetting to empty progress locks everything except the first scene", () => {
    expect(emptyProgress.badges).toEqual([]);
    expect(sceneStatus(scenesNl, emptyProgress, barista.id)).toBe("locked");
  });

  it("rates 3 tulips for a perfect run, fewer with extra tries", () => {
    expect(rating({ t2: 1, t4: 1, t6: 1 })).toBe(3);
    expect(rating({ t2: 2, t4: 1, t6: 1 })).toBe(2);
    expect(rating({ t2: 2, t4: 2, t6: 1 })).toBe(1);
  });
});
