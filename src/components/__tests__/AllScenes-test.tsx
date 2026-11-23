import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as Speech from "expo-speech";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type { Scene } from "@/engine/types";
import { scenesNl } from "@/scenes";
import { clearVoiceCache } from "@/services/speech";
import { ScenePlayer } from "../ScenePlayer";

jest.mock("expo-speech", () => ({
  VoiceQuality: { Default: "Default", Enhanced: "Enhanced" },
  getAvailableVoicesAsync: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
}));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

/** The labels of the first right answer on each player turn, following the path a learner takes. */
function rightAnswers(scene: Scene): { labels: string[]; end: string } {
  const labels: string[] = [];
  let id = scene.start;
  for (;;) {
    const turn = scene.turns[id];
    if (turn.kind === "end") return { labels, end: turn.text };
    if (turn.kind === "npc") id = turn.next;
    else {
      const right = turn.choices.find((c) => c.correct)!;
      labels.push(right.label);
      id = right.next;
    }
  }
}

describe("every scene can be played to the end", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearVoiceCache();
    jest.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([
      { identifier: "nl-voice", language: "nl-NL", name: "Xander", quality: Speech.VoiceQuality.Default },
    ]);
  });

  it.each(scenesNl.map((s) => [s.id, s] as const))("%s", async (_id, scene) => {
    const { labels, end } = rightAnswers(scene);
    const onFinish = jest.fn();
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <ScenePlayer scene={scene} onClose={jest.fn()} onFinish={onFinish} />
      </SafeAreaProvider>,
    );
    await act(async () => {});
    for (const label of labels) {
      // NPC lines that follow each other need a tap on "Verder" before the answers show.
      for (let tries = 0; tries < 3 && !screen.queryByRole("button", { name: label }); tries++) {
        await fireEvent.press(screen.getByRole("button", { name: "Verder" }));
        await act(async () => {});
      }
      await fireEvent.press(screen.getByRole("button", { name: label }));
      await act(async () => {});
      await fireEvent.press(screen.getByRole("button", { name: "Verder" }));
      await act(async () => {});
    }
    expect(screen.getByText(end)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Klaar" }));
    expect(onFinish).toHaveBeenCalled();
  });

  it("uses a drawn place and person for every scene", () => {
    const { PEOPLE, SETTINGS } = jest.requireActual("../CafeScene");
    for (const s of scenesNl) {
      // The café scenes predate the setting list; anything unknown is drawn as the café.
      if (s.scenario.id !== "koffiebar") expect(SETTINGS).toContain(s.background);
      expect(PEOPLE).toContain(s.character);
    }
  });
});
