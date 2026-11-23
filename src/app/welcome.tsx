import { Redirect, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { AVATAR_LOOKS } from "@/components/avatar/looks";
import { Button } from "@/components/Button";
import { Cyclist } from "@/components/map/Cyclist";
import { useAuth, type AuthError } from "@/hooks/useAuth";
import { useTheme } from "@/themes";

const MESSAGES: Record<AuthError, string> = {
  cancelled: "",
  unavailable: "Inloggen met Google werkt nog niet in deze testversie. Begin zonder account; je kunt later inloggen.",
  network: "Geen internet. Probeer het opnieuw of begin zonder account.",
  "recent-login": "Log opnieuw in en probeer het nog eens.",
  unknown: "Inloggen is niet gelukt. Probeer het opnieuw.",
};

/** The Google "G", for the sign-in button (Google's sign-in branding). */
function GoogleG() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48" accessibilityElementsHidden importantForAccessibility="no">
      <Path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z" />
      <Path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C.9 16.6 0 20.2 0 24s.9 7.4 2.6 10.7l7.9-6.1z" />
      <Path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
    </Svg>
  );
}

/** First screen: what Scenely is, then sign in with Google or start without an account. */
export default function WelcomeScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (auth.ready && auth.welcomed) return <Redirect href="/" />;

  const signIn = async () => {
    setMessage(null);
    setBusy(true);
    const error = await auth.signIn();
    setBusy(false);
    if (error === null) router.replace("/");
    else if (error !== "cancelled") setMessage(MESSAGES[error]);
  };

  const skip = () => {
    auth.continueWithoutAccount();
    router.replace("/");
  };

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}>
      <View style={s.stage} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[s.sky, { backgroundColor: t.scheme === "dark" ? "#22403F" : "#CFE6F0" }]} />
        <View style={s.houses}>
          {([["#A65E46", 92, 14], ["#C9974B", 112, 48], ["#3F6156", 98, 48], ["#D98C7A", 106, 14], ["#E8C35B", 88, 14]] as const).map(([c, h, top], i) => (
            <View key={i} style={[s.house, { backgroundColor: c, height: h, borderTopLeftRadius: top, borderTopRightRadius: top }]}>
              <View style={s.windows}>
                <View style={s.window} />
                <View style={s.window} />
              </View>
            </View>
          ))}
        </View>
        <View style={s.street} />
        <View style={s.canal} />
        <View style={s.rider}>
          <Cyclist look={AVATAR_LOOKS[1]} />
        </View>
      </View>

      <View style={s.copy}>
        <Text accessibilityRole="header" style={[s.brand, { color: t.colors.ink, fontFamily: "Nunito_900Black" }]}>
          Scenely
        </Text>
        <Text style={[s.lead, { color: t.colors.ink, fontFamily: t.fonts.display }]}>Leer Nederlands in echte situaties.</Text>
        <Text style={[s.body, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>
          Bestel een koffie, doe boodschappen en fiets door de stad. Alles in het Nederlands.
        </Text>
      </View>

      <View style={s.actions}>
        <Pressable
          onPress={signIn}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Doorgaan met Google"
          style={({ pressed }) => [s.google, { backgroundColor: t.colors.card, borderColor: t.colors.line, opacity: pressed || busy ? 0.75 : 1 }]}
        >
          {busy ? <ActivityIndicator color={t.colors.ink} /> : <GoogleG />}
          <Text style={[s.googleText, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>Doorgaan met Google</Text>
        </Pressable>
        <Button label="Zonder account beginnen" onPress={skip} variant="text" />
        {message ? (
          <Text accessibilityRole="alert" style={[s.note, { color: t.colors.primaryDark, backgroundColor: t.colors.primarySoft, fontFamily: t.fonts.bodyBold }]}>
            {message}
          </Text>
        ) : (
          <Text style={[s.small, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>
            Met een account blijft je voortgang bewaard, ook op een nieuwe telefoon.
          </Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20, justifyContent: "space-between" },
  stage: { height: 260, borderRadius: 28, overflow: "hidden" },
  sky: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 },
  houses: { position: "absolute", left: 14, right: 14, bottom: 74, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  house: { width: "18%", paddingTop: 14, alignItems: "center", borderWidth: 2, borderColor: "#4A3426", borderBottomWidth: 0 },
  windows: { flexDirection: "row", gap: 6 },
  window: { width: 12, height: 16, backgroundColor: "#FBF4E8", borderWidth: 1.5, borderColor: "#4A3426" },
  street: { position: "absolute", left: 0, right: 0, bottom: 44, height: 30, backgroundColor: "#EADBB9" },
  canal: { position: "absolute", left: 0, right: 0, bottom: 0, height: 44, backgroundColor: "#6CB2DC" },
  rider: { position: "absolute", left: "50%", bottom: 40, marginLeft: -68, transform: [{ scale: 2 }], transformOrigin: "bottom" },
  copy: { gap: 8 },
  brand: { fontSize: 44, lineHeight: 50 },
  lead: { fontSize: 22, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 23 },
  actions: { gap: 6 },
  google: { height: 54, borderRadius: 14, borderWidth: 1.5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  googleText: { fontSize: 16 },
  small: { fontSize: 13, textAlign: "center", paddingHorizontal: 12 },
  note: { fontSize: 13, padding: 12, borderRadius: 12, overflow: "hidden", textAlign: "center" },
});
