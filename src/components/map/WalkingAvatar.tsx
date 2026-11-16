import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Figure } from "@/components/avatar/Figure";
import type { FigureLook } from "@/components/avatar/looks";
import { useTheme } from "@/themes";
import { shadow } from "./palette";
import { pointOnRoute, routeControl, standPoint } from "./route";

const SCALE = 0.42;
const FIG_W = 120 * SCALE;
const FIG_H = 270 * SCALE;
export const WALK_MS = 2600;
const STEP_MS = 180;

type Point = { x: number; y: number };

/**
 * The learner's avatar on the map, with a "Jij" tag while walking. Standing still at `from`, or, when `to`
 * is given, walking once along the curved route to it (legs swap every step) and then calling onArrive.
 */
export function WalkingAvatar({
  look,
  from,
  to,
  instant = false,
  onArrive,
}: {
  look: FigureLook;
  from: Point;
  to?: Point;
  /** Skip the walk (reduce motion): jump straight to `to`. */
  instant?: boolean;
  onArrive?: () => void;
}) {
  const t = useTheme();
  const a = useMemo(() => standPoint(from), [from]);
  const b = useMemo(() => (to ? standPoint(to) : null), [to]);
  const c = useMemo(() => (b ? routeControl(a, b) : a), [a, b]);
  const progress = useSharedValue(0);
  // Give this component a new key for each walk; it walks once, on mount.
  const [walking, setWalking] = useState(!!b && !instant);
  const [stride, setStride] = useState(false);

  useEffect(() => {
    if (!b) return;
    const done = () => {
      setWalking(false);
      onArrive?.();
    };
    progress.value = withTiming(1, { duration: instant ? 0 : WALK_MS, easing: Easing.inOut(Easing.quad) }, (finished) => {
      if (finished) runOnJS(done)();
    });
    // onArrive is read when the walk ends; restarting the walk on a new callback is not wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, instant, progress]);

  useEffect(() => {
    if (!walking) return;
    const id = setInterval(() => setStride((x) => !x), STEP_MS);
    return () => clearInterval(id);
  }, [walking]);

  const style = useAnimatedStyle(() => {
    const p = b ? pointOnRoute(a, c, b, progress.value) : a;
    return { transform: [{ translateX: p.x - FIG_W / 2 }, { translateY: p.y - FIG_H }] };
  });

  return (
    <Animated.View style={[s.wrap, style]} pointerEvents="none">
      {walking && (
        <View style={[s.tag, shadow]}>
          <Text style={[s.tagText, { fontFamily: t.fonts.bodyBold }]}>Jij</Text>
        </View>
      )}
      <Figure look={look} scale={SCALE} stride={walking && stride} />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: { position: "absolute", left: 0, top: 0, width: FIG_W, height: FIG_H, alignItems: "center" },
  tag: { position: "absolute", top: -30, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: "#fff", justifyContent: "center", zIndex: 1 },
  tagText: { fontSize: 12, color: "#293B3A" },
});
