import { BIKE_ROUTE, ROUTE_STOPS, type MapPoint } from "./amsterdamMapData";

export type Point = MapPoint;

/** A stretch of the bike route, ready to animate along: its points and the distance to each. */
export type Leg = { points: Point[]; lengths: number[]; total: number };

/** Where the parked bike stands at a place: just past its stop on the route. */
export function standPoint(door: Point): Point {
  return { x: door.x + 34, y: door.y + 8 };
}

/** The bike route from one place to another (either direction), following the drawn fietspad. */
export function legBetween(fromId: string, toId: string): Leg | null {
  const a = ROUTE_STOPS[fromId];
  const b = ROUTE_STOPS[toId];
  if (a === undefined || b === undefined || a === b) return null;
  const points = a < b ? BIKE_ROUTE.slice(a, b + 1) : BIKE_ROUTE.slice(b, a + 1).reverse();
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return { points, lengths, total: lengths[lengths.length - 1] };
}

/** The point a fraction t (0 to 1) of the way along a leg. Runs on the UI thread during the ride. */
export function pointAlong(points: Point[], lengths: number[], t: number): Point {
  "worklet";
  const n = points.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { x: points[0].x, y: points[0].y };
  const target = Math.max(0, Math.min(1, t)) * lengths[n - 1];
  let i = 1;
  while (i < n - 1 && lengths[i] < target) i++;
  const span = lengths[i] - lengths[i - 1] || 1;
  const f = (target - lengths[i - 1]) / span;
  return { x: points[i - 1].x + (points[i].x - points[i - 1].x) * f, y: points[i - 1].y + (points[i].y - points[i - 1].y) * f };
}

/** SVG path through a leg's points, for highlighting the stretch being ridden. */
export function legPath(leg: Leg): string {
  return leg.points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}
