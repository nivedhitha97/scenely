import { koffiebarKlant as scene } from "@/scenes/nl/koffiebar-klant";
import { initialState, reducer, type PlayState } from "../reducer";
import { completedPlayerTurns, playerTurnCount, promptFor } from "../selectors";

const act = (s: PlayState, a: "NEXT" | string) =>
  a === "NEXT" ? reducer(s, { type: "NEXT", scene }) : reducer(s, { type: "CHOOSE", scene, choiceId: a });

describe("selectors", () => {
  it("finds the NPC question that leads into a player turn", () => {
    expect(promptFor(scene, "t2")?.text).toBe("Goedemorgen! Wat wilt u drinken?");
    expect(promptFor(scene, "t4")?.text).toBe("Met melk of zwart?");
    expect(promptFor(scene, "t1")).toBeUndefined();
  });

  it("counts player turns", () => {
    expect(playerTurnCount(scene)).toBe(3);
  });

  it("counts a question as done only after a correct answer", () => {
    let s = act(initialState(scene), "NEXT"); // at t2
    expect(completedPlayerTurns(s)).toBe(0);
    s = act(s, "bier"); // wrong, still t2
    expect(completedPlayerTurns(s)).toBe(0);
    s = act(s, "koffie"); // right, moves on
    expect(completedPlayerTurns(s)).toBe(1);
  });
});
