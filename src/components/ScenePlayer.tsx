import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Scene } from "@/engine/types";
import { useScene } from "@/hooks/useScene";
import { useSettings } from "@/hooks/useSettings";
import { useSpeaking } from "@/hooks/useSpeaking";
import { askMicPermission, canListen, micPermission } from "@/services/listening";
import { useTheme } from "@/themes";
import { AnswerCard, type AnswerState } from "./AnswerCard";
import { Button } from "./Button";
import { CAFE_HEIGHT, CAFE_WIDTH, CafeScene, PEOPLE, SETTINGS, type Mood, type Person, type Setting } from "./CafeScene";
import { Icon } from "./Icon";
import { MicPermission } from "./MicPermission";
import { SpeakActions, SpeakCard } from "./SpeakPanel";

const SHADOW = { shadowColor: "#293B3A", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 4 } as const;

type SpeakMode = "off" | "permission" | "speak";

/**
 * Plays one scene (v7 design): top bar with progress, the café in a frame, the other person's
 * line in a card, then answer cards. Wrong answers shake and the line is repeated slowly;
 * a right answer turns teal; then the learner can say the sentence out loud ("Zeg het hardop")
 * or go on without speaking. Speaking is only offered where speech recognition works
 * (a development build or a browser, not Expo Go).
 */
/** The other person in the picture: the scene's `character`, or a customer if it is unknown. */
function personFor(scene: Scene): Person {
  return (PEOPLE as readonly string[]).includes(scene.character) ? (scene.character as Person) : "klant";
}

/** Where the picture is set: the scene's `background`, or the café. */
function settingFor(scene: Scene): Setting {
  return (SETTINGS as readonly string[]).includes(scene.background) ? (scene.background as Setting) : "cafe";
}

/** What the scene reports when the learner taps "Klaar". */
export type SceneOutcome = {
  attempts: Record<string, number>;
  /** Correct choice id per player turn. */
  answers: Record<string, string>;
  /** Player turns whose sentence was said out loud and understood. */
  spoken: string[];
};

