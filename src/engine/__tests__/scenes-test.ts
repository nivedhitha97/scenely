import { scenesNl } from "@/scenes";
import type { Scene } from "../types";
import { validateScene } from "../validate";

describe("scene data", () => {
  it.each(scenesNl.map((s) => [s.id, s] as const))("%s is valid", (_id, scene) => {
    expect(validateScene(scene)).toEqual([]);
  });

  it("scene ids are unique", () => {
    const ids = scenesNl.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every Dutch scene uses nl-NL", () => {
    for (const s of scenesNl) expect(s.language).toBe("nl-NL");
  });

  it("contains no straight quotes in learner-facing text (use typographic quotes)", () => {
    for (const s of scenesNl) {
      for (const t of Object.values(s.turns)) {
        const texts = t.kind === "player" ? t.choices.map((c) => c.label) : [t.text];
        for (const text of texts) expect(text).not.toMatch(/["']/);
      }
    }
  });
});

describe("validateScene", () => {
  const base: Scene = {
    id: "x",
    language: "nl-NL",
    scenario: { id: "x", title: "X" },
    role: { id: "r", title: "R" },
    badge: { title: "B", message: "M", icon: "i" },
    background: "bg",
    character: "c",
    start: "a",
    turns: {
      a: { kind: "npc", id: "a", speaker: "S", text: "Hoi", animation: "x", next: "b" },
      b: {
        kind: "player",
        id: "b",
        choices: [{ id: "ok", label: "Ja", icon: "i", correct: true, next: "c", reaction: "tick" }],
      },
      c: { kind: "end", id: "c", speaker: "S", text: "Doei" },
    },
  };

  it("accepts a well-formed scene", () => {
    expect(validateScene(base)).toEqual([]);
  });

  it("reports a missing start turn, broken links and a turn without a correct choice", () => {
    const broken: Scene = {
      ...base,
      start: "zz",
      turns: {
        ...base.turns,
        a: { kind: "npc", id: "a", speaker: "S", text: "Hoi", animation: "x", next: "missing" },
        b: {
          kind: "player",
          id: "b",
          choices: [{ id: "no", label: "Nee", icon: "i", correct: false, next: "b", reaction: "cross" }],
        },
      },
    };
    const errors = validateScene(broken);
    expect(errors).toEqual(
      expect.arrayContaining([
        'start turn "zz" does not exist',
        'npc turn "a" points to missing turn "missing"',
        'player turn "b" has no correct choice',
      ]),
    );
  });

  it("reports when no end turn can be reached", () => {
    const loop: Scene = {
      ...base,
      turns: {
        a: { kind: "npc", id: "a", speaker: "S", text: "Hoi", animation: "x", next: "a" },
        c: { kind: "end", id: "c", speaker: "S", text: "Doei" },
      },
    };
    expect(validateScene(loop)).toContain("no end turn is reachable from the start");
  });
});
