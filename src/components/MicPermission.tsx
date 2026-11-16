import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/themes";
import { Button } from "./Button";
import { Icon } from "./Icon";

/** Asked once, before the first speaking exercise. The system dialog follows "Microfoon aanzetten". */
export function MicPermission({ onAllow, onDecline }: { onAllow: () => void; onDecline: () => void }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top + 70, paddingBottom: insets.bottom + 24 }]}>
      <View style={s.art}>
        <View style={[s.halo, { backgroundColor: t.colors.primarySoft }]} />
        <View style={[s.mic, { backgroundColor: t.colors.primary }]}>
          <Icon name="mic" size={36} color="#fff" />
        </View>
        <View style={s.bubble}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[s.dot, { backgroundColor: t.colors.inkMuted }]} />
          ))}
        </View>
      </View>
      <View style={s.text}>
        <Text style={[s.h1, { color: t.colors.ink, fontFamily: t.fonts.display }]}>Zeg het hardop</Text>
        <Text style={[s.body, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>
          Scenely gebruikt je microfoon om te horen wat je zegt. De herkenning gebeurt op je telefoon als dat kan. Scenely bewaart niets.
        </Text>
      </View>
      <View style={s.actions}>
        <Button label="Microfoon aanzetten" onPress={onAllow} />
        <Button label="Liever alleen luisteren" onPress={onDecline} variant="text" />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, paddingHorizontal: 20, zIndex: 10 },
  art: { width: 200, height: 170, alignSelf: "center" },
  halo: { position: "absolute", left: 30, top: 10, width: 140, height: 140, borderRadius: 70 },
  mic: { position: "absolute", left: 58, top: 38, width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center" },
  bubble: { position: "absolute", left: 132, top: 4, height: 34, paddingHorizontal: 12, borderTopLeftRadius: 17, borderTopRightRadius: 17, borderBottomRightRadius: 17, borderBottomLeftRadius: 4, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", gap: 4, shadowColor: "#293B3A", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  dot: { width: 5, height: 5, borderRadius: 3 },
  text: { alignItems: "center", marginTop: 18 },
  h1: { fontSize: 28 },
  body: { fontSize: 16, lineHeight: 23, textAlign: "center", marginTop: 8 },
  actions: { marginTop: "auto", gap: 6 },
});
