import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Figure } from "@/components/avatar/Figure";
import { lookFor } from "@/components/avatar/looks";
import { Icon } from "@/components/Icon";
import { ScreenHeader } from "@/components/ScreenHeader";
import { discoveredCount } from "@/engine/places";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { scenesNl } from "@/scenes";
import { placesNl } from "@/scenes/nl/places";
import { useTheme } from "@/themes";

/** "Jouw profiel": who you are, what you have done, and links to your avatar and settings. */
export default function ProfileScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const auth = useAuth();
  const [note, setNote] = useState<string | null>(null);

  if (!game.ready) return <View style={{ flex: 1, backgroundColor: t.colors.paper }} />;
  if (!game.avatar) return <Redirect href="/avatar" />;

  const look = lookFor(game.avatar);
  const name = auth.user?.displayName?.trim() || "Jij";
  const stats = [
    { n: discoveredCount(placesNl, scenesNl, game.progress), label: `van ${placesNl.length} plekken` },
    { n: Object.keys(game.progress.completed).length, label: "scènes gespeeld" },
    { n: game.progress.badges.length, label: "badges" },
  ];

  const signIn = async () => {
    setNote(null);
    const error = await auth.signIn();
    if (error === "unavailable") setNote("Inloggen met Google werkt nog niet in deze testversie.");
    else if (error && error !== "cancelled") setNote("Inloggen is niet gelukt. Probeer het opnieuw.");
  };

  const rows: { icon: string; label: string; onPress: () => void }[] = [
    { icon: "user", label: "Avatar aanpassen", onPress: () => router.push("/avatar") },
    { icon: "gear", label: "Instellingen", onPress: () => router.push("/settings") },
  ];

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top }]}>
      <ScreenHeader title="Jouw profiel" />
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={[s.card, s.who, { backgroundColor: t.colors.card }]}>
          <View style={[s.portrait, { backgroundColor: t.colors.primarySoft, borderColor: t.colors.primary }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <View style={s.portraitCrop}>
              <Figure look={look} scale={0.62} />
            </View>
          </View>
          <View style={s.whoText}>
            <Text style={[s.name, { color: t.colors.ink, fontFamily: t.fonts.display }]}>{name}</Text>
            <Text style={[s.meta, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>
              {auth.user ? (auth.user.email ?? "Ingelogd met Google") : "Geen account · alleen op deze telefoon"}
            </Text>
          </View>
        </View>

        <View style={s.stats}>
          {stats.map((st) => (
            <View key={st.label} style={[s.card, s.stat, { backgroundColor: t.colors.card }]} accessible accessibilityLabel={`${st.n} ${st.label}`}>
              <Text style={[s.statN, { color: t.colors.ink, fontFamily: "Nunito_900Black" }]}>{st.n}</Text>
              <Text style={[s.meta, { color: t.colors.inkMuted, fontFamily: t.fonts.body, textAlign: "center" }]}>{st.label}</Text>
            </View>
          ))}
        </View>

        <View style={[s.card, { backgroundColor: t.colors.card }]}>
          {rows.map((row, i) => (
            <Pressable
              key={row.label}
              onPress={row.onPress}
              accessibilityRole="button"
              style={({ pressed }) => [s.row, i > 0 && { borderTopWidth: 1, borderTopColor: t.colors.line }, { opacity: pressed ? 0.6 : 1 }]}
            >
              <View style={[s.rowIcon, { backgroundColor: t.colors.chip }]}>
                <Icon name={row.icon} size={18} color={t.colors.ink} />
              </View>
              <Text style={[s.rowLabel, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>{row.label}</Text>
              <View style={{ transform: [{ rotate: "180deg" }] }}>
                <Icon name="back" size={18} color={t.colors.inkMuted} />
              </View>
            </Pressable>
          ))}
        </View>

        {!auth.user && (
          <View style={[s.card, s.save, { backgroundColor: t.colors.correctSoft }]}>
            <Text style={[s.saveTitle, { color: t.colors.ink, fontFamily: t.fonts.display }]}>Bewaar je voortgang</Text>
            <Text style={[s.meta, { color: t.colors.ink, fontFamily: t.fonts.body }]}>
              Log in met Google. Dan gaat je stad mee naar een nieuwe telefoon.
            </Text>
            <Pressable onPress={signIn} accessibilityRole="button" style={({ pressed }) => [s.saveButton, { backgroundColor: t.colors.correct, opacity: pressed ? 0.8 : 1 }]}>
              <Text style={[s.saveButtonText, { fontFamily: t.fonts.bodyBold, color: t.scheme === "dark" ? t.colors.paper : "#fff" }]}>Inloggen met Google</Text>
            </Pressable>
            {note && <Text accessibilityRole="alert" style={[s.meta, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>{note}</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
  card: { borderRadius: 18, overflow: "hidden" },
  who: { flexDirection: "row", alignItems: "center", gap: 16, padding: 16 },
  portrait: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, overflow: "hidden" },
  portraitCrop: { position: "absolute", left: 4, top: 4 },
  whoText: { flex: 1, gap: 2 },
  name: { fontSize: 22 },
  meta: { fontSize: 13, lineHeight: 18 },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, paddingVertical: 14, paddingHorizontal: 6, alignItems: "center" },
  statN: { fontSize: 24 },
  row: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16 },
  rowIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  rowLabel: { flex: 1, fontSize: 16 },
  save: { padding: 16, gap: 8 },
  saveTitle: { fontSize: 17 },
  saveButton: { height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 4 },
  saveButtonText: { color: "#fff", fontSize: 15 },
});
