import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import { Completion } from "@/components/Completion";
import { decodeResult } from "@/engine/result";
import { sceneSummary } from "@/engine/summary";
import { useVoice } from "@/hooks/useVoice";
import { findScene } from "@/scenes";
import { canListen } from "@/services/listening";
import { speak, stopSpeaking } from "@/services/speech";

/** "Goed gedaan!" after a scene. The scene screen opens it with the play-through in the route params. */
export default function DoneScreen() {
  const params = useLocalSearchParams<{ id: string; badge?: string; answers?: string; spoken?: string }>();
  const scene = params.id ? findScene(params.id) : undefined;
  const result = useMemo(() => decodeResult(params), [params]);
  const voice = useVoice(scene?.language ?? "nl-NL");
  const [showSpoken] = useState(canListen);

  const summary = useMemo(
    () => (scene && result ? sceneSummary(scene, result.answers, result.spoken) : null),
    [scene, result],
  );

  useEffect(() => stopSpeaking, []);

  // Opened without a play-through (e.g. a reload on the web): there is nothing to show.
  if (!scene || !result || !summary) return <Redirect href="/" />;

  const home = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <Completion
      scene={scene}
      summary={summary}
      badgeEarned={result.badgeEarned}
      showSpoken={showSpoken || summary.spokenAloud > 0}
      canPlay={voice.status === "ready"}
      onPlay={(text) => {
        if (voice.status === "ready") void speak(text, { language: scene.language, voice: voice.voice });
      }}
      onBack={home}
      onReplay={() => router.replace({ pathname: "/scene/[id]", params: { id: scene.id } })}
    />
  );
}
