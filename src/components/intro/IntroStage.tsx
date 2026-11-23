import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";

import { Figure } from "@/components/avatar/Figure";
import type { FigureLook } from "@/components/avatar/looks";
import { Cyclist, CYCLIST_H, CYCLIST_W, ParkedBike } from "@/components/map/Cyclist";
import { sceneryColour } from "@/components/map/sceneryColors";
import type { Scenery } from "@/engine/scenery";

import {
  AIRPORT_SIGN,
  airportHall,
  CAFE_STREET,
  CANAL_BOAT,
  CANAL_STREET,
  LANDING_GROUND,
  LANDING_PLANE,
  LANDING_SAILS,
  LANDING_SKY,
  SAILS_HUB,
  SIGN_PIVOT,
  SUITCASE,
  TRAIN_BRIDGE,
  TRAIN_HOUSES,
  TRAIN_HOUSES_WIDTH,
  TRAIN_SKY,
  trainCar,
} from "./art";
import { paint, type IntroShotId } from "./shots";

/** The drawings are made on a 390 × 600 stage, scaled to fill the space above the text card. */
export const STAGE_W = 390;
export const STAGE_H = 600;

/** 0 → 1 once, eased; already 1 with reduce motion on. */
function useTween(duration: number, delay = 0): SharedValue<number> {
  const reduce = useReducedMotion();
  const p = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) return;
    p.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
  }, [p, reduce, duration, delay]);
  return p;
}

/** 0 → 1 over and over (or back and forth); stays 0 with reduce motion on. */
function useLoop(duration: number, backAndForth = false): SharedValue<number> {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (reduce) return;
    p.value = withRepeat(
      withTiming(1, { duration, easing: backAndForth ? Easing.inOut(Easing.sin) : Easing.linear }),
      -1,
      backAndForth,
    );
  }, [p, reduce, duration, backAndForth]);
  return p;
}

/** Flips true/false every `every` ms (legs walking, pedals turning), for `forMs` or for ever. */
function useFlip(every: number, forMs: number | null): boolean {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setOn((v) => !v), every);
    const stop = forMs === null ? undefined : setTimeout(() => {
      clearInterval(id);
      setOn(false);
    }, forMs);
    return () => {
      clearInterval(id);
      if (stop) clearTimeout(stop);
    };
  }, [reduce, every, forMs]);
  return on;
}

/** One drawing layer covering the stage (or wider, for parallax). */
function Layer({ xml, style, width = STAGE_W }: { xml: string; style?: React.ComponentProps<typeof Animated.View>["style"]; width?: number }) {
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, top: 0, width, height: STAGE_H }, style]}>
      <SvgXml xml={xml} width={width} height={STAGE_H} />
    </Animated.View>
  );
}

/** Places a drawing so its ground point lands on (x, y) of the stage, at `scale`. */
function Grounded({
  x,
  y,
  w,
  h,
  groundX,
  groundY,
  scale,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  groundX: number;
  groundY: number;
  scale: number;
  style?: ReturnType<typeof useAnimatedStyle>;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: "absolute", left: x - groundX * scale, top: y - groundY * scale, width: w * scale, height: h * scale }, style]}
    >
      <View style={{ width: w, height: h, transform: [{ scale }], transformOrigin: "top left" }}>{children}</View>
    </Animated.View>
  );
}

/* ---------- the five shots ---------- */

function Landing({ scenery }: { scenery: Scenery }) {
  // The bulb fields are always in bloom: the landing is set in spring, at the phone's time of day.
  const spring = useMemo<Scenery>(() => ({ phase: scenery.phase, season: "spring" }), [scenery.phase]);
  const fly = useTween(4200);
  const sails = useLoop(9000);
  const plane = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - fly.value) * -260 }, { translateY: (1 - fly.value) * -150 }],
  }));
  const turn = useAnimatedStyle(() => ({ transform: [{ rotate: `${22 + sails.value * 360}deg` }] }));
  const size = SAILS_HUB.size;
  return (
    <>
      <Layer xml={paint("landing-sky", LANDING_SKY, spring)} />
      <Layer xml={paint("landing-plane", LANDING_PLANE, spring)} style={plane} />
      <Layer xml={paint("landing-ground", LANDING_GROUND, spring)} />
      <Animated.View style={[{ position: "absolute", left: SAILS_HUB.x - size / 2, top: SAILS_HUB.y - size / 2, width: size, height: size }, turn]}>
        <SvgXml xml={paint("landing-sails", LANDING_SAILS, spring)} width={size} height={size} />
      </Animated.View>
    </>
  );
}

