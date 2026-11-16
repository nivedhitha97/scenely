import Svg, { Circle, Path, Rect } from "react-native-svg";

/** Line icons in the style of Lucide (MIT). Keys match `icon` fields in scene data. */
const ICONS = {
  coffee: (
    <>
      <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <Path d="M6 2v2M10 2v2M14 2v2" />
    </>
  ),
  "coffee-black": (
    <>
      <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="currentColor" />
    </>
  ),
  beer: (
    <>
      <Path d="M17 11h1a3 3 0 0 1 0 6h-1" />
      <Path d="M9 12v6M13 12v6" />
      <Path d="M5 8h12v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
      <Path d="M5 8a3 3 0 0 1 3-4 3 3 0 0 1 6 0 3 3 0 0 1 3 4" />
    </>
  ),
  bread: <Path d="M5 11a4 4 0 0 1 2-7.5h10A4 4 0 0 1 19 11v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />,
  milk: (
    <>
      <Path d="M8 2h8" />
      <Path d="M9 2v2.8a4 4 0 0 1-.7 2.2l-.6 1A4 4 0 0 0 7 10.2V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.8a4 4 0 0 0-.7-2.2l-.6-1A4 4 0 0 1 15 4.8V2" />
      <Path d="M7 15a6.5 6.5 0 0 1 5 0 6.5 6.5 0 0 0 5 0" />
    </>
  ),
  cup: (
    <>
      <Path d="M5 8h14l-1.5 12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2Z" />
      <Path d="M5 8l1-4h12l1 4" />
    </>
  ),
  card: (
    <>
      <Rect x={2} y={5} width={20} height={14} rx={2} />
      <Path d="M2 10h20" />
    </>
  ),
  cash: (
    <>
      <Rect x={2} y={6} width={20} height={12} rx={2} />
      <Circle cx={12} cy={12} r={2} />
      <Path d="M6 12h.01M18 12h.01" />
    </>
  ),
  wave: (
    <>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <Path d="m16 17 5-5-5-5M21 12H9" />
    </>
  ),
  tick: <Path d="M20 6 9 17l-5-5" />,
  close: <Path d="M18 6 6 18M6 6l12 12" />,
  volume: (
    <>
      <Path d="M11 5 6 9H2v6h4l5 4V5Z" fill="currentColor" />
      <Path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </>
  ),
  "volume-off": (
    <>
      <Path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <Path d="m22 9-6 6M16 9l6 6" />
    </>
  ),
  snail: (
    <>
      <Path d="M3 18h12a5 5 0 0 0 0-10 5 5 0 0 0-5 5v5" />
      <Path d="M15 8V5M18 8V5" />
    </>
  ),
  "arrow-right": <Path d="M5 12h14m-6-6 6 6-6 6" />,
  lock: (
    <>
      <Rect x={5} y={11} width={14} height={10} rx={2} />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  basket: <Path d="m5 11 4-7M19 11l-4-7M2 11h20l-1.5 8a2 2 0 0 1-2 1.6h-13a2 2 0 0 1-2-1.6Z" />,
  train: (
    <>
      <Rect x={5} y={3} width={14} height={14} rx={3} />
      <Path d="M5 11h14M9 21l-2-4M15 21l2-4" />
    </>
  ),
  steth: (
    <>
      <Path d="M6 3v6a4 4 0 0 0 8 0V3" />
      <Path d="M10 13v3a5 5 0 0 0 10 0v-2" />
      <Circle cx={20} cy={12} r={2} />
    </>
  ),
  hanger: (
    <>
      <Path d="M12 7a2 2 0 1 1 2-2" />
      <Path d="M12 7v1L3 15a1 1 0 0 0 .6 1.8h16.8A1 1 0 0 0 21 15l-9-7" />
    </>
  ),
  school: (
    <>
      <Path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <Path d="M6 12v5c3 2 9 2 12 0v-5" />
    </>
  ),
  cheese: (
    <>
      <Path d="M3 15 15 5l6 4v8H3Z" />
      <Circle cx={9} cy={14} r={1.5} />
      <Circle cx={15} cy={12} r={1} />
    </>
  ),
  hospital: (
    <>
      <Rect x={3} y={3} width={18} height={18} rx={3} />
      <Path d="M9 8v8M15 8v8M9 12h6" />
    </>
  ),
  play: <Path d="M8 5v14l11-7z" />,
  back: <Path d="m15 18-6-6 6-6" />,
  mic: (
    <>
      <Rect x={9} y={2} width={6} height={12} rx={3} />
      <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
    </>
  ),
  retry: (
    <>
      <Path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <Path d="M3 3v5h5" />
    </>
  ),
  user: (
    <>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
} as const;

export type IconName = keyof typeof ICONS;

export function isIconName(name: string): name is IconName {
  return name in ICONS;
}

export function Icon({
  name,
  size = 24,
  color,
  strokeWidth = 2.2,
}: {
  name: string;
  size?: number;
  color: string;
  strokeWidth?: number;
}) {
  const glyph = isIconName(name) ? ICONS[name] : ICONS.tick;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      color={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </Svg>
  );
}
