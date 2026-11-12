import { koffiebarKlant as scene } from "@/scenes/nl/koffiebar-klant";
import { currentTurn, initialState, reducer, type PlayState } from "../reducer";

const start = (): PlayState => reducer(initialState(scene), { type: "START", scene });
const next = (s: PlayState) => reducer(s, { type: "NEXT", scene });
const choose = (s: PlayState, choiceId: string) => reducer(s, { type: "CHOOSE", scene, choiceId });

describe("reducer", () => {
  it("starts on the scene's start turn", () => {
    const s = start();
    expect(s.currentTurnId).toBe("t1");
    expect(s.status).toBe("playing");
    expect(s.attempts).toEqual({});
  });

  it("NEXT after an NPC line moves to the following turn", () => {
    const s = next(start());
    expect(s.currentTurnId).toBe("t2");
    expect(currentTurn(scene, s).kind).toBe("player");
  });

  it("a correct choice advances and enters feedback until NEXT", () => {
    const s = choose(next(start()), "koffie");
    expect(s.currentTurnId).toBe("t3");
    expect(s.status).toBe("feedback");
    expect(s.lastReaction).toEqual({ correct: true, reaction: "coffee", choiceId: "koffie" });
    expect(s.attempts).toEqual({ t2: 1 });

    const after = next(s);
    expect(after.status).toBe("playing");
    expect(after.currentTurnId).toBe("t3");
    expect(after.lastReaction).toBeUndefined();
  });

  it("an incorrect choice increments attempts and stays on the same turn", () => {
    const s1 = choose(next(start()), "bier");
    expect(s1.currentTurnId).toBe("t2");
    expect(s1.status).toBe("playing");
    expect(s1.attempts).toEqual({ t2: 1 });
    expect(s1.lastReaction).toEqual({ correct: false, reaction: "cross", choiceId: "bier" });

    const s2 = choose(s1, "brood");
    expect(s2.attempts).toEqual({ t2: 2 });

    const s3 = choose(s2, "koffie");
    expect(s3.currentTurnId).toBe("t3");
    expect(s3.attempts).toEqual({ t2: 3 });
  });

  it("accepts either correct answer when a turn has more than one", () => {
    const atT4 = next(next(choose(next(start()), "koffie")));
    expect(atT4.currentTurnId).toBe("t4");
    expect(choose(atT4, "melk").currentTurnId).toBe("t5");
    expect(choose(atT4, "zwart").currentTurnId).toBe("t5");
  });

  it("reaching the end turn sets status to done", () => {
    let s = start();
    s = next(s); // t1 -> t2
    s = next(choose(s, "koffie")); // t3
    s = next(s); // t4
    s = next(choose(s, "zwart")); // t5
    s = next(s); // t6
    s = choose(s, "pinnen"); // -> t7 (end), feedback
    expect(s.status).toBe("feedback");
    s = next(s);
    expect(s.currentTurnId).toBe("t7");
    expect(s.status).toBe("done");
  });

  it("ignores choices outside a player turn, unknown ids, and NEXT when done", () => {
    const atNpc = start();
    expect(choose(atNpc, "koffie")).toBe(atNpc);

    const atPlayer = next(atNpc);
    expect(choose(atPlayer, "nope")).toBe(atPlayer);
    expect(next(atPlayer)).toBe(atPlayer);

    const inFeedback = choose(atPlayer, "koffie");
    expect(choose(inFeedback, "koffie")).toBe(inFeedback);

    const done: PlayState = { ...atPlayer, currentTurnId: "t7", status: "done" };
    expect(next(done)).toBe(done);
  });

  it("restart resets state", () => {
    const played = choose(choose(next(start()), "bier"), "koffie");
    const s = reducer(played, { type: "RESTART", scene });
    expect(s).toEqual(initialState(scene));
    expect(s.attempts).toEqual({});
    expect(s.lastReaction).toBeUndefined();
  });

  it("does not mutate the previous state", () => {
    const before = next(start());
    const snapshot = JSON.parse(JSON.stringify(before));
    choose(before, "bier");
    expect(before).toEqual(snapshot);
  });
});
