import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Icon, isIconName } from "@/components/Icon";
import type { SceneSummary } from "@/engine/summary";
import type { Scene } from "@/engine/types";
import { useTheme } from "@/themes";

/** Badge icon keys in scene data → line icons. */
const BADGE_ICONS: Record<string, string> = { "badge-coffee": "coffee", "badge-barista": "cup", "badge-basket": "basket", "badge-receipt": "receipt" };

function badgeIcon(key: string): string {
  const name = BADGE_ICONS[key] ?? key.replace(/^badge-/, "");
  return isIconName(name) ? name : "tick";
}

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/**
 * "Goed gedaan!": shown after the last line of a scene. The badge, what the learner did, and the
 * sentences they practised, each with replay. No tab bar here (blueprint: keep the moment immersive).
 */
export function Completion({
  scene,
  summary,
  badgeEarned,
  showSpoken,
  canPlay,
  onPlay,
  onBack,
  onReplay,
}: {
  scene: Scene;
  summary: SceneSummary;
  /** False when the badge was already earned on an earlier play-through. */
  badgeEarned: boolean;
  /** Show the "hardop gezegd" count (hidden where speaking isn't available). */
  showSpoken: boolean;
  /** False when no Dutch voice is installed. */
  canPlay: boolean;
  onPlay: (text: string) => void;
  onBack: () => void;
  onReplay: () => void;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const stats = [
    { icon: "ear", n: summary.linesHeard, label: plural(summary.linesHeard, "regel gehoord", "regels gehoord") },
    { icon: "chat", n: summary.answers, label: plural(summary.answers, "antwoord", "antwoorden") },
    ...(showSpoken ? [{ icon: "mic", n: summary.spokenAloud, label: "hardop gezegd" }] : []),
  ];

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <BadgeMedal icon={badgeIcon(scene.badge.icon)} role={scene.role.title} />

        <View style={s.center}>
          <Text accessibilityRole="header" style={[s.h1, { color: t.colors.ink, fontFamily: t.fonts.display }]}>
            Goed gedaan!
          </Text>
          <Text style={[s.sub, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>
            {badgeEarned ? "Nieuwe badge: " : "Badge: "}
            <Text style={{ color: t.colors.ink, fontFamily: t.fonts.bodyBold }}>{scene.badge.title}</Text>
            {` · ${scene.badge.message}`}
          </Text>
        </View>

        <View style={s.stats}>
          {stats.map((st) => (
            <View key={st.icon} style={[s.card, s.stat]} accessible accessibilityLabel={`${st.n} ${st.label}`}>
              <Icon name={st.icon} size={18} color={t.colors.inkMuted} />
              <Text style={[s.statN, { color: t.colors.ink, fontFamily: "Nunito_900Black" }]}>{st.n}</Text>
              <Text style={[s.meta, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>{st.label}</Text>
            </View>
          ))}
        </View>

        {summary.phrases.length > 0 && (
          <>
            <Text accessibilityRole="header" style={[s.h3, { color: t.colors.ink, fontFamily: t.fonts.display }]}>
              Zinnen die je hebt geoefend
            </Text>
            <View style={s.phrases}>
              {summary.phrases.map((p) => (
                <View key={p.turnId} style={[s.card, s.phrase]}>
                  <View
                    style={[s.mark, { backgroundColor: t.colors.correctSoft }]}
                    accessibilityLabel={p.spoken ? "Hardop gezegd" : "Gekozen"}
                  >
                    <Icon name={p.spoken ? "mic" : "tick"} size={12} color={t.colors.correct} strokeWidth={2.8} />
                  </View>
                  <Text style={[s.phraseText, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>{p.text}</Text>
                  <Pressable
                    onPress={() => onPlay(p.text)}
                    disabled={!canPlay}
                    accessibilityRole="button"
                    accessibilityLabel={`Luister: ${p.text}`}
                    hitSlop={4}
                    style={({ pressed }) => [s.play, { backgroundColor: t.colors.primarySoft, opacity: !canPlay ? 0.4 : pressed ? 0.7 : 1 }]}
                  >
                    <Icon name="volume" size={18} color={t.colors.primaryDark} />
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button label="Terug naar scènes" onPress={onBack} />
        <Button label="Opnieuw spelen" onPress={onReplay} variant="text" />
      </View>
    </View>
  );
}

/** Gold medal with the scene's icon, a Dutch flag, the role ribbon and a few confetti dots. */
function BadgeMedal({ icon, role }: { icon: string; role: string }) {
  const t = useTheme();
  const reduceMotion = useReducedMotion();
  const grow = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (!reduceMotion) grow.value = withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) });
  }, [grow, reduceMotion]);

  const medal = useAnimatedStyle(() => ({ opacity: grow.value, transform: [{ scale: 0.6 + 0.4 * grow.value }] }));

  return (
    <View style={s.medalArea} accessible accessibilityLabel={`Badge ${role}`}>
      <View style={[s.halo, { backgroundColor: "rgba(234,203,120,0.3)" }]} />
      {CONFETTI.map(([x, y, size, coral], i) => (
        <View
          key={i}
          style={[s.dot, { left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: coral ? t.colors.primary : t.colors.warm }]}
        />
      ))}
      <Animated.View style={[s.medal, { backgroundColor: t.colors.warm, borderColor: t.colors.warmSoft }, medal]}>
        <Icon name={icon} size={40} color={t.colors.ink} strokeWidth={2} />
        <View style={s.flag}>
          <View style={[s.stripe, { backgroundColor: "#AE1C28" }]} />
          <View style={[s.stripe, { backgroundColor: "#FFFFFF" }]} />
          <View style={[s.stripe, { backgroundColor: "#21468B" }]} />
        </View>
      </Animated.View>
      <View style={s.ribbonRow}>
        <View style={[s.ribbon, { backgroundColor: t.colors.primaryDark }]}>
          <Text style={[s.ribbonText, { fontFamily: "Nunito_900Black" }]}>{role.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

/** [x, y, size, coral?] relative to the 350-wide medal area, as in the v7 design. */
const CONFETTI: [number, number, number, boolean][] = [
  [70, 30, 10, false],
  [270, 24, 8, true],
  [262, 110, 10, false],
  [86, 118, 7, true],
];

const shadow = { shadowColor: "#293B3A", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 2 }, elevation: 2 };

const s = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  medalArea: { width: 350, maxWidth: "100%", height: 160, alignSelf: "center" },
  halo: { position: "absolute", left: 100, top: 6, width: 150, height: 150, borderRadius: 75 },
  dot: { position: "absolute" },
  medal: { position: "absolute", left: 131, top: 30, width: 88, height: 88, borderRadius: 44, borderWidth: 7, alignItems: "center", justifyContent: "center" },
  flag: { position: "absolute", right: -4, bottom: 2, width: 22, height: 15, borderRadius: 3, overflow: "hidden", borderWidth: 1, borderColor: "#fff" },
  stripe: { flex: 1 },
  ribbonRow: { position: "absolute", top: 108, left: 0, right: 0, alignItems: "center" },
  ribbon: { height: 24, paddingHorizontal: 14, borderRadius: 7, justifyContent: "center" },
  ribbonText: { color: "#fff", fontSize: 12, letterSpacing: 0.5 },
  center: { alignItems: "center", marginTop: 6, gap: 2 },
  h1: { fontSize: 28, lineHeight: 34 },
  sub: { fontSize: 15, textAlign: "center" },
  stats: { flexDirection: "row", gap: 10, marginTop: 16 },
  card: { backgroundColor: "#fff", borderRadius: 18, ...shadow },
  stat: { flex: 1, padding: 10, alignItems: "center", gap: 2 },
  statN: { fontSize: 18 },
  meta: { fontSize: 12, textAlign: "center" },
  h3: { fontSize: 17, marginTop: 20, marginBottom: 10 },
  phrases: { gap: 8 },
  phrase: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 14, paddingRight: 6, paddingVertical: 6 },
  mark: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  phraseText: { flex: 1, fontSize: 16 },
  play: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  footer: { paddingHorizontal: 20, paddingTop: 8, gap: 2 },
});
