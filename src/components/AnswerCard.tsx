import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { useTheme } from "@/themes";
import { Icon } from "./Icon";

export type AnswerState = "idle" | "correct" | "wrong" | "dimmed";

/** Picture tile colours per answer position: background and icon. */
const TINTS = [
  ["#F8E8D8", "#A9673F"],
  ["#F6EED3", "#A88A2E"],
  ["#EFE5DA", "#8C6A50"],
  ["#E3EAF2", "#5B7FA6"],
] as const;

/** One answer: picture tile and sentence. Turns teal with a tick when right, peach with a shake when wrong. */
export function AnswerCard({
  index,
  label,
  icon,
  state,
  disabled,
  onPress,
}: {
  index: number;
  label: string;
  icon: string;
  state: AnswerState;
  disabled: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  const reduce = useReducedMotion();
  const shake = useSharedValue(0);
  const [tileBg, iconColour] = TINTS[index % TINTS.length];

  useEffect(() => {
    if (state !== "wrong") return;
    shake.value = reduce
      ? 5
      : withSequence(withTiming(-8, { duration: 60 }), withTiming(8, { duration: 60 }), withTiming(-5, { duration: 60 }), withTiming(5, { duration: 60 }));
  }, [state, reduce, shake]);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const correct = state === "correct";
  const wrong = state === "wrong";
  return (
    <Animated.View style={[shakeStyle, state === "dimmed" && { opacity: 0.4 }]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled, selected: correct }}
        style={({ pressed }) => [
          s.card,
          correct && { backgroundColor: t.colors.correctSoft, borderColor: t.colors.correct, borderWidth: 2 },
          wrong && { backgroundColor: t.colors.primarySoft, borderColor: t.colors.primary, borderWidth: 2 },
          pressed && !disabled && { opacity: 0.85 },
        ]}
      >
        <View style={[s.tile, { backgroundColor: correct || wrong ? "#fff" : tileBg }]}>
          <Icon name={icon} size={26} color={correct ? t.colors.correct : wrong ? t.colors.primaryDark : iconColour} strokeWidth={2} />
        </View>
        <Text style={[s.label, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>{label}</Text>
        {correct && (
          <View style={[s.mark, { backgroundColor: t.colors.correct }]}>
            <Icon name="tick" size={14} color="#fff" strokeWidth={3.6} />
          </View>
        )}
        {wrong && (
          <View style={[s.mark, { borderWidth: 2, borderColor: t.colors.primary }]}>
            <Icon name="retry" size={12} color={t.colors.primaryDark} strokeWidth={3.4} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: { minHeight: 62, backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#EFE4D6", borderRadius: 16, paddingVertical: 7, paddingLeft: 7, paddingRight: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  tile: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, fontSize: 16 },
  mark: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
});
