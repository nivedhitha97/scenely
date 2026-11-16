import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { Icon } from "@/components/Icon";

/**
 * Helpers for illustrations drawn from simple shapes (absolutely positioned Views), the way the
 * Figma designs are built. Used by the map and the scene backdrops.
 */
export const r = (tl: number, tr = tl, br = tl, bl = tl): ViewStyle => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomRightRadius: br,
  borderBottomLeftRadius: bl,
});
export const rot = (deg: number): ViewStyle => ({ transform: [{ rotate: `${deg}deg` }] });
export const framed = (radius = 2, width = 2): ViewStyle => ({ ...r(radius), borderWidth: width, borderColor: "#FFFDF8" });

/** Collects absolutely positioned shapes. Each call adds one; `out` is the list to render. */
export class Canvas {
  out: ReactNode[] = [];
  private n = 0;
  box(x: number, y: number, w: number, h: number, c: string, extra: ViewStyle = {}, child?: ReactNode) {
    this.out.push(
      <View key={this.n++} style={[st.abs, { left: x, top: y, width: w, height: h, backgroundColor: c }, extra]}>
        {child}
      </View>,
    );
  }
  win(x: number, y: number) {
    this.box(x, y, 9, 12, "#D9E6E6", framed());
  }
  gable(x: number, y: number, w: number, h: number, col: string, kind: "step" | "neck" | "bell") {
    if (kind === "step") {
      this.box(x + 4, y - 9, w - 8, 9, col);
      this.box(x + 9, y - 17, w - 18, 8, col);
      this.box(x + w / 2 - 5, y - 24, 10, 7, col);
    } else if (kind === "neck") this.box(x + w * 0.2, y - 20, w * 0.6, 20, col, r(w * 0.3, w * 0.3, 0, 0));
    else this.box(x + 2, y - 13, w - 4, 13, col, r(w / 2, w / 2, 0, 0));
    this.box(x, y, w, h, col);
    for (let row = 0; row < Math.floor((h - 18) / 20); row++) {
      this.win(x + w / 2 - 12, y + 6 + row * 20);
      this.win(x + w / 2 + 2, y + 6 + row * 20);
    }
  }
  tree(x: number, y: number) {
    this.box(x + 9, y + 18, 4, 12, "#6B5B52");
    this.box(x, y, 22, 24, "#8FAE8B", r(12));
  }
  bike(x: number, y: number) {
    const wheel: ViewStyle = { ...r(6), borderWidth: 2, borderColor: "#3F4A48" };
    this.box(x, y, 12, 12, "transparent", wheel);
    this.box(x + 18, y, 12, 12, "transparent", wheel);
    this.box(x + 7, y + 3, 16, 2, "#3F4A48", rot(-18));
    this.box(x + 10, y - 3, 11, 2, "#3F4A48");
    this.box(x + 9, y - 6, 6, 3, "#3F4A48", r(2));
  }
  windmill(x: number, y: number) {
    this.box(x + 14, y + 20, 26, 46, "#6B4A3A", r(10, 10, 0, 0));
    this.box(x + 22, y + 46, 10, 20, "#3F3029", r(5, 5, 0, 0));
    this.box(x - 6, y + 22, 66, 6, "#EADBC4", { ...r(3), ...rot(35) });
    this.box(x - 6, y + 22, 66, 6, "#EADBC4", { ...r(3), ...rot(-55) });
    this.box(x + 23, y + 21, 8, 8, "#3F3029", r(4));
  }
  boat(x: number, y: number) {
    this.box(x, y + 6, 36, 9, "#C97B57", r(0, 0, 10, 10));
    this.box(x + 8, y, 18, 7, "#FBF2E6", r(3));
  }
  person(x: number, y: number, top: string, hair: string, skin = "#E8B996") {
    this.box(x + 3, y, 12, 12, skin, r(6));
    this.box(x + 2, y - 3, 14, 7, hair, r(7, 7, 2, 2));
    this.box(x, y + 11, 18, 18, top, r(8, 8, 3, 3));
  }
  sign(x: number, y: number, icon: string, colour = "#D97C42") {
    this.box(x, y, 24, 24, "#FFFDF8", { ...r(12), borderWidth: 2, borderColor: "#4A3A33", alignItems: "center", justifyContent: "center" }, <Icon name={icon} size={13} color={colour} strokeWidth={2.4} />);
  }
  stripes(x: number, y: number, w: number, a: string, c: string, n = 6) {
    for (let i = 0; i < n; i++) this.box(x + (i * w) / n, y, w / n, 10, i % 2 ? c : a, r(0, 0, 5, 5));
  }
  fields(x: number, y: number, w: number, h: number, cols: string[]) {
    cols.forEach((c, i) => this.box(x, y + (i * h) / cols.length, w, h / cols.length - 3, c, r(3)));
  }
  clock(x: number, y: number, size: number) {
    this.box(x, y, size, size, "#FFFDF8", r(size / 2), (
      <>
        <View style={[st.abs, { left: size / 2 - 1, top: 3, width: 2, height: size / 2 - 2, backgroundColor: "#293B3A" }]} />
        <View style={[st.abs, { left: size / 2 - 1, top: size / 2 - 1, width: size / 3, height: 2, backgroundColor: "#293B3A" }]} />
      </>
    ));
  }
}


const st = StyleSheet.create({
  abs: { position: "absolute" },
});
