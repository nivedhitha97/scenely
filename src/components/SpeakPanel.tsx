import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { bareWord, type WordMatch } from "@/engine/speaking";
import type { SpeakPhase } from "@/hooks/useSpeaking";
import { useTheme } from "@/themes";
import { Button } from "./Button";
import { Icon } from "./Icon";

const SHADOW = { shadowColor: "#293B3A", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 4 } as const;

/** The sentence card of the speaking exercise: words light up teal as they are heard. */
export function SpeakCard({
  phase,
  words,
  levels,
  verdict,
  notice,
  onSay,
}: {
  phase: SpeakPhase;
  words: WordMatch[];
  levels: number[];
  verdict: "good" | "almost" | null;
  notice: string | null;
  /** Speak a text with the Dutch voice (slow or not). */
  onSay: (text: string, slow: boolean) => void;
}) {
  const t = useTheme();
  const sentence = words.map((w) => w.text).join(" ");
  const firstMissed = words.find((w) => w.state !== "ok");
  const chip =
    verdict === "good"
      ? { label: "GOED VERSTAAN", bg: t.colors.correctSoft, fg: t.colors.correct, icon: "tick" }
      : verdict === "almost"
        ? { label: "BIJNA! LET OP DIT WOORD", bg: t.colors.primarySoft, fg: t.colors.primaryDark, icon: null }
        : { label: "ZEG HET HARDOP", bg: t.colors.primarySoft, fg: t.colors.primaryDark, icon: "mic" };

  const colour = (w: WordMatch) => {
    if (phase === "ready") return t.colors.ink;
    if (w.state === "ok") return t.colors.correct;
    if (w.state === "miss") return t.colors.primaryDark;
    return "#C9C4BC";
  };

  return (
    <View style={[s.card, SHADOW]}>
      <View style={[s.chip, { backgroundColor: chip.bg }]}>
        {chip.icon && <Icon name={chip.icon} size={14} color={chip.fg} strokeWidth={2.8} />}
        <Text style={[s.chipText, { color: chip.fg, fontFamily: t.fonts.bodyBold }]}>{chip.label}</Text>
      </View>

      <Text style={[s.sentence, { fontFamily: "Nunito_900Black" }]} accessibilityLabel={sentence}>
        {words.map((w, i) => (
          <Text
            key={i}
            onPress={phase === "result" ? () => onSay(bareWord(w.text), true) : undefined}
            style={[
              { color: colour(w) },
              w.state === "miss" && phase === "result" && { textDecorationLine: "underline", textDecorationStyle: "dotted", textDecorationColor: t.colors.primary },
            ]}
          >
            {w.text}
            {i < words.length - 1 ? " " : ""}
          </Text>
        ))}
      </Text>

      {phase === "ready" && (
        <View style={s.row}>
          <SmallButton icon="volume" label="Voorbeeld" onPress={() => onSay(sentence, false)} />
          <SmallButton icon="snail" label="Langzaam" onPress={() => onSay(sentence, true)} />
        </View>
      )}
      {phase === "ready" && notice && (
        <Text style={[s.notice, { color: t.colors.primaryDark, fontFamily: t.fonts.bodyBold }]} accessibilityRole="alert">
          {notice}
        </Text>
      )}
      {phase === "listening" && <LevelBars levels={levels} />}
      {verdict === "good" && (
        <View style={s.row}>
          <SmallButton icon="volume" label="Origineel" onPress={() => onSay(sentence, false)} wide />
        </View>
      )}
      {verdict === "almost" && firstMissed && (
        <View style={s.row}>
          <SmallButton icon="volume" label={`„${bareWord(firstMissed.text)}” · langzaam`} onPress={() => onSay(bareWord(firstMissed.text), true)} active />
        </View>
      )}
    </View>
  );
}

function SmallButton({ icon, label, onPress, wide, active }: { icon: string; label: string; onPress: () => void; wide?: boolean; active?: boolean }) {
  const t = useTheme();
  const fg = active ? t.colors.primaryDark : t.colors.ink;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[s.small, wide && { flex: 1, justifyContent: "center", height: 46 }, active && { backgroundColor: t.colors.primarySoft }]}
    >
      <Icon name={icon} size={18} color={fg} strokeWidth={icon === "snail" ? 2 : 2.2} />
      <Text style={[s.smallText, { color: fg, fontFamily: t.fonts.bodyBold }]}>{label}</Text>
    </Pressable>
  );
}