function Airport({ look, scenery }: { look: FigureLook; scenery: Scenery }) {
  const hall = useMemo(() => airportHall(sceneryColour("#CFE6F0", scenery)), [scenery]);
  const swing = useTween(1400, 200);
  const walk = useTween(2800, 300);
  const stride = useFlip(260, 3100);
  const sign = useAnimatedStyle(() => ({
    opacity: swing.value,
    transform: [{ rotate: `${(1 - swing.value) * -8}deg` }],
  }));
  const walker = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - walk.value) * -240 }] }));
  const scale = 0.55;
  return (
    <>
      <Layer xml={hall} />
      <Layer xml={AIRPORT_SIGN} style={[{ transformOrigin: [SIGN_PIVOT.x, SIGN_PIVOT.y, 0] }, sign]} />
      <Animated.View pointerEvents="none" style={[s.abs, { left: 142, top: 556 - 270 * scale, width: 90, height: 270 * scale }, walker]}>
        <Figure look={look} scale={scale} stride={stride} />
        <View style={[s.abs, { left: 54, top: 270 * scale - 34 }]}>
          <SvgXml xml={SUITCASE} width={26} height={34} />
        </View>
      </Animated.View>
    </>
  );
}

function Train({ look, scenery }: { look: FigureLook; scenery: Scenery }) {
  const arrive = useTween(3200);
  const drift = useTween(6500);
  const houses = useAnimatedStyle(() => ({ transform: [{ translateX: drift.value * -40 }] }));
  const train = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - arrive.value) * 440 }] }));
  const lookKey = `${look.skin}${look.hair}${look.hairStyle}${look.top}`;
  return (
    <>
      <Layer xml={paint("train-sky", TRAIN_SKY, scenery)} />
      <Layer xml={paint("train-houses", TRAIN_HOUSES, scenery)} width={TRAIN_HOUSES_WIDTH} style={houses} />
      <Layer xml={paint("train-bridge", TRAIN_BRIDGE, scenery)} />
      <Layer xml={paint(`train-car/${lookKey}`, trainCar(look), scenery)} style={train} />
    </>
  );
}

function Bike({ look, scenery }: { look: FigureLook; scenery: Scenery }) {
  const ride = useTween(3400);
  const boat = useLoop(7000, true);
  const pedal = useFlip(180, null);
  const rider = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - ride.value) * -330 }] }));
  const drift = useAnimatedStyle(() => ({ transform: [{ translateX: boat.value * -50 }] }));
  return (
    <>
      <Layer xml={paint("canal-street", CANAL_STREET, scenery)} />
      <Layer xml={paint("canal-boat", CANAL_BOAT, scenery)} style={drift} />
      <Grounded x={200} y={430} w={CYCLIST_W} h={CYCLIST_H} groundX={34} groundY={84} scale={2.3} style={rider}>
        <Cyclist look={look} pedal={pedal} />
      </Grounded>
    </>
  );
}

function Cafe({ look, scenery }: { look: FigureLook; scenery: Scenery }) {
  const walk = useTween(2400, 600);
  const stride = useFlip(260, 3000);
  const walker = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - walk.value) * -80 }] }));
  const scale = 0.5;
  return (
    <>
      <Layer xml={paint("cafe-street", CAFE_STREET, scenery)} />
      <Grounded x={90} y={548} w={CYCLIST_W} h={CYCLIST_H} groundX={34} groundY={84} scale={1.9}>
        <ParkedBike />
      </Grounded>
      <Animated.View pointerEvents="none" style={[s.abs, { left: 186 - 60 * scale, top: 556 - 270 * scale }, walker]}>
        <Figure look={look} scale={scale} stride={stride} />
      </Animated.View>
    </>
  );
}

/**
 * One shot of the intro story, scaled to cover `width` × `height` with the ground kept in view
 * (the top of the sky is cropped on short screens).
 */
export function IntroStage({
  shot,
  label,
  look,
  scenery,
  width,
  height,
}: {
  shot: IntroShotId;
  label: string;
  look: FigureLook;
  scenery: Scenery;
  width: number;
  height: number;
}) {
  const scale = Math.max(width / STAGE_W, height / STAGE_H);
  return (
    <View style={{ width, height, overflow: "hidden" }} accessible accessibilityRole="image" accessibilityLabel={label}>
      <View
        importantForAccessibility="no-hide-descendants"
        style={{
          position: "absolute",
          width: STAGE_W,
          height: STAGE_H,
          left: (width - STAGE_W * scale) / 2,
          top: height - STAGE_H * scale,
          transform: [{ scale }],
          transformOrigin: "top left",
        }}
      >
        {shot === "landing" && <Landing scenery={scenery} />}
        {shot === "airport" && <Airport look={look} scenery={scenery} />}
        {shot === "train" && <Train look={look} scenery={scenery} />}
        {shot === "bike" && <Bike look={look} scenery={scenery} />}
        {shot === "cafe" && <Cafe look={look} scenery={scenery} />}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  abs: { position: "absolute" },
});
