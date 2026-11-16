import { decodeResult, encodeResult } from "../result";

describe("scene result route params", () => {
  it("survives a round trip", () => {
    const r = { badgeEarned: true, answers: { t2: "koffie", t4: "zwart" }, spoken: ["t2", "t4"] };
    expect(decodeResult(encodeResult(r))).toEqual(r);
  });

  it("keeps an empty spoken list empty", () => {
    const r = { badgeEarned: false, answers: { t2: "koffie" }, spoken: [] };
    expect(decodeResult(encodeResult(r))).toEqual(r);
  });

  it("returns null when the page is opened without a play-through", () => {
    expect(decodeResult({})).toBeNull();
    expect(decodeResult({ answers: "not json" })).toBeNull();
    expect(decodeResult({ answers: "[1,2]" })).toBeNull();
  });

  it("drops answers that aren't strings", () => {
    expect(decodeResult({ answers: '{"t2":"koffie","t4":3}' })?.answers).toEqual({ t2: "koffie" });
  });
});
