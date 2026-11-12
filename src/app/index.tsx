import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { emptyProgress, sceneStatus } from "@/engine/progress";
import { scenesNl } from "@/scenes";
import { nl as theme } from "@/themes/nl";

/**
 * Temporary scene list so the app runs on a device while the engine is built.
 * Replaced by the illustrated map ("Kaart") in the screens milestone.
 */
export default function ScenesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Waar ga je vandaag heen?</Text>
        {scenesNl.map((scene) => {
          const status = sceneStatus(scenesNl, emptyProgress, scene.id);
          return (
            <View
              key={scene.id}
              style={[styles.card, status === "locked" && styles.locked]}
              accessibilityLabel={`${scene.scenario.title}, ${scene.role.title}`}
            >
              <Text style={styles.scenario}>{scene.scenario.title}</Text>
              <Text style={styles.role}>{scene.role.title}</Text>
              {status === "locked" && (
                <Text style={styles.hint}>Voltooi eerst de vorige scène.</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.paper },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 32, fontWeight: "800", color: theme.colors.ink, marginBottom: 8 },
  card: { backgroundColor: theme.colors.card, borderRadius: 24, padding: 18 },
  locked: { opacity: 0.55 },
  scenario: { fontSize: 13, fontWeight: "700", color: theme.colors.primaryDark },
  role: { fontSize: 22, fontWeight: "800", color: theme.colors.ink, marginTop: 2 },
  hint: { fontSize: 14, color: theme.colors.inkMuted, marginTop: 6 },
});
