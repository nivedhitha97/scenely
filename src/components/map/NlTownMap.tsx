import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Canvas, framed, r } from "@/components/shapes";
import type { PlaceStatus } from "@/engine/places";

/** Size of the map in map units. Places' `door` coordinates use the same grid. */
export const MAP_WIDTH = 900;
export const MAP_HEIGHT = 1180;

const W = {
  water: "#A9C7C9",
  land: "#EFE6D2",
  grass: "#C9D8B0",
  grass2: "#B8CC9C",
  road: "#F8F1E4",
  bike: "#C98B7C",
  brick: "#A65E46",
  ochre: "#C9974E",
  green: "#3F5F55",
  blue: "#5B7FA6",
  coral: "#F29B62",
  coralD: "#D97C42",
  glass: "#D9E6E6",
  frame: "#FFFDF8",
};

/** Front-facing buildings, drawn with their base centre at (cx, by). */
const BUILDINGS: Record<string, (c: Canvas, cx: number, by: number) => void> = {
  koffiebar(c, cx, by) {
    c.gable(cx - 48, by - 70, 32, 70, W.brick, "step");
    c.gable(cx - 16, by - 84, 40, 84, W.ochre, "neck");
    c.gable(cx + 24, by - 66, 28, 66, W.green, "bell");
    c.stripes(cx - 16, by - 32, 40, W.coral, W.frame);
    c.box(cx - 12, by - 20, 16, 20, W.glass, framed());
    c.box(cx + 8, by - 22, 12, 22, "#6B4A3A", r(6, 6, 0, 0));
    c.box(cx - 30, by - 4, 70, 6, "#D8C8B4");
    c.box(cx - 44, by - 14, 10, 10, W.frame, r(5));
    c.box(cx - 46, by - 4, 14, 2, "#9C714F");
    c.sign(cx + 22, by - 50, "coffee");
  },
  supermarkt(c, cx, by) {
    c.box(cx - 46, by - 58, 92, 58, "#B9CBB8", r(4, 4, 0, 0));
    c.box(cx - 50, by - 64, 100, 8, "#7FA08A", r(3));
    c.stripes(cx - 46, by - 40, 92, "#7FA08A", W.frame, 8);
    c.box(cx - 40, by - 26, 80, 26, W.glass, { borderWidth: 2, borderColor: W.frame });
    c.sign(cx - 12, by - 60, "basket", "#5E7F6A");
    c.box(cx + 34, by - 14, 16, 12, "#9C714F", r(2));
  },
  kleding(c, cx, by) {
    c.gable(cx - 24, by - 78, 48, 78, "#D98C7A", "bell");
    c.stripes(cx - 24, by - 38, 48, W.green, W.frame);
    c.box(cx - 20, by - 26, 26, 26, W.glass, { borderWidth: 2, borderColor: W.frame });
    c.box(cx - 12, by - 22, 10, 18, W.coral, r(5, 5, 2, 2));
    c.box(cx + 10, by - 26, 12, 26, "#6B4A3A", r(6, 6, 0, 0));
    c.sign(cx + 22, by - 58, "hanger", W.green);
  },
  huisarts(c, cx, by) {
    c.box(cx - 40, by - 50, 80, 50, "#EADBC4");
    c.box(cx - 46, by - 66, 92, 18, "#8C5A44", r(46, 46, 0, 0));
    c.win(cx - 32, by - 40);
    c.win(cx + 22, by - 40);
    c.box(cx - 8, by - 30, 16, 30, W.blue, r(8, 8, 0, 0));
    c.box(cx - 34, by - 22, 18, 18, W.blue, { ...r(4), alignItems: "center", justifyContent: "center" }, (
      <>
        <View style={{ position: "absolute", width: 10, height: 3, backgroundColor: "#fff" }} />
        <View style={{ position: "absolute", width: 3, height: 10, backgroundColor: "#fff" }} />
      </>
    ));
    c.box(cx + 26, by - 14, 10, 14, "#8FAE8B", r(5));
  },
  ziekenhuis(c, cx, by) {
    c.box(cx - 62, by - 76, 124, 76, "#E9E3D8", r(6, 6, 0, 0));
    c.box(cx - 20, by - 96, 40, 22, "#E9E3D8", r(4, 4, 0, 0));
    for (let row = 0; row < 3; row++) for (let col = 0; col < 6; col++) c.box(cx - 54 + col * 19, by - 68 + row * 18, 12, 10, "#C9DCE6", r(2));
    c.box(cx - 11, by - 94, 22, 18, W.blue, { ...r(4), alignItems: "center", justifyContent: "center" }, <Text style={st.h}>H</Text>);
    c.box(cx - 22, by - 16, 44, 16, W.glass, { borderWidth: 2, borderColor: W.frame });
    c.box(cx - 30, by - 20, 60, 5, W.blue, r(2));
  },
  school(c, cx, by) {
    c.box(cx - 56, by - 56, 112, 56, "#B5715A", r(4, 4, 0, 0));
    c.box(cx - 14, by - 82, 28, 28, "#B5715A");
    c.box(cx - 18, by - 94, 36, 14, W.green, r(18, 18, 0, 0));
    c.clock(cx - 8, by - 78, 16);
    for (let k = 0; k < 5; k++) c.box(cx - 50 + k * 22, by - 46, 14, 16, W.glass, framed());
    c.box(cx - 10, by - 24, 20, 24, "#6B4A3A", r(10, 10, 0, 0));
    c.bike(cx + 30, by - 10);
    c.bike(cx - 66, by - 10);
  },
  station(c, cx, by) {
    c.box(cx - 60, by - 60, 120, 60, "#9C5A44");
    c.box(cx - 14, by - 96, 28, 38, "#9C5A44", r(3, 3, 0, 0));
    c.box(cx - 9, by - 108, 18, 14, W.green, r(9, 9, 0, 0));
    c.clock(cx - 9, by - 90, 18);
    c.box(cx - 50, by - 46, 34, 46, W.glass, { ...r(17, 17, 0, 0), borderWidth: 3, borderColor: W.frame });
    c.box(cx + 16, by - 46, 34, 46, W.glass, { ...r(17, 17, 0, 0), borderWidth: 3, borderColor: W.frame });
  },
  markt(c, cx, by) {
    [-44, 0, 44].forEach((dx, i) => {
      c.box(cx + dx - 20, by - 34, 40, 34, "#E9DCCB");
      c.stripes(cx + dx - 22, by - 42, 44, [W.coral, "#7FA08A", "#EACB78"][i], W.frame, 4);
      c.box(cx + dx - 16, by - 14, 12, 10, "#E8B84A", r(6));
      c.box(cx + dx - 2, by - 14, 12, 10, "#E8B84A", r(6));
      c.box(cx + dx - 9, by - 22, 12, 10, "#D9A23A", r(6));
    });
    c.sign(cx - 12, by - 72, "cheese", "#B8862E");
  },
};

