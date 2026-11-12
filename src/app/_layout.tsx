import { Stack } from "expo-router";

import { nl as theme } from "@/themes/nl";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.paper },
      }}
    />
  );
}
