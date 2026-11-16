import { koffiebarBarista } from "@/scenes/nl/koffiebar-barista";
import { koffiebarKlant } from "@/scenes/nl/koffiebar-klant";
import { sceneSummary } from "../summary";

describe("sceneSummary", () => {
  const answers = { t2: "koffie", t4: "zwart", t6: "pinnen" };

  it("lists the learner's answers in order and counts every line they heard", () => {
    const s = sceneSummary(koffiebarKlant, answers, []);
    expect(s.phrases.map((p) => p.text)).toEqual(["Een koffie, alstublieft.", "Zwart, alstublieft.", "Pinnen, alstublieft."]);
    expect(s.answers).toBe(3);
    expect(s.linesHeard).toBe(4); // three barista lines and the closing line
    expect(s.spokenAloud).toBe(0);
  });

  it("marks the sentences that were said out loud", () => {
    const s = sceneSummary(koffiebarKlant, answers, ["t4", "t6"]);
    expect(s.phrases.map((p) => p.spoken)).toEqual([false, true, true]);
    expect(s.spokenAloud).toBe(2);
  });

  it("uses the choice the learner picked when several answers are right", () => {
    const s = sceneSummary(koffiebarKlant, { ...answers, t4: "melk" }, []);
    expect(s.phrases[1].text).toBe("Met melk, alstublieft.");
  });

  it("stops where the learner stopped answering", () => {
    const s = sceneSummary(koffiebarKlant, { t2: "koffie" }, []);
    expect(s.answers).toBe(1);
    expect(s.linesHeard).toBe(2);
  });

  it("ignores a wrong choice id", () => {
    const s = sceneSummary(koffiebarKlant, { t2: "bier" }, []);
    expect(s.phrases).toEqual([]);
  });

  it("works for the barista version too", () => {
    const first = Object.values(koffiebarBarista.turns).find((t) => t.kind === "player");
    expect(first).toBeDefined();
    const s = sceneSummary(koffiebarBarista, {}, []);
    expect(s.answers).toBe(0);
  });
});
