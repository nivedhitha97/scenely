import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Figure } from "@/components/avatar/Figure";
import { AVATAR_LOOKS, lookFor, OUTFIT_COLOURS } from "@/components/avatar/looks";
import { Icon } from "@/components/Icon";
import { C } from "@/components/map/palette";
import { useGame } from "@/hooks/useGame";
import { useTheme } from "@/themes";

/** "Kies je avatar": pick a look and a clothing colour. This figure walks around the map. */
export default function AvatarScreen() {
  const t = useTheme();
  const game = useGame();
  const insets = useSafeAreaInsets();
  const [look, setLook] = useState(game.avatar?.look ?? 1);
  const [outfit, setOutfit] = useState(game.avatar?.outfit ?? AVATAR_LOOKS[game.avatar?.look ?? 1].top);
  const changing = !!game.avatar;

  const pickLook = (i: number) => {
    setLook(i);
    // A new look starts in its own colours unless the learner already chose a different one.
    if (outfit === AVATAR_LOOKS[look].top) setOutfit(AVATAR_LOOKS[i].top);
  };

  const confirm = () => {
    game.setAvatar({ look, outfit });
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper }, { paddingTop: insets.top + 6 }]}>
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 100 }]}>
        <View style={s.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={[s.title, { color: t.colors.ink }, { fontFamily: t.fonts.display }]}>Kies je avatar</Text>
            <Text style={[s.sub, { color: t.colors.inkMuted }, { fontFamily: t.fonts.bodyMedium }]}>Zo loop jij door de stad.</Text>
          </View>
          {changing && (
            <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Sluiten" style={[s.close, { backgroundColor: t.colors.card }, { backgroundColor: t.colors.card }]}>
              <Icon name="close" size={20} color={t.colors.ink} />
            </Pressable>
          )}
        </View>

        <View style={s.stage}>
          <View style={[s.house, { left: 0, width: 54, height: 150, backgroundColor: "#A65E46" }]} />
          <View style={[s.house, { left: 54, width: 64, height: 166, backgroundColor: "#C9974E", borderTopLeftRadius: 20, borderTopRightRadius: 20 }]} />
          <View style={[s.house, { right: 58, width: 58, height: 156, backgroundColor: "#3F5F55", borderTopLeftRadius: 26, borderTopRightRadius: 26 }]} />
          <View style={[s.house, { right: 0, width: 60, height: 140, backgroundColor: "#EADBC4" }]} />
          <View style={s.quay} />
          <View style={s.canal} />
          <View style={s.hero}>
            <Figure look={lookFor({ look, outfit })} scale={0.8} />
          </View>
        </View>

        <View style={s.grid}>
          {AVATAR_LOOKS.map((l, i) => {
            const sel = i === look;
            return (
              <Pressable
                key={i}
                onPress={() => pickLook(i)}
                accessibilityRole="button"
                accessibilityLabel={`Avatar ${i + 1}`}
                accessibilityState={{ selected: sel }}
                style={[s.tile, { backgroundColor: t.colors.card, borderColor: t.colors.line }, sel && [s.tileSel, { backgroundColor: t.colors.primarySoft }]]}
              >
                <View style={s.tileFigure}>
                  <Figure look={sel ? { ...l, top: outfit } : l} />
                </View>
                {sel && (
                  <View style={s.tick}>
                    <Icon name="tick" size={13} color="#fff" strokeWidth={3.6} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[s.label, { color: t.colors.ink }, { fontFamily: t.fonts.bodyBold }]}>Kleur kleding</Text>
        <View style={s.swatches}>
          {OUTFIT_COLOURS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setOutfit(c)}
              accessibilityRole="button"
              accessibilityLabel={`Kleur ${c}`}
              accessibilityState={{ selected: c === outfit }}
              style={[s.swatch, { backgroundColor: c }, c === outfit && s.swatchSel]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[s.footer, { backgroundColor: t.colors.paper }, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable onPress={confirm} accessibilityRole="button" style={({ pressed }) => [s.cta, { opacity: pressed ? 0.85 : 1 }]}>
          <Text style={[s.ctaText, { fontFamily: t.fonts.bodyBold }]}>Dit ben ik</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.cream },
  content: { paddingHorizontal: 20 },
  titleRow: { flexDirection: "row", alignItems: "flex-start" },
  title: { fontSize: 28, color: C.ink },
  sub: { fontSize: 15, color: C.grey, marginTop: 2 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  stage: { height: 250, marginTop: 14, borderRadius: 24, overflow: "hidden", backgroundColor: "#F4E4D2" },
  house: { position: "absolute", bottom: 60 },
  quay: { position: "absolute", left: 0, right: 0, bottom: 32, height: 30, backgroundColor: "#D8C8B4" },
  canal: { position: "absolute", left: 0, right: 0, bottom: 0, height: 32, backgroundColor: "#A9C7C9" },
  hero: { position: "absolute", bottom: 34, alignSelf: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 14, marginTop: 16 },
  tile: { width: 100, height: 112, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1.5, borderColor: C.line, overflow: "hidden" },
  tileSel: { backgroundColor: C.peach, borderWidth: 2.5, borderColor: C.coral },
  tileFigure: { position: "absolute", left: -10, top: 4 },
  tick: { position: "absolute", right: 6, top: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: C.coral, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 14, color: C.ink, marginTop: 18 },
  swatches: { flexDirection: "row", gap: 12, marginTop: 8, flexWrap: "wrap" },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: "rgba(0,0,0,0.06)" },
  swatchSel: { borderWidth: 3, borderColor: C.coral },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: C.cream },
  cta: { height: 52, borderRadius: 14, backgroundColor: C.coral, alignItems: "center", justifyContent: "center" },
  ctaText: { color: "#fff", fontSize: 16 },
});
