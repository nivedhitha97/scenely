import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Figure } from "@/components/avatar/Figure";
import type { FigureLook } from "@/components/avatar/looks";
import { useTheme } from "@/themes";
import { CYCLIST_H, CYCLIST_W, Cyclist, ParkedBike } from "./Cyclist";
import { shadow } from "./palette";
import { pointAlong, standPoint, type Leg, type Point } from "./route";

const PEDAL_MS = 220;
/** Riding speed in map pixels per second; a ride takes between 2.5 and 6 seconds. */
const SPEED = 150;
const FIGURE_SCALE = 0.25;

export function rideDuration(leg: Leg): number {
  return Math.round(Math.min(6000, Math.max(2500, (leg.total / SPEED) * 1000)));
}

/**
 * The learner on the map. Standing next to their parked bike at `at`, or, when `leg` is given,
 * cycling once along that stretch of the bike route (pedalling, turning to face the way they
 * ride) and then calling onArrive. Give it a new key for each ride; it rides once, on mount.
 */
export function CyclingAvatar({
  look,
  at,
  leg,
  instant = false,
  onArrive,
}: {
  look: FigureLook;
  at: Point;
  leg?: Leg | null;
  /** Skip the ride (reduce motion): arrive at once. */
  instant?: boolean;
  onArrive?: () => void;
}) {
  const t = useTheme();
  const progress = useSharedValue(0);
  const [riding, setRiding] = useState(!!leg && !instant);
  const [pedal, setPedal] = useState(false);
  const points = useMemo(() => leg?.points ?? [at], [leg, at]);
  const lengths = useMemo(() => leg?.lengths ?? [0], [leg]);

  useEffect(() => {
    if (!leg) return;
    const done = () => {
      setRiding(false);
      onArrive?.();
    };
    progress.value = withTiming(1, { duration: instant ? 0 : rideDuration(leg), easing: Easing.inOut(Easing.quad) }, (finished) => {
      if (finished) runOnJS(done)();
    });
    // onArrive is read when the ride ends; restarting the ride on a new callback is not wanted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leg, instant, progress]);

  useEffect(() => {
    if (!riding) return;
    const id = setInterval(() => setPedal((x) => !x), PEDAL_MS);
    return () => clearInterval(id);
  }, [riding]);

  const rideStyle = useAnimatedStyle(() => {
    const p = pointAlong(points, lengths, progress.value);
    const ahead = pointAlong(points, lengths, Math.min(1, progress.value + 0.02));
    const left = ahead.x < p.x - 0.01;
    return { transform: [{ translateX: p.x - CYCLIST_W / 2 }, { translateY: p.y - CYCLIST_H + 6 }, { scaleX: left ? -1 : 1 }] };
  });

  if (riding) {
    return (
      <Animated.View style={[s.rider, rideStyle]} pointerEvents="none">
        <Cyclist look={look} pedal={pedal} />
      </Animated.View>
    );
  }

  const stand = leg ? standPoint(leg.points[leg.points.length - 1]) : standPoint(at);
  return (
    <View style={[s.parked, { left: stand.x - CYCLIST_W / 2, top: stand.y - CYCLIST_H + 6 }]} pointerEvents="none">
      <ParkedBike />
      <View style={s.person}>
        <View style={[s.tag, shadow]}>
          <Text style={[s.tagText, { fontFamily: t.fonts.bodyBold }]}>Jij</Text>
        </View>
        <Figure look={look} scale={FIGURE_SCALE} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  rider: { position: "absolute", left: 0, top: 0, width: CYCLIST_W, height: CYCLIST_H },
  parked: { position: "absolute", width: CYCLIST_W + 40, height: CYCLIST_H },
  person: { position: "absolute", left: CYCLIST_W - 8, bottom: 4, alignItems: "center" },
  tag: { position: "absolute", top: -24, height: 22, paddingHorizontal: 8, borderRadius: 11, backgroundColor: "#2E2A26", justifyContent: "center", zIndex: 1 },
  tagText: { fontSize: 11, color: "#FFF8EF" },
});
