import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/Icon";
import type { Place, PlaceStatus } from "@/engine/places";
import { useTheme } from "@/themes";
import { C, shadow } from "./palette";

const WIDTH = 220;

/** Tappable name tag under a building on the map. */
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
  sub: string;
  onPress: () => void;
}) {
  const t = useTheme();
  const locked = status === "locked" || status === "soon";
  const filled = here && !isNew;
  return (
    <View style={[s.wrap, { left: place.door.x - WIDTH / 2, top: place.door.y + 10 }]} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${place.title}${status === "done" ? ", klaar" : locked ? ", op slot" : ""}${here ? ", hier ben je" : ""}`}
        style={[
          s.tag,
          shadow,
          { backgroundColor: filled ? C.coral : "#fff" },
          isNew && { borderWidth: 2, borderColor: C.coral, paddingLeft: 6 },
          selected && !filled && { borderWidth: 2, borderColor: C.ink },
          locked && !isNew && { paddingLeft: 6 },
        ]}
      >
        {isNew && (
          <View style={s.newPill}>
            <Text style={[s.newText, { fontFamily: t.fonts.bodyBold }]}>NIEUW</Text>
          </View>
        )}
        {status === "done" && (
          <View style={[s.dot, { backgroundColor: C.teal }]}>
            <Icon name="tick" size={11} color="#fff" strokeWidth={3.6} />
          </View>
        )}
        {locked && !isNew && (
          <View style={[s.dot, { backgroundColor: C.stone }]}>
            <Icon name="lock" size={11} color={C.grey} strokeWidth={2.6} />
          </View>
        )}
        <Text style={[s.name, { color: filled ? "#fff" : C.ink, fontFamily: t.fonts.bodyBold }]}>{place.title}</Text>
      </Pressable>
      <Text style={[s.sub, { fontFamily: t.fonts.bodyBold }]}>{sub}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: "absolute", width: WIDTH, alignItems: "center", gap: 3 },
  tag: { height: 30, borderRadius: 15, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 13 },
  dot: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  newPill: { height: 20, paddingHorizontal: 6, borderRadius: 10, backgroundColor: C.coral, justifyContent: "center" },
  newText: { color: "#fff", fontSize: 10 },
  sub: { fontSize: 11, color: C.grey, backgroundColor: "rgba(255,253,248,0.85)", paddingHorizontal: 8, paddingVertical: 1, borderRadius: 8, overflow: "hidden" },
});
