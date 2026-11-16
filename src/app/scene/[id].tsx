import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { ScenePlayer } from "@/components/ScenePlayer";
import { walkAfter } from "@/engine/places";
import { useGame } from "@/hooks/useGame";
import { findScene, scenesNl } from "@/scenes";
import { placesNl } from "@/scenes/nl/places";
import { useTheme } from "@/themes";

export default function SceneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scene = id ? findScene(id) : undefined;
  const t = useTheme();
  const game = useGame();

  if (!scene) {
    return (
      <View style={[s.missing, { backgroundColor: t.colors.paper }]}>
        <Text style={[s.text, { color: t.colors.ink, fontFamily: t.fonts.display }]}>Deze scène bestaat niet.</Text>
        <Button label="Terug" onPress={() => router.back()} />
      </View>
    );
  }

  // Saves the completion. If it finished a place, the map plays the walk to the next place.
  // The "Gelukt!" screen arrives later.
  const finish = (attempts: Record<string, number>) => {
    const { before, after } = game.recordCompletion(scene.id, attempts);
    const walk = walkAfter(placesNl, scenesNl, before, after);
    if (walk) game.setPendingWalk({ from: walk.from.id, to: walk.to.id });
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return <ScenePlayer key={scene.id} scene={scene} onClose={() => router.back()} onFinish={finish} />;
}

const s = StyleSheet.create({
  missing: { flex: 1, justifyContent: "center", padding: 24, gap: 20 },
  text: { fontSize: 26, textAlign: "center" },
});
