import { dayPhase, greeting, isSouthernHemisphere, seasonOf, skyBody } from "../scenery";

const at = (h: number, m = 0, month = 6) => new Date(2026, month, 15, h, m);

describe("scenery", () => {
  it("names the part of the day from the local clock", () => {
    expect(dayPhase(at(5, 30))).toBe("dawn");
    expect(dayPhase(at(9))).toBe("morning");
    expect(dayPhase(at(14))).toBe("day");
    expect(dayPhase(at(18, 30))).toBe("evening");
    expect(dayPhase(at(21))).toBe("dusk");
    expect(dayPhase(at(23))).toBe("night");
    expect(dayPhase(at(2))).toBe("night");
  });

  it("follows the seasons, flipped south of the equator", () => {
    expect(seasonOf(new Date(2026, 0, 10), "Europe/Amsterdam")).toBe("winter");
    expect(seasonOf(new Date(2026, 3, 10), "Asia/Kolkata")).toBe("spring");
    expect(seasonOf(new Date(2026, 6, 10), "America/New_York")).toBe("summer");
    expect(seasonOf(new Date(2026, 9, 10), "Europe/Amsterdam")).toBe("autumn");
    expect(seasonOf(new Date(2026, 0, 10), "Australia/Sydney")).toBe("summer");
    expect(seasonOf(new Date(2026, 6, 10), "America/Sao_Paulo")).toBe("winter");
    expect(seasonOf(new Date(2026, 0, 10), undefined)).toBe("winter");
  });

  it("knows which time zones are in the southern hemisphere", () => {
    expect(isSouthernHemisphere("Australia/Perth")).toBe(true);
    expect(isSouthernHemisphere("America/Argentina/Cordoba")).toBe(true);
    expect(isSouthernHemisphere("Africa/Johannesburg")).toBe(true);
    expect(isSouthernHemisphere("Europe/Amsterdam")).toBe(false);
    expect(isSouthernHemisphere("Africa/Lagos")).toBe(false);
  });

  it("moves the sun by day and the moon by night", () => {
    expect(skyBody(at(6))).toEqual({ body: "sun", x: 0, height: 0 });
    const noon = skyBody(at(13, 30));
    expect(noon.body).toBe("sun");
    expect(noon.x).toBeCloseTo(0.5);
    expect(noon.height).toBeCloseTo(1);
    expect(skyBody(at(1, 30)).body).toBe("moon");
    expect(skyBody(at(1, 30)).x).toBeCloseTo(0.5);
  });

  it("greets in Dutch for the time of day", () => {
    expect(greeting(at(8))).toBe("Goedemorgen!");
    expect(greeting(at(15))).toBe("Goedemiddag!");
    expect(greeting(at(20))).toBe("Goedenavond!");
    expect(greeting(at(3))).toBe("Goedenacht!");
  });
});