/** Sea, dunes, polders, tulip fields, canal rings, bike lanes and the train line. */
function drawLandscape(c: Canvas) {
  const cx = 470;
  const cy = 600;
  c.box(-200, -200, 420, 520, W.water, r(0, 0, 260, 0));
  c.box(150, -40, 160, 300, "#E9D9B4", { ...r(0, 0, 120, 0), opacity: 0.9 });
  c.box(190, 260, 90, 50, "#E9D9B4", r(25));
  for (let k = 0; k < 6; k++) c.box(20 + (k % 3) * 40, 40 + k * 40, 26, 3, "#fff", { ...r(2), opacity: 0.6 });
  c.boat(70, 180);
  // lighthouse on the dunes
  c.box(262, 40, 14, 50, "#FBF2E6", r(3, 3, 0, 0));
  c.box(262, 52, 14, 8, "#C97B57");
  c.box(262, 70, 14, 8, "#C97B57");
  c.box(259, 32, 20, 10, "#EACB78", r(4));
  // polder and tulip fields
  c.fields(30, 900, 300, 240, [W.grass, W.grass2, W.grass, W.grass2, W.grass]);
  c.box(30, 1010, 300, 4, W.water);
  c.box(30, 1074, 300, 4, W.water);
  c.fields(620, 920, 260, 220, ["#E86A6A", "#F0A04B", "#EACB78", "#E88BA8", "#E86A6A", "#C9D8B0"]);
  c.windmill(560, 960);
  c.windmill(140, 960);
  for (const [x, y] of [[90, 940], [210, 1100]]) {
    c.box(x, y, 26, 14, "#FBF7F0", r(6));
    c.box(x + 4, y + 2, 8, 6, "#3F3029", r(3));
    c.box(x + 22, y - 2, 9, 9, "#FBF7F0", r(4));
  }
  // canal rings (grachtengordel) and the river
  for (const rad of [300, 250, 200]) c.box(cx - rad, cy - rad, rad * 2, rad * 2, "transparent", { borderRadius: rad, borderWidth: 16, borderColor: W.water });
  c.box(cx - 14, cy + 280, 28, 520, W.water);
  c.box(cx - 14, -10, 28, 330, W.water);
  // roads with red bike lanes
  c.box(0, 800, MAP_WIDTH, 18, W.road);
  c.box(0, 808, MAP_WIDTH, 4, W.bike, { opacity: 0.7 });
  c.box(690, 0, 18, 820, W.road);
  c.box(697, 0, 4, 820, W.bike, { opacity: 0.7 });
  c.box(120, 380, 18, 440, W.road);
  c.box(127, 380, 4, 440, W.bike, { opacity: 0.7 });
  // train line
  c.box(560, 150, 340, 6, "#8C8F8A");
  for (let k = 0; k < 18; k++) c.box(566 + k * 19, 146, 4, 14, "#9C714F");
  // bridges over the canal rings
  for (const y of [cy - 300, cy - 250, cy - 200, cy + 184, cy + 234, cy + 284]) c.box(cx - 22, y, 44, 16, "#D8C8B4", { ...r(3), borderWidth: 2, borderColor: "#B98A66" });
  for (const [x, y] of [[270, 470], [640, 470], [300, 760], [610, 760], [380, 350], [540, 350], [760, 560], [180, 560], [820, 360], [60, 700]]) c.tree(x, y);
  c.boat(cx + 130, cy + 2);
  c.boat(cx - 170, cy - 40);
}

