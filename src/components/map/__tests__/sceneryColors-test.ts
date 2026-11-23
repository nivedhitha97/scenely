import { AMSTERDAM_XML } from "../amsterdamMapData";
import { applyScenery, sceneryColour } from "../sceneryColors";

describe("map colours for time and season", () => {
  it("leaves a summer day exactly as drawn", () => {
    expect(applyScenery(AMSTERDAM_XML, { phase: "day", season: "summer" })).toBe(AMSTERDAM_XML);
    expect(sceneryColour("#7DAE48", { phase: "day", season: "summer" })).toBe("#7DAE48");
  });

  it("turns leaves orange in autumn and white in winter", () => {
    expect(sceneryColour("#7DAE48", { phase: "day", season: "autumn" })).toBe("#D98A3D");
    expect(sceneryColour("#8DBD55", { phase: "day", season: "winter" })).toBe("#EEF3F5");
    expect(sceneryColour("#6CB2DC", { phase: "day", season: "winter" })).toBe("#A9D0E2");
  });

  it("darkens the town at night but lights the windows and lamps", () => {
    const night = { phase: "night", season: "summer" } as const;
    expect(sceneryColour("#CFE6F0", night)).toBe("#172240");
    expect(sceneryColour("#FBF4E8", night)).toBe("#FFD873");
    expect(sceneryColour("#F6D776", night)).toBe("#FFD873");
    const roof = sceneryColour("#A65E46", night);
    const brightness = (c: string) => parseInt(c.slice(1, 3), 16) + parseInt(c.slice(3, 5), 16) + parseInt(c.slice(5, 7), 16);
    expect(brightness(roof)).toBeLessThan(brightness("#A65E46"));
  });

  it("colours the evening sky warm", () => {
    expect(sceneryColour("#CFE6F0", { phase: "evening", season: "summer" })).toBe("#F7C59F");
  });

  it("rewrites every colour in the drawing and keeps the SVG intact", () => {
    const out = applyScenery(AMSTERDAM_XML, { phase: "night", season: "winter" });
    expect(out.length).toBeGreaterThan(AMSTERDAM_XML.length * 0.95);
    expect(out).toContain("#172240");
    expect(out.startsWith("<svg")).toBe(true);
    expect(applyScenery(AMSTERDAM_XML, { phase: "night", season: "winter" })).toBe(out); // cached
  });
});
