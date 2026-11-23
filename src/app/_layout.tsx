import { Caveat_700Bold } from "@expo-google-fonts/caveat";
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from "@expo-google-fonts/nunito";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { StatusBar } from "expo-status-bar";

import { CloudSync } from "@/components/CloudSync";
import { AuthProvider } from "@/hooks/useAuth";
import { GameProvider } from "@/hooks/useGame";
import { SettingsProvider } from "@/hooks/useSettings";
import { useTheme } from "@/themes";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    // Hand-lettered place names on the map.
    Caveat_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // If fonts fail to load, carry on with system fonts rather than blocking the app.
  if (!loaded && !error) return null;

  // Dutch is the only language so far; its progress is saved under "nl-NL".
  return (
    <SettingsProvider language="nl-NL">
      <AuthProvider>
        <GameProvider language="nl-NL">
          <CloudSync />
          <AppStack />
        </GameProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

/** The screens, on the theme's background, with a status bar that suits light or dark. */
function AppStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.paper } }} />
    </>
  );
}
