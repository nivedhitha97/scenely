import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/Icon";
import type { Place, PlaceStatus } from "@/engine/places";
import { useTheme } from "@/themes";
import { C } from "./palette";

const WIDTH = 220;
const OUTLINE = "#4A3426";
/** Hand-lettered names, to match the drawn map. */
const HAND = "Caveat_700Bold";

/** Tappable hand-lettered name tag above a building on the map. */
export function PlaceLabel({
  place,
  status,
  here,
  isNew,
  selected,
  sub,
  onPress,
}: {
  place: Place;
  status: PlaceStatus;
  here: boolean;
  isNew: boolean;
  selected: boolean;
  /** Roles, read out by screen readers. */
  sub: string;
  onPress: () => void;
}) {
  const t = useTheme();
  const locked = status === "locked" || status === "soon";
  const pos = place.label ?? { x: place.door.x, y: place.door.y + 10 };
  return (
    <View style={[s.wrap, { left: pos.x - WIDTH / 2, top: pos.y }]} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${place.title}${status === "done" ? ", klaar" : locked ? ", op slot" : ""}${here ? ", hier ben je" : ""}. ${sub}`}
        hitSlop={6}
        style={[
          s.tag,
          (here || selected || isNew) && { borderWidth: 2.4, borderColor: "#2E2A26" },
          here && !isNew && { backgroundColor: C.peach },
        ]}
      >
        {isNew && (
          <View style={s.newPill}>
            <Text style={[s.newText, { fontFamily: t.fonts.bodyBold }]}>NIEUW</Text>
          </View>
        )}
        {status === "done" && (
          <View style={[s.dot, { backgroundColor: C.teal }]}>
            <Icon name="tick" size={13} color="#fff" strokeWidth={3.6} />
          </View>
        )}
        {locked && !isNew && <Icon name="lock" size={16} color="#6F7775" strokeWidth={2.4} />}
        <Text style={[s.name, { color: locked && !isNew ? "#4E5655" : "#2E2A26" }]}>{place.title}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: "absolute", width: WIDTH, alignItems: "center" },
  tag: {
    minHeight: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFDF7",
    borderWidth: 1.8,
    borderColor: OUTLINE,
  },
  name: { fontFamily: HAND, fontSize: 22, lineHeight: 26 },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  newPill: { height: 22, paddingHorizontal: 7, borderRadius: 11, backgroundColor: C.coral, justifyContent: "center" },
  newText: { color: "#fff", fontSize: 10.5 },
});
