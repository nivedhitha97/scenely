import { placesNl } from "@/scenes/nl/places";
import { BIKE_ROUTE, ROUTE_STOPS } from "../amsterdamMapData";
import { legBetween, legPath, pointAlong } from "../route";

describe("bike route", () => {
  it("has a stop for every place, at the place's position on the map", () => {
    for (const p of placesNl) {
      const i = ROUTE_STOPS[p.id];
      expect(i).toBeDefined();
      expect(BIKE_ROUTE[i]).toEqual(p.door);
    }
  });

  it("visits the places in unlock order", () => {
    const order = placesNl.map((p) => ROUTE_STOPS[p.id]);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("rides from one place to the next along the drawn route", () => {
    const leg = legBetween("koffiebar", "supermarkt")!;
    expect(leg.points[0]).toEqual({ x: 250, y: 330 });
    expect(leg.points[leg.points.length - 1]).toEqual({ x: 470, y: 335 });
    expect(leg.total).toBeGreaterThan(220); // longer than the straight line: it follows the curve
    expect(legPath(leg).startsWith("M250 330 L")).toBe(true);
  });

  it("can ride backwards", () => {
    const leg = legBetween("supermarkt", "koffiebar")!;
    expect(leg.points[0]).toEqual({ x: 470, y: 335 });
    expect(leg.points[leg.points.length - 1]).toEqual({ x: 250, y: 330 });
  });

  it("has no leg for unknown places or the same place", () => {
    expect(legBetween("koffiebar", "koffiebar")).toBeNull();
    expect(legBetween("koffiebar", "maan")).toBeNull();
  });

  it("finds points along a leg by distance", () => {
    const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 30 }];
    const lengths = [0, 10, 40];
    expect(pointAlong(points, lengths, 0)).toEqual({ x: 0, y: 0 });
    expect(pointAlong(points, lengths, 0.25)).toEqual({ x: 10, y: 0 });
    expect(pointAlong(points, lengths, 0.5)).toEqual({ x: 10, y: 10 });
    expect(pointAlong(points, lengths, 1)).toEqual({ x: 10, y: 30 });
    expect(pointAlong(points, lengths, 2)).toEqual({ x: 10, y: 30 });
  });

  it("stays put on a one-point route (standing still)", () => {
    expect(pointAlong([{ x: 5, y: 7 }], [0], 0.5)).toEqual({ x: 5, y: 7 });
  });
});
