import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";

import type { FigureLook } from "@/components/avatar/looks";

/** The drawing is 68 × 90; (34, 84) is the ground under the middle of the bike. */
export const CYCLIST_W = 68;
export const CYCLIST_H = 90;
const OUTLINE = "#4A3426";
const FRAME = "#3E6E8E";
const TYRE = "#2E2E2E";

/** The bike on its own: frame, wheels and a basket of tulips. */
function Bike({ parked = false }: { parked?: boolean }) {
  return (
    <G>
      <Circle cx={-17} cy={-12} r={12} fill="none" stroke={TYRE} strokeWidth={2.6} />
      <Circle cx={17} cy={-12} r={12} fill="none" stroke={TYRE} strokeWidth={2.6} />
      <Path d="M-17 -12 L-4 -12 L4 -28 L17 -12 M-4 -12 L-9 -32 M4 -28 L13 -34" fill="none" stroke={FRAME} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M-14 -33 h9" stroke={TYRE} strokeWidth={3} strokeLinecap="round" />
      <Path d="M10 -36 h7" stroke={TYRE} strokeWidth={2.4} strokeLinecap="round" />
      <Rect x={15} y={-33} width={15} height={10} rx={2} fill="#C69A5B" stroke={OUTLINE} strokeWidth={1.2} />
      <Circle cx={19} cy={-35} r={3} fill="#E85D5D" />
      <Circle cx={24} cy={-36} r={3} fill="#F6D776" />
      <Circle cx={28} cy={-34} r={2.6} fill="#E8738A" />
      {parked && <Path d="M-17 -12 l-4 12" stroke={TYRE} strokeWidth={2} />}
    </G>
  );
}

/** Hair on top of a head centred at (0, -67), in the avatar's style. */
function Hair({ look }: { look: FigureLook }) {
  const c = look.hair;
  switch (look.hairStyle) {
    case "long":
      // The long part hangs behind the head and is drawn before it (see Cyclist).
      return <Path d="M-10 -68 q2 -11 12 -10 q7 1 7 7 q-5 -3 -10 -2 q-4 1 -9 5 z" fill={c} />;
    case "curly":
      return (
        <G fill={c}>
          <Circle cx={-7} cy={-72} r={4.5} />
          <Circle cx={-1} cy={-76} r={4.8} />
          <Circle cx={6} cy={-73} r={4.5} />
          <Circle cx={-9} cy={-66} r={4} />
        </G>
      );
    case "bun":
      return (
        <G fill={c}>
          <Circle cx={-6} cy={-78} r={4.5} />
          <Path d="M-10 -68 q2 -11 12 -10 q7 1 7 7 q-5 -3 -10 -2 q-4 1 -9 5 z" />
        </G>
      );
    default:
      return <Path d="M-9.5 -67 q0 -11 10 -10.5 q8 0.5 8 7.5 q-6 -3 -11 -2 q-4 1 -7 5 z" fill={c} />;
  }
}

/**
 * The learner riding a Dutch bike, in their own colours. `pedal` swaps the legs, so toggling it
 * while moving looks like pedalling. Draw it with the ground point at its bottom centre.
 */
export function Cyclist({ look, pedal = false }: { look: FigureLook; pedal?: boolean }) {
  const acc = new Set(look.acc ?? []);
  const bag = acc.has("backpack") || acc.has("tote");
  const front = pedal ? "M-10 -34 L2 -22 L6 -14" : "M-10 -34 L-1 -18 L-4 -10";
  const back = pedal ? "M-10 -34 L-1 -18 L-4 -10" : "M-10 -34 L2 -22 L6 -14";
  return (
    <Svg width={CYCLIST_W} height={CYCLIST_H} viewBox="-34 -84 68 90">
      <Ellipse cx={0} cy={1} rx={30} ry={4} fill={OUTLINE} opacity={0.18} />
      <Path d={back} fill="none" stroke={look.bottom} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <Bike />
      <Path d={front} fill="none" stroke={look.bottom} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M-9 -34 L-3 -58" stroke={OUTLINE} strokeWidth={13} strokeLinecap="round" />
      <Path d="M-9 -34 L-3 -58" stroke={look.top} strokeWidth={10.5} strokeLinecap="round" />
      <Path d="M-3 -52 L12 -38" stroke={look.top} strokeWidth={4.5} strokeLinecap="round" />
      <Circle cx={13} cy={-37} r={2.5} fill={look.skin} />
      {bag && <Rect x={-20} y={-58} width={10} height={16} rx={3} fill="#9C6B3F" stroke={OUTLINE} strokeWidth={1.2} transform="rotate(14 -15 -50)" />}
      {look.hairStyle === "long" && <Path d="M-10 -64 q-10 4 -12 16 q-2 8 -8 12 q6 -1 9 -7 q-1 6 -5 10 q8 -3 10 -12 q2 -8 6 -12 z" fill={look.hair} />}
      <Circle cx={-1} cy={-67} r={8.5} fill={look.skin} stroke={OUTLINE} strokeWidth={1.2} />
      <Hair look={look} />
      <Circle cx={3.5} cy={-68} r={1} fill={OUTLINE} />
      <Path d="M1 -64 q2 2 5 0" fill="none" stroke={OUTLINE} strokeWidth={1.2} strokeLinecap="round" />
      {acc.has("glasses") && <Path d="M0.5 -68.5 h6 M-1 -68.5 a1 1 0 0 0 2 0" stroke={OUTLINE} strokeWidth={1} fill="none" />}
    </Svg>
  );
}

/** The bike parked at a place (the learner stands beside it). Same size and ground point as Cyclist. */
export function ParkedBike() {
  return (
    <Svg width={CYCLIST_W} height={CYCLIST_H} viewBox="-34 -84 68 90">
      <Ellipse cx={0} cy={1} rx={28} ry={3.5} fill={OUTLINE} opacity={0.15} />
      <Bike parked />
    </Svg>
  );
}
