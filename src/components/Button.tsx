import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "@/themes";

/** Blueprint button: 52 high, radius 14. Primary is coral; secondary is white with a line. */
export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "text";
  icon?: ReactNode;
}) {
  const t = useTheme();
  const bg = variant === "primary" ? t.colors.primary : variant === "secondary" ? t.colors.card : "transparent";
  const fg = variant === "primary" ? "#fff" : variant === "text" ? t.colors.inkMuted : t.colors.ink;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, opacity: pressed ? 0.85 : 1 }, variant === "secondary" && s.secondary]}
    >
      {icon}
      <Text style={[s.label, { color: fg, fontFamily: t.fonts.bodyBold }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  secondary: { borderWidth: 1.5, borderColor: "#EFE4D6" },
  label: { fontSize: 16 },
});
