import { airportHall, CAFE_STREET, CANAL_STREET, LANDING_GROUND, trainCar } from "../art";
import { INTRO_SHOTS, paint } from "../shots";
import { AVATAR_LOOKS } from "@/components/avatar/looks";

describe("intro story", () => {
  it("has five shots, from the landing to the koffiebar", () => {
    expect(INTRO_SHOTS.map((s) => s.id)).toEqual(["landing", "airport", "train", "bike", "cafe"]);
    expect(INTRO_SHOTS[1].line).toBe("Welkom in Nederland!");
  });

  it("has a line, a second line and a picture description for every shot", () => {
    for (const shot of INTRO_SHOTS) {
      expect(shot.line.length).toBeGreaterThan(0);
      expect(shot.sub.length).toBeGreaterThan(0);
      expect(shot.label.length).toBeGreaterThan(0);
    }
  });

  it("draws a field full of tulips", () => {
    expect((LANDING_GROUND.match(/scale\(/g) ?? []).length).toBeGreaterThan(300);
  });

  it("puts the learner's own colours in the train window", () => {
    const look = AVATAR_LOOKS[3];
    const car = trainCar(look);
    expect(car).toContain(look.skin);
    expect(car).toContain(look.hair);
    expect(car).toContain(look.top);
  });

  it("recolours the city for the time of day, and leaves a summer day alone", () => {
    expect(paint("t-canal", CANAL_STREET, { phase: "day", season: "summer" })).toBe(CANAL_STREET);
    const night = paint("t-canal", CANAL_STREET, { phase: "night", season: "summer" });
    expect(night).not.toBe(CANAL_STREET);
    expect(night).toContain("#172240"); // the night sky
    expect(paint("t-cafe", CAFE_STREET, { phase: "day", season: "winter" })).not.toBe(CAFE_STREET);
  });

  it("shows the sky through the airport windows", () => {
    expect(airportHall("#172240")).toContain('fill="#172240"');
  });
});
