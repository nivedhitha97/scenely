import { memo } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { Canvas, r, rot } from "./shapes";

/** How the person behind the counter looks right now. */
export type Mood = "neutral" | "talk" | "listen" | "happy" | "puzzled";

/** The café illustration is drawn on a 350 × 290 grid and scaled to fit. */
export const CAFE_WIDTH = 350;
export const CAFE_HEIGHT = 290;

const LOOKS = {
  barista: { shirt: "#F3EEE6", hair: "#3B2E2A", skin: "#E8B996", nose: "#C59D80", apron: true, glasses: false },
  klant: { shirt: "#D98C7A", hair: "#2E3440", skin: "#B98263", nose: "#9D6F54", apron: false, glasses: true },
};

/** The other person in the scene, waist up, on a 120 × 190 grid. */
function drawPerson(c: Canvas, kind: "barista" | "klant", mood: Mood, gesture: boolean) {
  const o = LOOKS[kind];
  const ink = "#293B3A";
  const lip = "#7A4A3A";
  // arms
  c.box(4, 98, 20, 66, o.shirt, { ...r(10), ...rot(6) });
  c.box(6, 158, 16, 16, o.skin, r(8));
  if (gesture) {
    c.box(92, 64, 20, 52, o.shirt, { ...r(10), transform: [{ rotate: "28deg" }], transformOrigin: "bottom" });
    c.box(108, 56, 16, 16, o.skin, r(8));
  } else {
    c.box(96, 98, 20, 66, o.shirt, { ...r(10), ...rot(-6) });
    c.box(98, 158, 16, 16, o.skin, r(8));
  }
  // body
  c.box(14, 88, 92, 102, o.shirt, r(40, 40, 0, 0));
  if (o.apron) {
    c.box(34, 110, 52, 80, "#3E5A64", r(8, 8, 0, 0));
    c.box(38, 92, 3, 20, "#3E5A64");
    c.box(79, 92, 3, 20, "#3E5A64");
  }
  c.box(50, 72, 20, 22, o.nose);
  c.box(46, 88, 28, 10, o.apron ? "#fff" : o.shirt, r(0, 0, 14, 14));
  c.box(32, 12, 56, 66, o.skin, r(28, 28, 26, 26));
  // hair
  if (kind === "barista") {
    c.box(24, 4, 72, 36, o.hair, r(36, 36, 8, 26));
    c.box(84, 22, 22, 40, o.hair, { ...r(12), ...rot(-12) });
  } else {
    c.box(44, -12, 30, 28, o.hair, r(15));
    c.box(24, 4, 72, 34, o.hair, r(36, 36, 26, 8));
  }
  // brows
  if (mood === "puzzled") {
    c.box(43, 37, 11, 2, o.hair, rot(8));
    c.box(66, 34, 11, 2, o.hair, rot(-16));
  } else {
    c.box(43, 38, 11, 2, o.hair, r(1));
    c.box(66, 38, 11, 2, o.hair, r(1));
  }
  // eyes
  if (mood === "happy") {
    const arc: ViewStyle = { borderTopWidth: 2, borderColor: ink, ...r(6, 6, 0, 0) };
    c.box(44, 46, 8, 4, "transparent", arc);
    c.box(66, 46, 8, 4, "transparent", arc);
  } else {
    c.box(46, 45, 5, 6, ink, r(3));
    c.box(68, 45, 5, 6, ink, r(3));
  }
  if (o.glasses) {
    const lens: ViewStyle = { borderWidth: 2, borderColor: "#4A3A33", ...r(8) };
    c.box(40, 40, 16, 14, "transparent", lens);
    c.box(63, 40, 16, 14, "transparent", lens);
    c.box(56, 46, 7, 2, "#4A3A33");
  }
  c.box(57, 52, 6, 6, o.nose, r(3));
  c.box(38, 58, 10, 6, "#E79C8B", { ...r(3), opacity: 0.5 });
  c.box(72, 58, 10, 6, "#E79C8B", { ...r(3), opacity: 0.5 });
  // mouth
  const smile: ViewStyle = { borderBottomWidth: 2, borderColor: lip, ...r(0, 0, 8, 8) };
  if (mood === "talk") c.box(54, 61, 12, 9, lip, r(6));
  else if (mood === "happy") c.box(50, 60, 20, 10, lip, r(0, 0, 10, 10));
  else if (mood === "puzzled") c.box(55, 65, 10, 3, lip, r(2));
  else if (mood === "listen") c.box(53, 62, 14, 5, "transparent", smile);
  else c.box(52, 62, 16, 6, "transparent", smile);
}

