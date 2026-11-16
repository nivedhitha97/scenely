import { memo } from "react";
import { SvgXml } from "react-native-svg";

import { AMSTERDAM_HEIGHT, AMSTERDAM_WIDTH, AMSTERDAM_XML } from "./amsterdamMapData";

export const MAP_WIDTH = AMSTERDAM_WIDTH;
export const MAP_HEIGHT = AMSTERDAM_HEIGHT;

/**
 * The illustrated Amsterdam map: canals, bridges, the eight places and the bike route.
 * Drawn from assets/map/amsterdam-source.svg (see scripts/build-amsterdam-map.py). Labels and
 * the learner are separate components on top, so the drawing itself holds no text.
 */
export const AmsterdamMap = memo(function AmsterdamMap() {
  return <SvgXml xml={AMSTERDAM_XML} width={MAP_WIDTH} height={MAP_HEIGHT} accessible={false} />;
});
