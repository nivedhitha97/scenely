import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Icon } from "@/components/Icon";
import { useTheme } from "@/themes";

/** Back button and a large title, for screens opened from the map (profile, settings). */
export function ScreenHeader({ title, right }: { title: string; right?: ReactNode }) {
  const t = useTheme();
  return (
    <View style={s.row}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
        accessibilityRole="button"
        accessibilityLabel="Terug"
        hitSlop={6}
        style={({ pressed }) => [s.back, { backgroundColor: t.colors.card, opacity: pressed ? 0.7 : 1 }]}
      >
        <Icon name="back" size={22} color={t.colors.ink} />
      </Pressable>
      <Text accessibilityRole="header" style={[s.title, { color: t.colors.ink, fontFamily: t.fonts.display }]}>
        {title}
      </Text>
      {right}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  back: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontSize: 28, lineHeight: 34 },
});