function drawPeople(c: Canvas) {
  const cx = 470;
  const cy = 600;
  c.person(cx + 44, cy + 20, "#7FA08A", "#3B2E2A");
  c.person(cx + 64, cy + 18, "#D98C7A", "#2E3440", "#B98263");
  c.bike(cx - 150, cy + 110);
  c.person(cx - 130, cy + 80, "#E8C25A", "#B07A4A");
  c.person(280, 670, "#FBF7F0", "#6B4A3A");
  c.person(170, 224, "#5B7FA6", "#3B2E2A");
  c.person(cx + 34, cy - 160, "#FBF7F0", "#E8C25A");
}

/**
 * The illustrated Netherlands map: scenery and buildings only. Labels, the avatar and the walk
 * route are drawn on top by the map screen, so they can be tapped and animated.
 * Locked and coming-soon places are drawn slightly faded.
 */
export const NlTownMap = memo(function NlTownMap({
  places,
}: {
  places: { id: string; door: { x: number; y: number }; status: PlaceStatus }[];
}) {
  const land = new Canvas();
  drawLandscape(land);
  return (
    <View style={st.map} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {land.out}
      {places.map((p) => {
        const draw = BUILDINGS[p.id];
        if (!draw) return null;
        const c = new Canvas();
        draw(c, p.door.x, p.door.y);
        const faded = p.status === "locked" || p.status === "soon";
        return (
          <View key={p.id} style={[StyleSheet.absoluteFill, faded && { opacity: 0.8 }]}>
            {c.out}
          </View>
        );
      })}
      {(() => {
        const c = new Canvas();
        drawPeople(c);
        return c.out;
      })()}
    </View>
  );
});

const st = StyleSheet.create({
  map: { width: MAP_WIDTH, height: MAP_HEIGHT, backgroundColor: W.land, overflow: "hidden" },
  abs: { position: "absolute" },
  h: { color: "#fff", fontSize: 13, fontWeight: "900" },
});
