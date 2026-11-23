import { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, G, Path, SvgXml } from "react-native-svg";

import type { Scenery } from "@/engine/scenery";
import { AMSTERDAM_HEIGHT, AMSTERDAM_WIDTH, AMSTERDAM_XML } from "./amsterdamMapData";
import { applyScenery } from "./sceneryColors";

export const MAP_WIDTH = AMSTERDAM_WIDTH;
export const MAP_HEIGHT = AMSTERDAM_HEIGHT;

/** The sky band at the top of the drawing (above the IJ). */
const SKY_HEIGHT = 108;

/** Repeatable "random" numbers, so stars and snowflakes stay in the same places. */
function scatter(count: number, seed: number) {
  let s = seed;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({ x: next(), y: next(), r: next() }));
}
const STARS = scatter(38, 7);
const SNOW = scatter(90, 11);
const LEAVES = scatter(34, 23);
const PETALS = scatter(70, 31);

/**
 * The illustrated Amsterdam map: canals, bridges, the eight places and the bike route, coloured
 * for the time of day and the season on the learner's phone. Drawn from
 * assets/map/amsterdam-source.svg (see scripts/build-amsterdam-map.py). Labels and the learner
 * are separate components on top, so the drawing itself holds no text.
 */
export const AmsterdamMap = memo(function AmsterdamMap({ scenery, sky }: { scenery: Scenery; sky: { body: "sun" | "moon"; x: number; height: number } }) {
  const xml = useMemo(() => applyScenery(AMSTERDAM_XML, scenery), [scenery]);
  const dark = scenery.phase === "night" || scenery.phase === "dusk";
  // The sun or moon travels across the sky band from left to right through the day or night.
  const bx = 60 + sky.x * (MAP_WIDTH - 120);
  const by = SKY_HEIGHT - 26 - sky.height * (SKY_HEIGHT - 56);
  return (
    <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
      <SvgXml xml={xml} width={MAP_WIDTH} height={MAP_HEIGHT} accessible={false} />
      <Svg style={StyleSheet.absoluteFill} width={MAP_WIDTH} height={MAP_HEIGHT} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {dark && (
          <G>
            {STARS.map((p, i) => (
              <Circle key={i} cx={p.x * MAP_WIDTH} cy={6 + p.y * (SKY_HEIGHT - 20)} r={0.8 + p.r * 1.6} fill="#FFF6D8" opacity={scenery.phase === "night" ? 0.9 : 0.5} />
            ))}
          </G>
        )}
        {sky.body === "sun" ? (
          <G>
            <Circle cx={bx} cy={by} r={30} fill={scenery.phase === "evening" || scenery.phase === "dawn" ? "#FFB070" : "#FFE48A"} opacity={0.35} />
            <Circle cx={bx} cy={by} r={19} fill={scenery.phase === "evening" || scenery.phase === "dawn" ? "#FF9E5E" : "#FFD34D"} stroke="#4A3426" strokeWidth={1.6} />
          </G>
        ) : (
          <G>
            <Circle cx={bx} cy={by} r={28} fill="#FFF3C4" opacity={0.18} />
            <Circle cx={bx} cy={by} r={16} fill="#FFF3C4" stroke="#4A3426" strokeWidth={1.4} />
            <Circle cx={bx + 7} cy={by - 5} r={14} fill={dark ? "#172240" : "#6E5A8C"} />
          </G>
        )}
        {scenery.season === "winter" &&
          SNOW.map((p, i) => <Circle key={i} cx={p.x * MAP_WIDTH} cy={p.y * MAP_HEIGHT} r={1.6 + p.r * 2.6} fill="#FFFFFF" opacity={0.85} />)}
        {scenery.season === "autumn" &&
          LEAVES.map((p, i) => (
            <Path
              key={i}
              d="M0 -6 C 5 -4 6 2 0 6 C -6 2 -5 -4 0 -6 Z"
              fill={["#D98A3D", "#C4643A", "#E9A84C"][i % 3]}
              transform={`translate(${p.x * MAP_WIDTH} ${SKY_HEIGHT + p.y * (MAP_HEIGHT - SKY_HEIGHT)}) rotate(${Math.round(p.r * 360)})`}
            />
          ))}
        {scenery.season === "spring" &&
          PETALS.map((p, i) => <Circle key={i} cx={p.x * MAP_WIDTH} cy={SKY_HEIGHT + p.y * (MAP_HEIGHT - SKY_HEIGHT)} r={2.2 + p.r * 1.6} fill="#F6C3D0" opacity={0.9} />)}
      </Svg>
    </View>
  );
});
