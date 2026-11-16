import { StyleSheet, View, type ViewStyle } from "react-native";

import type { FigureLook } from "./looks";

const INK = "#293B3A";

const r = (tl: number, tr = tl, br = tl, bl = tl): ViewStyle => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomRightRadius: br,
  borderBottomLeftRadius: bl,
});
const b = (x: number, y: number, w: number, h: number, c: string, extra: ViewStyle = {}): ViewStyle => ({
  left: x,
  top: y,
  width: w,
  height: h,
  backgroundColor: c,
  ...extra,
});
const rot = (deg: number, origin?: string): ViewStyle => ({
  transform: [{ rotate: `${deg}deg` }],
  ...(origin ? { transformOrigin: origin } : null),
});
const ring = (color: string, width: number, extra: ViewStyle = {}): ViewStyle => ({
  borderColor: color,
  borderWidth: width,
  ...extra,
});

/** Builds the shapes of a full-body figure on a 120 × 270 grid (same drawing as the Figma line-up). */
function shapes(o: FigureLook, stride: boolean): ViewStyle[] {
  const { skin, hair, hairStyle, top, bottom, shoes = "#3F3029" } = o;
  const acc = new Set(o.acc ?? []);
  const s: ViewStyle[] = [];

  // legs or skirt
  if (acc.has("skirt")) {
    s.push(b(26, 150, 68, 84, bottom, r(10, 10, 30, 30)));
    if (acc.has("stripedApron")) for (let k = 0; k < 5; k++) s.push(b(40 + k * 9, 160, 5, 70, k % 2 ? "#FFFDF8" : "#C97B57", r(2)));
    s.push(b(42, 232, 12, 24, skin), b(66, 232, 12, 24, skin));
  } else if (stride) {
    s.push(b(38, 160, 18, 92, bottom, { ...r(6), ...rot(16, "top") }), b(64, 160, 18, 92, bottom, { ...r(6), ...rot(-16, "top") }));
  } else {
    s.push(b(38, 160, 18, 92, bottom, r(6)), b(64, 160, 18, 92, bottom, r(6)));
  }
  if (stride && !acc.has("skirt")) s.push(b(8, 238, 26, 12, shoes, r(6, 6, 3, 3)), b(86, 238, 26, 12, shoes, r(6, 6, 3, 3)));
  else s.push(b(32, 248, 26, 12, shoes, r(6, 6, 3, 3)), b(62, 248, 26, 12, shoes, r(6, 6, 3, 3)));

  // arms and hands
  const sleeve = acc.has("coat") ? "#FBFBF8" : top;
  s.push(b(14, 92, 18, 70, sleeve, { ...r(9), ...rot(6) }), b(88, 92, 18, 70, sleeve, { ...r(9), ...rot(-6) }));
  s.push(b(16, 156, 14, 14, skin, r(7)), b(90, 156, 14, 14, skin, r(7)));

  // torso and clothing details
  s.push(b(28, 84, 64, 82, top, r(26, 26, 6, 6)));
  if (acc.has("coat"))
    s.push(
      b(26, 84, 68, 120, "#FBFBF8", r(26, 26, 4, 4)),
      b(56, 92, 8, 110, "#E6E2DA"),
      b(30, 96, 22, 8, "#E6E2DA", rot(30)),
      b(68, 96, 22, 8, "#E6E2DA", rot(-30)),
      b(32, 130, 14, 12, "#E6E2DA", r(2)),
    );
  if (acc.has("scrubs")) s.push(b(46, 86, 28, 16, "#E8F0F4", r(0, 0, 14, 14)));
  if (acc.has("apron")) s.push(b(36, 104, 48, 100, "#3E5A64", r(6, 6, 2, 2)), b(40, 86, 3, 20, "#3E5A64"), b(77, 86, 3, 20, "#3E5A64"));
  if (acc.has("steth"))
    s.push(b(40, 88, 40, 40, "transparent", { ...ring("#4A5A60", 3, { borderTopWidth: 0 }), ...r(0, 0, 20, 20) }), b(56, 126, 9, 9, "#9AA8AD", r(5)));
  if (acc.has("scarf")) s.push(b(34, 78, 52, 14, "#F29B62", r(7)), b(66, 86, 12, 34, "#F29B62", r(4)));
  if (acc.has("tie")) s.push(b(56, 88, 8, 40, "#EACB78", r(2, 2, 4, 4)), b(44, 84, 32, 8, "#FBFBF8", r(0, 0, 8, 8)));
  if (acc.has("lanyard"))
    s.push(b(48, 86, 3, 34, "#3D8279"), b(69, 86, 3, 34, "#3D8279"), b(52, 118, 16, 20, "#FFFDF8", { ...r(2), ...ring("#3D8279", 2) }));
  if (acc.has("tape")) s.push(b(38, 84, 4, 60, "#EACB78"), b(78, 84, 4, 60, "#EACB78"));
  if (acc.has("backpack")) s.push(b(32, 88, 6, 44, "#C97B57", r(3)), b(82, 88, 6, 44, "#C97B57", r(3)));
  if (acc.has("whiteBlouse")) s.push(b(40, 86, 40, 26, "#FFFDF8", r(0, 0, 12, 12)));

  // neck and head
  s.push(b(52, 66, 16, 20, skin, { opacity: 0.93 }));
  s.push(b(34, 14, 52, 60, skin, r(26, 26, 24, 24)));

  // hair and hats
  if (hairStyle === "bun") s.push(b(48, -2, 24, 22, hair, r(12)), b(31, 8, 58, 26, hair, r(29, 29, 6, 6)));
  if (hairStyle === "short") s.push(b(31, 8, 58, 24, hair, r(29, 29, 8, 20)));
  if (hairStyle === "long") s.push(b(28, 8, 64, 30, hair, r(32, 32, 8, 8)), b(26, 26, 14, 56, hair, r(7)), b(80, 26, 14, 56, hair, r(7)));
  if (hairStyle === "curly")
    for (const [x, y] of [[30, 10], [44, 4], [60, 4], [74, 10], [28, 24], [80, 24]]) s.push(b(x, y, 18, 18, hair, r(9)));
  if (hairStyle === "cap")
    s.push(
      b(31, 10, 58, 22, hair, r(29, 29, 4, 4)),
      b(28, 10, 64, 16, "#2E3B5E", r(30, 30, 2, 2)),
      b(24, 22, 72, 6, "#2E3B5E", r(3)),
      b(54, 12, 12, 8, "#EACB78", r(2)),
    );
  if (hairStyle === "straw")
    s.push(
      b(31, 10, 58, 22, hair, r(29, 29, 6, 6)),
      b(16, 18, 88, 8, "#E8C25A", r(4)),
      b(36, 0, 48, 22, "#E8C25A", r(12, 12, 2, 2)),
      b(36, 14, 48, 5, "#C97B57"),
    );
  if (hairStyle === "volendam")
    s.push(
      b(30, 4, 60, 30, "#FFFDF8", { ...r(30, 30, 10, 10), ...ring("#E6E2DA", 2) }),
      b(14, 10, 22, 34, "#FFFDF8", { ...r(11, 5, 11, 11), ...ring("#E6E2DA", 2), ...rot(-18) }),
      b(84, 10, 22, 34, "#FFFDF8", { ...r(5, 11, 11, 11), ...ring("#E6E2DA", 2), ...rot(18) }),
      b(40, 26, 40, 8, hair, r(4)),
    );
  if (acc.has("glasses"))
    s.push(
      b(40, 38, 15, 12, "transparent", { ...ring("#4A3A33", 2), ...r(6) }),
      b(64, 38, 15, 12, "transparent", { ...ring("#4A3A33", 2), ...r(6) }),
      b(55, 43, 9, 2, "#4A3A33"),
    );

  // face
  s.push(b(45, 42, 5, 6, INK, r(3)), b(69, 42, 5, 6, INK, r(3)));
  s.push(b(38, 54, 9, 5, "#E79C8B", { ...r(3), opacity: 0.5 }), b(73, 54, 9, 5, "#E79C8B", { ...r(3), opacity: 0.5 }));
  s.push(b(51, 56, 18, 7, "transparent", { borderBottomWidth: 2, borderColor: "#7A4A3A", ...r(0, 0, 9, 9) }));

  // things in hand
  if (acc.has("cup")) s.push(b(94, 146, 18, 16, "#FFFDF8", { ...r(2, 2, 7, 7), ...ring("#E2D2BE", 2) }));
  if (acc.has("tote"))
    s.push(b(6, 150, 26, 30, "#EACB78", r(3)), b(12, 140, 14, 12, "transparent", { ...ring("#C9A548", 2, { borderBottomWidth: 0 }), ...r(7, 7, 0, 0) }));
  if (acc.has("cheese")) s.push(b(84, 140, 34, 22, "#E8B84A", r(12)), b(90, 146, 6, 5, "#D9A23A", r(3)));
  if (acc.has("clipboard")) s.push(b(88, 136, 22, 28, "#C9A07A", r(3)), b(91, 141, 16, 20, "#FFFDF8"));
  if (acc.has("tulips"))
    s.push(
      b(8, 128, 3, 30, "#6F9A6B"),
      b(14, 124, 3, 34, "#6F9A6B"),
      b(4, 120, 10, 12, "#E86A6A", r(3, 3, 6, 6)),
      b(12, 116, 10, 12, "#F0A04B", r(3, 3, 6, 6)),
    );
  return s;
}

/**
 * A full-body person drawn from simple shapes. At scale 1 it is 120 × 270.
 * `stride` draws the legs mid-step; alternate it to make the figure walk.
 */
export function Figure({ look, scale = 1, stride = false }: { look: FigureLook; scale?: number; stride?: boolean }) {
  return (
    <View
      style={{ width: 120 * scale, height: 270 * scale }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      <View style={[st.canvas, { transform: [{ scale }] }]}>
        {shapes(look, stride).map((style, i) => (
          <View key={i} style={[st.abs, style]} />
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  canvas: { width: 120, height: 270, transformOrigin: "top left" },
  abs: { position: "absolute" },
});
