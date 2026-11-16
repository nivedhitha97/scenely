import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { GameProvider } from "@/hooks/useGame";
import { useTheme } from "@/themes";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const [loaded, error] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // If fonts fail to load, carry on with system fonts rather than blocking the app.
  if (!loaded && !error) return null;

  // Dutch is the only language so far; its progress is saved under "nl-NL".
  return (
    <GameProvider language="nl-NL">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.paper },
        }}
      />
    </GameProvider>
  );
}
