import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AVATAR_LOOKS, lookFor } from "@/components/avatar/looks";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { IntroStage } from "@/components/intro/IntroStage";
import { INTRO_SHOTS } from "@/components/intro/shots";
import { useGame } from "@/hooks/useGame";
import { useScenery } from "@/hooks/useScenery";
import { useSettings } from "@/hooks/useSettings";
import { useVoice } from "@/hooks/useVoice";
import { speak, stopSpeaking } from "@/services/speech";
import { useTheme } from "@/themes";

const LANGUAGE = "nl-NL";
/** The text card overlaps the picture by its corner radius. */
const RADIUS = 26;

/**
 * The intro story, shown once after the avatar is picked: the learner flies in, lands, takes the
 * train and the bike, and arrives at the koffiebar where the first scene starts. Each line is read
 * aloud in Dutch. With `?replay=1` (from Profiel) it goes back when done and changes nothing.
 */
export default function IntroScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const game = useGame();
  const { update } = useSettings();
  const { scenery } = useScenery();
  const voice = useVoice(LANGUAGE);
  const { replay } = useLocalSearchParams<{ replay?: string }>();
  const [index, setIndex] = useState(0);

  const shot = INTRO_SHOTS[index];
  const last = index === INTRO_SHOTS.length - 1;
  const look = game.avatar ? lookFor(game.avatar) : AVATAR_LOOKS[1];
  const darkSky = scenery.phase === "night" || scenery.phase === "dusk";

  const cardHeight = 252 + insets.bottom;
  const artHeight = height - cardHeight + RADIUS;

  const readAloud = useCallback(() => {
    if (voice.status === "ready") void speak(`${shot.line} ${shot.sub}`, { language: LANGUAGE, voice: voice.voice });
  }, [voice, shot]);

  // Read each line as its shot appears; stop talking when the intro closes.
  useEffect(() => {
    readAloud();
  }, [readAloud]);
  useEffect(() => stopSpeaking, []);

  const finish = () => {
    stopSpeaking();
    if (replay) {
      router.back();
      return;
    }
    update({ introSeen: true });
    router.replace("/");
  };

  const next = () => (last ? finish() : setIndex((i) => i + 1));

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper }]}>
      <StatusBar style={darkSky ? "light" : "dark"} />
      <Animated.View key={shot.id} entering={FadeIn.duration(450)} style={s.art}>
        <IntroStage shot={shot.id} label={shot.label} look={look} scenery={scenery} width={width} height={artHeight} />
      </Animated.View>

      <View style={[s.top, { top: insets.top + 10 }]}>
        <View style={s.dashes} accessibilityLabel={`Deel ${index + 1} van ${INTRO_SHOTS.length}`} accessible>
          {INTRO_SHOTS.map((x, i) => (
            <View key={x.id} style={[s.dash, { backgroundColor: i <= index ? t.colors.primary : "rgba(255,255,255,0.75)" }]} />
          ))}
        </View>
        {!last && (
          <Pressable onPress={finish} accessibilityRole="button" hitSlop={8} style={({ pressed }) => [s.skip, { opacity: pressed ? 0.8 : 1 }]}>
            <Text style={[s.skipText, { fontFamily: t.fonts.bodyBold }]}>Overslaan</Text>
          </Pressable>
        )}
      </View>

      <View style={[s.card, { height: cardHeight, paddingBottom: insets.bottom + 12, backgroundColor: t.colors.paper }]}>
        <View style={s.chapterRow}>
          {voice.status === "ready" && (
            <Pressable
              onPress={readAloud}
              accessibilityRole="button"
              accessibilityLabel="Luister"
              style={({ pressed }) => [s.listen, { backgroundColor: t.colors.primarySoft, opacity: pressed ? 0.8 : 1 }]}
            >
              <Icon name="volume" size={22} color={t.colors.primaryDark} />
            </Pressable>
          )}
          <Text style={[s.chapter, { color: t.colors.inkMuted, fontFamily: t.fonts.bodyBold }]}>HOOFDSTUK {index + 1}</Text>
        </View>
        <Animated.View key={shot.id} entering={FadeIn.duration(350)} style={s.words}>
          <Text accessibilityRole="header" numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8} style={[s.line, { color: t.colors.ink }]}>
            {shot.line}
          </Text>
          <Text style={[s.sub, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>{shot.sub}</Text>
        </Animated.View>
        <Button label={last ? "Beginnen" : "Volgende"} onPress={next} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  art: { position: "absolute", left: 0, top: 0 },
  top: { position: "absolute", left: 20, right: 20, height: 36, flexDirection: "row", alignItems: "center", gap: 10 },
  dashes: { flex: 1, flexDirection: "row", gap: 6 },
  dash: { flex: 1, height: 5, borderRadius: 3 },
  skip: { height: 36, paddingHorizontal: 14, borderRadius: 18, backgroundColor: "rgba(255,253,247,0.92)", justifyContent: "center" },
  skipText: { fontSize: 14, color: "#293B3A" },
  card: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    paddingTop: 20,
    paddingHorizontal: 22,
    gap: 10,
  },
  chapterRow: { flexDirection: "row", alignItems: "center", gap: 12, minHeight: 44 },
  listen: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  chapter: { fontSize: 12, letterSpacing: 1 },
  words: { flex: 1, gap: 6 },
  line: { fontSize: 27, lineHeight: 33, fontFamily: "Nunito_900Black" },
  sub: { fontSize: 16, lineHeight: 22 },
});