export function ScenePlayer({
  scene,
  onClose,
  onFinish,
}: {
  scene: Scene;
  onClose: () => void;
  onFinish: (result: SceneOutcome) => void;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { state, turn, line, choiceTurn, voiceStatus, tulips, say, sayAnswer, sayText, choose, next } = useScene(scene);
  const [speechAvailable] = useState(canListen);
  const { settings } = useSettings();
  const canSpeak = speechAvailable && settings.speaking;
  const [speakMode, setSpeakMode] = useState<SpeakMode>("off");
  const [micNote, setMicNote] = useState<string | null>(null);
  // Player turns whose sentence was said out loud and understood.
  const [spoken, setSpoken] = useState<string[]>([]);

  const reaction = state.lastReaction;
  const feedback = state.status === "feedback";
  const wrongHere = !!reaction && !reaction.correct && state.status === "playing" && reaction.turnId === choiceTurn?.id;
  const firstLine = turn.id === scene.start;
  const mood: Mood = feedback ? "happy" : wrongHere ? "puzzled" : turn.kind === "player" ? "listen" : "talk";
  const voiceMissing = voiceStatus === "missing";

  // The café keeps its 350 × 290 proportions; on short screens it is cropped from the top.
  const stageWidth = Math.min(width, 520) - 40;
  const fullHeight = (CAFE_HEIGHT * stageWidth) / CAFE_WIDTH;
  const stageHeight = height < 760 ? fullHeight * 0.78 : fullHeight;

  const answerState = (choiceId: string): AnswerState => {
    if (feedback && reaction) return reaction.choiceId === choiceId ? "correct" : "dimmed";
    if (wrongHere && reaction?.choiceId === choiceId) return "wrong";
    return "idle";
  };

  const prompt = feedback
    ? { text: "Goed zo! Zeg het mee.", colour: t.colors.correct }
    : wrongHere
      ? { text: "Luister nog eens en probeer opnieuw.", colour: t.colors.inkMuted }
      : { text: choiceTurn?.prompt ?? "Kies je antwoord", colour: t.colors.ink };

  // The sentence the learner just chose correctly: the one to say out loud.
  const spokenSentence = feedback && reaction ? choiceTurn?.choices.find((c) => c.id === reaction.choiceId)?.label : undefined;

  const continueScene = (understood = false) => {
    if (understood && reaction) setSpoken((list) => (list.includes(reaction.turnId) ? list : [...list, reaction.turnId]));
    setSpeakMode("off");
    setMicNote(null);
    next();
  };

  const sayAloud = async () => {
    setMicNote(null);
    const permission = await micPermission();
    if (permission === "granted") setSpeakMode("speak");
    else if (permission === "undetermined") setSpeakMode("permission");
    else setMicNote("Zet de microfoon voor Scenely aan in de instellingen van je telefoon.");
  };

  const allowMic = async () => {
    const ok = await askMicPermission();
    setSpeakMode(ok ? "speak" : "off");
    if (!ok) setMicNote("Zonder microfoon kun je gewoon verder met luisteren.");
  };

  let footer: { label: string; onPress: () => void } | null = null;
  if (state.status === "done") footer = { label: "Klaar", onPress: () => onFinish({ attempts: state.attempts, answers: state.answers, spoken }) };
  else if (feedback || (!choiceTurn && turn.kind === "npc")) footer = { label: "Verder", onPress: next };
  const offerSpeaking = canSpeak && feedback && !!spokenSentence;

  if (speakMode === "speak" && spokenSentence) {
    return (
      <SpeakExercise
        key={spokenSentence}
        scene={scene}
        sentence={spokenSentence}
        stageWidth={stageWidth}
        dots={tulips}
        onClose={onClose}
        onSay={sayText}
        onDone={continueScene}
      />
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top }]}>
      <TopBar scene={scene} dots={tulips} onClose={onClose} />

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <View style={s.frame}>
          <View style={s.stage}>
            <CafeScene
              width={stageWidth}
              height={stageHeight}
              person={personFor(scene)}
              setting={settingFor(scene)}
              mood={mood}
              gesture={firstLine && !wrongHere}
              tilt={wrongHere ? 3 : 0}
            />
          </View>
        </View>

        {line && (
          <View style={[s.dialog, { backgroundColor: t.colors.card }, SHADOW]}>
            <Text style={[s.speaker, { color: t.colors.inkMuted, fontFamily: t.fonts.bodyBold }]}>{line.speaker.toUpperCase()}</Text>
            <Animated.Text key={line.turnId} entering={FadeIn.duration(250)} style={[s.say, { color: t.colors.ink, fontFamily: t.fonts.display }]}>
              {line.text}
            </Animated.Text>
            <View style={s.acRow}>
              <Pressable
                onPress={() => say(false)}
                disabled={voiceMissing}
                accessibilityRole="button"
                accessibilityLabel="Luister opnieuw"
                style={[s.ac, { opacity: voiceMissing ? 0.5 : 1 }]}
              >
                <Icon name="volume" size={18} color={t.colors.ink} />
                <Text style={[s.acText, { color: t.colors.ink, fontFamily: t.fonts.bodyBold }]}>Luister opnieuw</Text>
              </Pressable>
              <Pressable
                onPress={() => say(true)}
                disabled={voiceMissing}
                accessibilityRole="button"
                accessibilityLabel="Langzaam"
                style={[s.ac, wrongHere && { backgroundColor: t.colors.primarySoft }, { opacity: voiceMissing ? 0.5 : 1 }]}
              >
                <Icon name="snail" size={18} color={wrongHere ? t.colors.primaryDark : t.colors.ink} strokeWidth={2} />
                <Text style={[s.acText, { color: wrongHere ? t.colors.primaryDark : t.colors.ink, fontFamily: t.fonts.bodyBold }]}>Langzaam</Text>
              </Pressable>
            </View>
            {voiceMissing && (
              <Text style={[s.voiceNote, { color: t.colors.primaryDark, backgroundColor: t.colors.primarySoft, fontFamily: t.fonts.bodyBold }]} accessibilityRole="alert">
                Installeer een Nederlandse stem in de instellingen van je telefoon.
              </Text>
            )}
          </View>
        )}

        {choiceTurn && (
          <>
            <View style={s.promptRow}>
              <Text style={[s.prompt, { color: prompt.colour, fontFamily: t.fonts.bodyBold }]}>{prompt.text}</Text>
              {feedback && !voiceMissing && (
                <View style={s.promptBtns}>
                  <Pressable
                    onPress={() => sayAnswer(false)}
                    accessibilityRole="button"
                    accessibilityLabel="Luister naar je antwoord"
                    style={({ pressed }) => [s.round, { backgroundColor: t.colors.correctSoft, opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Icon name="volume" size={18} color={t.colors.correct} />
                  </Pressable>
                  <Pressable
                    onPress={() => sayAnswer(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Je antwoord langzaam"
                    style={({ pressed }) => [s.round, { backgroundColor: t.colors.correctSoft, opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Icon name="snail" size={18} color={t.colors.correct} strokeWidth={2} />
                  </Pressable>
                </View>
              )}
            </View>
            <View style={s.answers}>
              {choiceTurn.choices.map((c, i) => (
                <AnswerCard
                  key={c.id}
                  index={i}
                  label={c.label}
                  icon={c.icon}
                  state={answerState(c.id)}
                  disabled={state.status === "done" || feedback}
                  onPress={() => choose(c.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {offerSpeaking ? (
        <View style={[s.footer, { paddingBottom: insets.bottom + 8 }]}>
          {micNote && <Text style={[s.micNote, { color: t.colors.primaryDark, fontFamily: t.fonts.bodyBold }]}>{micNote}</Text>}
          <Button label="Zeg het hardop" onPress={sayAloud} icon={<Icon name="mic" size={20} color="#fff" />} />
          <Button label="Verder zonder spreken" onPress={() => continueScene()} variant="text" />
        </View>
      ) : (
        footer && (
          <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Button label={footer.label} onPress={footer.onPress} />
          </View>
        )
      )}

      {speakMode === "permission" && <MicPermission onAllow={allowMic} onDecline={() => continueScene()} />}
    </View>
  );
}

/** Top bar shared by the scene and the speaking exercise. */
function TopBar({ scene, dots, onClose }: { scene: Scene; dots: { done: number; total: number }; onClose: () => void }) {
  const t = useTheme();
  return (
    <View style={s.top}>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Stoppen" style={[s.iconBtn, { backgroundColor: t.colors.card }, { backgroundColor: t.colors.card }]}>
        <Icon name="back" size={22} color={t.colors.ink} />
      </Pressable>
      <View style={s.topMid}>
        <Text style={[s.h3, { color: t.colors.ink, fontFamily: t.fonts.display }]} numberOfLines={1}>
          {scene.scenario.title}
        </Text>
        <View style={s.dots} accessibilityLabel={`${dots.done} van ${dots.total} antwoorden`}>
          {Array.from({ length: dots.total }, (_, i) => (
            <View key={i} style={[s.dot, { backgroundColor: i < dots.done ? t.colors.warm : "#E8DDCF" }]} />
          ))}
        </View>
      </View>
      <View style={[s.role, { backgroundColor: t.colors.primarySoft }]}>
        <Text style={[s.roleText, { color: t.colors.primaryDark, fontFamily: t.fonts.bodyBold }]}>{scene.role.title}</Text>
      </View>
    </View>
  );
}

/** "Zeg het hardop": the café cropped to the face, the sentence card, and the microphone. */
function SpeakExercise({
  scene,
  sentence,
  stageWidth,
  dots,
  onClose,
  onSay,
  onDone,
}: {
  scene: Scene;
  sentence: string;
  stageWidth: number;
  dots: { done: number; total: number };
  onClose: () => void;
  onSay: (text: string, slow: boolean) => void;
  /** `understood` is true when the last attempt was "Goed verstaan". */
  onDone: (understood: boolean) => void;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const speaking = useSpeaking(sentence, scene.language);
  const verdictKind = speaking.result?.kind ?? null;
  const scale = stageWidth / CAFE_WIDTH;

  return (
    <View style={[s.screen, { backgroundColor: t.colors.paper, paddingTop: insets.top }]}>
      <TopBar scene={scene} dots={dots} onClose={onClose} />
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <View style={s.frame}>
          <View style={s.stage}>
            <CafeScene
              width={stageWidth}
              height={180 * scale}
              cropTop={40 * scale}
              person={personFor(scene)}
              setting={settingFor(scene)}
              mood={verdictKind === "good" ? "happy" : "listen"}
            />
          </View>
        </View>
        <SpeakCard
          phase={speaking.phase}
          words={speaking.words}
          levels={speaking.levels}
          verdict={verdictKind}
          notice={speaking.notice}
          onSay={onSay}
        />
        {verdictKind === "almost" && (
          <Text style={[s.tapHint, { color: t.colors.inkMuted, fontFamily: t.fonts.body }]}>Tik op een woord om het te horen.</Text>
        )}
      </ScrollView>
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <SpeakActions
          phase={speaking.phase}
          verdict={verdictKind}
          onMic={speaking.phase === "listening" ? speaking.stop : speaking.start}
          onRetry={speaking.start}
          onDone={() => onDone(verdictKind === "good")}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  top: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingTop: 2, paddingBottom: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#293B3A", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  topMid: { flex: 1, alignItems: "center" },
  h3: { fontSize: 17 },
  dots: { flexDirection: "row", gap: 6, marginTop: 5 },
  dot: { width: 22, height: 6, borderRadius: 3 },
  role: { minWidth: 44, height: 28, paddingHorizontal: 10, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  roleText: { fontSize: 12 },
  frame: { marginHorizontal: 12, padding: 8, borderRadius: 24, backgroundColor: "#EFE1CF", alignSelf: "center" },
  stage: { borderRadius: 18, overflow: "hidden" },
  dialog: { marginTop: -56, marginHorizontal: 22, backgroundColor: "#fff", borderRadius: 18, paddingTop: 14, paddingHorizontal: 16, paddingBottom: 12 },
  speaker: { fontSize: 12, letterSpacing: 0.6 },
  say: { fontSize: 20, lineHeight: 26, marginTop: 2 },
  acRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  ac: { height: 40, paddingLeft: 9, paddingRight: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F7F1E8" },
  acText: { fontSize: 13 },
  voiceNote: { marginTop: 10, padding: 10, borderRadius: 12, fontSize: 13, overflow: "hidden" },
  promptRow: { flexDirection: "row", alignItems: "center", paddingRight: 20, minHeight: 44 },
  prompt: { flex: 1, fontSize: 15, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  promptBtns: { flexDirection: "row", gap: 8, paddingTop: 6 },
  round: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  answers: { paddingHorizontal: 20, gap: 10 },
  footer: { paddingHorizontal: 20, paddingTop: 10 },
  micNote: { fontSize: 13, textAlign: "center", marginBottom: 8 },
  tapHint: { fontSize: 14, textAlign: "center", marginTop: 18, paddingHorizontal: 20 },
});