function tulip(c: Canvas, x: number, y: number, colour: string) {
  c.box(x + 3, y + 8, 2, 16, "#6F9A6B");
  c.box(x, y, 8, 10, colour, r(2, 2, 5, 5));
}

function drawCafe(c: Canvas) {
  // warm light
  c.box(-40, -60, 200, 200, "rgba(234,203,120,0.16)", r(100));
  // arched window onto a canal street
  c.box(18, 14, 92, 86, "#CFE0EA", { ...r(46, 46, 4, 4), borderWidth: 5, borderColor: "#FBF2E6", overflow: "hidden" }, (
    <>
      {([["#A65E46", 18, 34], ["#C9974E", 16, 40], ["#3F5F55", 18, 30], ["#EADBC4", 16, 38]] as const).map(([col, w, h], i) => (
        <View key={i} style={[st.abs, { left: 4 + i * 21, bottom: 14, width: w, height: h, backgroundColor: col }, i % 2 ? r(8, 8, 0, 0) : null]} />
      ))}
      <View style={[st.abs, { left: 0, right: 0, bottom: 0, height: 14, backgroundColor: "#9FBFC4" }]} />
    </>
  ));
  // lamp
  c.box(150, 0, 2, 30, "#6B5B52");
  c.box(136, 28, 30, 14, "#EACB78", r(15, 15, 3, 3));
  // shelves with jars, a Delft plate and cups
  c.box(192, 60, 144, 6, "#9C714F", r(3));
  ["#8C5A3C", "#B07A4A", "#6F4A36", "#C99A64", "#A76F45"].forEach((col, i) => c.box(200 + i * 22, 40, 14, 20, col, r(3, 3, 2, 2)));
  c.box(312, 34, 26, 26, "#FBFAF6", { ...r(13), borderWidth: 2, borderColor: "#4F6FA8" }, (
    <View style={[st.abs, { left: 4, top: 4, width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: "#4F6FA8" }]} />
  ));
  c.box(192, 98, 144, 6, "#9C714F", r(3));
  for (let i = 0; i < 5; i++) c.box(204 + i * 26, 86, 14, 12, "#FFFDF8", r(2, 2, 6, 6));
  // Delft blue tiles behind the counter
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 18; col++)
      c.box(col * 20, 174 + row * 20, 20, 20, "#FBFAF6", { borderWidth: 1, borderColor: "#C9D6E3" }, (
        <View style={[st.abs, { left: 3, top: 3, width: 8, height: 8, borderRadius: 5, borderWidth: 2, borderColor: "#4F6FA8" }]} />
      ));
  // pastry case: stroopwafels, appeltaart, tompouce
  c.box(14, 108, 90, 108, "rgba(255,253,248,0.85)", { ...r(6), borderWidth: 4, borderColor: "#B98A66" }, (
    <>
      {[34, 70].map((y) => <View key={y} style={[st.abs, { left: 0, right: 0, top: y, height: 3, backgroundColor: "#B98A66" }]} />)}
      {[[22, "#B9824D"], [15, "#C9925A"], [8, "#B9824D"]].map(([y, col]) => (
        <View key={y} style={[st.abs, { left: 8, top: y as number, width: 28, height: 7, borderRadius: 4, backgroundColor: col as string }]} />
      ))}
      <View style={[st.abs, { left: 44, top: 12, width: 30, height: 18, backgroundColor: "#D9A066", ...r(15, 15, 2, 2) }]} />
      {[8, 36].map((x) => (
        <View key={x}>
          <View style={[st.abs, { left: x, top: 50, width: 22, height: 8, backgroundColor: "#F2A7B8", borderRadius: 2 }]} />
          <View style={[st.abs, { left: x, top: 58, width: 22, height: 9, backgroundColor: "#F3DFA6" }]} />
        </View>
      ))}
      <View style={[st.abs, { left: 10, top: 86, width: 26, height: 8, borderRadius: 4, backgroundColor: "#C9925A" }]} />
      <View style={[st.abs, { left: 42, top: 84, width: 28, height: 10, borderRadius: 5, backgroundColor: "#B9824D" }]} />
    </>
  ));
}