/** Microphone level while listening: bars fill in coral from the left. */
function LevelBars({ levels }: { levels: number[] }) {
  const t = useTheme();
  return (
    <View style={s.bars} accessibilityElementsHidden>
      {Array.from({ length: 20 }, (_, i) => {
        const level = levels[i];
        const h = level === undefined ? 6 : 6 + Math.max(0, Math.min(10, level)) * 3.2;
        return <View key={i} style={[s.bar, { height: h, backgroundColor: level === undefined ? "#E8DDCF" : t.colors.primary }]} />;
      })}
    </View>
  );
}

/** The big microphone button under the card: tap to speak, or (while listening) tap to stop. */
export function MicButton({ listening, onPress }: { listening: boolean; onPress: () => void }) {
  const t = useTheme();
  const reduce = useReducedMotion();
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = listening && !reduce ? withRepeat(withTiming(1.08, { duration: 700 }), -1, true) : withTiming(1, { duration: 150 });
  }, [listening, reduce, pulse]);
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={s.micArea}>
      <Animated.View style={[s.ringOuter, listening && { backgroundColor: "rgba(242,155,98,0.12)" }, ring]}>
        <View style={[s.ringInner, listening && { backgroundColor: "rgba(242,155,98,0.22)" }]}>
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={listening ? "Stoppen met luisteren" : "Tik en spreek"}
            style={({ pressed }) => [s.mic, { backgroundColor: listening ? t.colors.primaryDark : t.colors.primary, opacity: pressed ? 0.9 : 1 }]}
          >
            {listening ? <View style={s.stopSquare} /> : <Icon name="mic" size={36} color="#fff" />}
          </Pressable>
        </View>
      </Animated.View>
      <Text style={[s.micLabel, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>{listening ? "Ik luister…" : "Tik en spreek"}</Text>
      {listening && <Text style={[s.micHint, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>Tik om te stoppen</Text>}
    </View>
  );
}

/** Bottom actions of the speaking exercise for each phase. */
export function SpeakActions({
  phase,
  verdict,
  onMic,
  onRetry,
  onDone,
}: {
  phase: SpeakPhase;
  verdict: "good" | "almost" | null;
  onMic: () => void;
  onRetry: () => void;
  onDone: () => void;
}) {
  const t = useTheme();
  if (phase === "result" && verdict === "good") return <Button label="Verder" onPress={onDone} />;
  if (phase === "result")
    return (
      <View style={{ gap: 10 }}>
        <Button label="Probeer opnieuw" onPress={onRetry} icon={<Icon name="mic" size={20} color="#fff" />} />
        <Button label="Verder" onPress={onDone} variant="secondary" />
      </View>
    );
  return (
    <View style={{ alignItems: "center" }}>
      <MicButton listening={phase === "listening"} onPress={onMic} />
      {phase === "ready" && (
        <Pressable onPress={onDone} accessibilityRole="button" style={s.skip}>
          <Text style={[s.skipText, { color: t.colors.inkMuted, fontFamily: t.fonts.bodyBold }]}>Nu niet spreken</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: { marginTop: -26, marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 18, paddingTop: 18, paddingHorizontal: 18, paddingBottom: 16 },
  chip: { alignSelf: "center", height: 28, paddingHorizontal: 10, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 6 },
  chipText: { fontSize: 12, letterSpacing: 0.6 },
  sentence: { fontSize: 28, lineHeight: 35, textAlign: "center", marginTop: 12 },
  row: { flexDirection: "row", justifyContent: "center", gap: 8, marginTop: 14 },
  small: { height: 40, paddingLeft: 9, paddingRight: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F7F1E8" },
  smallText: { fontSize: 13 },
  notice: { textAlign: "center", fontSize: 13, marginTop: 12 },
  bars: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 3, height: 40, marginTop: 16 },
  bar: { width: 4, borderRadius: 2 },
  micArea: { alignItems: "center", gap: 6 },
  ringOuter: { width: 132, height: 132, borderRadius: 66, alignItems: "center", justifyContent: "center" },
  ringInner: { width: 108, height: 108, borderRadius: 54, alignItems: "center", justifyContent: "center" },
  mic: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", shadowColor: "#D97C42", shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  stopSquare: { width: 22, height: 22, borderRadius: 5, backgroundColor: "#fff" },
  micLabel: { fontSize: 15 },
  micHint: { fontSize: 12 },
  skip: { height: 44, justifyContent: "center", paddingHorizontal: 16 },
  skipText: { fontSize: 14 },
});
