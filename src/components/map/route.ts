type Point = { x: number; y: number };

/** Where the avatar's feet stand at a place: just left of the door. */
export function standPoint(door: Point): Point {
  return { x: door.x - 84, y: door.y + 4 };
}

/** Control point of the curved walking route between two places (bends to one side of the straight line). */
export function routeControl(a: Point, b: Point): Point {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return { x: mx - dy * 0.35, y: my + dx * 0.35 };
}

/** A point along the quadratic route at t (0 to 1). Runs on the UI thread during the walk. */
export function pointOnRoute(a: Point, c: Point, b: Point, t: number): Point {
  "worklet";
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

/** SVG path for the dotted route line. */
export function routePath(a: Point, b: Point): string {
  const c = routeControl(a, b);
  return `M${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
}