function drawCounter(c: Canvas, opts: { cup: boolean; sparkle: boolean }) {
  c.box(-4, 214, CAFE_WIDTH + 8, 10, "#C99A74", r(4));
  c.box(0, 224, CAFE_WIDTH, 66, "#FBF4EA");
  c.box(0, 280, CAFE_WIDTH, 10, "#E9DCCB");
  // espresso machine
  c.box(236, 172, 72, 42, "#8C9A98", r(7));
  c.box(244, 162, 56, 12, "#76847F", r(4, 4, 0, 0));
  c.box(254, 196, 12, 12, "#FFFDF8", r(2, 2, 5, 5));
  c.box(278, 196, 12, 12, "#FFFDF8", r(2, 2, 5, 5));
  // tulips in a glass
  tulip(c, 196, 180, "#D9534F");
  tulip(c, 204, 176, "#F0A04B");
  tulip(c, 212, 181, "#EACB78");
  c.box(198, 194, 22, 20, "rgba(207,224,234,0.8)", { ...r(3, 3, 8, 8), borderWidth: 2, borderColor: "#FFFDF8" });
  // bar stools
  for (const x of [150, 270]) {
    c.box(x, 246, 44, 9, "#D9A55A", r(5));
    c.box(x + 6, 254, 4, 36, "#9C714F");
    c.box(x + 34, 254, 4, 36, "#9C714F");
  }
  if (opts.cup) {
    c.box(100, 192, 24, 22, "#FFFDF8", { ...r(3, 3, 10, 10), borderWidth: 2, borderColor: "#E2D2BE" });
    c.box(96, 210, 32, 5, "#E2D2BE", r(3));
    c.box(104, 174, 3, 12, "#D9C7B2", { ...r(2), ...rot(-10) });
    c.box(114, 170, 3, 14, "#D9C7B2", { ...r(2), ...rot(8) });
  }
  if (opts.sparkle) {
    c.box(84, 168, 8, 8, "#EACB78", r(4));
    c.box(134, 160, 6, 6, "#EACB78", r(3));
    c.box(136, 190, 5, 5, "#EACB78", r(3));
  }
}

/**
 * A Dutch café seen from the customer's side: arched window onto a canal, Delft tiles,
 * pastry case, tulips, and the other person behind the counter. Same drawing as the v7 Figma
 * screens. `width` scales the whole picture.
 */
export const CafeScene = memo(function CafeScene({
  width,
  height = CAFE_HEIGHT * (width / CAFE_WIDTH),
  cropTop,
  person,
  mood,
  gesture = false,
  tilt = 0,
}: {
  width: number;
  /** Visible height; the picture is cropped from the top when this is shorter. */
  height?: number;
  /** How far down the picture starts, in screen points (default: show the bottom, the counter). */
  cropTop?: number;
  person: "barista" | "klant";
  mood: Mood;
  gesture?: boolean;
  tilt?: number;
}) {
  const scale = width / CAFE_WIDTH;
  const happy = mood === "happy";
  const room = new Canvas();
  drawCafe(room);
  const someone = new Canvas();
  drawPerson(someone, person, mood, gesture);
  const counter = new Canvas();
  drawCounter(counter, { cup: happy, sparkle: happy });
  const top = cropTop !== undefined ? -cropTop : height - CAFE_HEIGHT * scale;
  return (
    <View style={{ width, height, overflow: "hidden", backgroundColor: "#F4E6D6" }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none">
      <View style={[st.canvas, { top, transform: [{ scale }] }]}>
        {room.out}
        <View style={[st.person, { transform: [{ rotate: `${tilt}deg` }] }]}>{someone.out}</View>
        {counter.out}
      </View>
    </View>
  );
});

const st = StyleSheet.create({
  canvas: { position: "absolute", left: 0, width: CAFE_WIDTH, height: CAFE_HEIGHT, transformOrigin: "top left" },
  person: { position: "absolute", left: 118, top: 42, width: 120, height: 190, transformOrigin: "bottom" },
  abs: { position: "absolute" },
});
