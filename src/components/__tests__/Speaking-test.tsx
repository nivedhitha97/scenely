import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as Speech from "expo-speech";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { koffiebarKlant } from "@/scenes/nl/koffiebar-klant";
import { clearVoiceCache } from "@/services/speech";
import { ScenePlayer } from "../ScenePlayer";

jest.mock("expo-speech", () => ({
  VoiceQuality: { Default: "Default", Enhanced: "Enhanced" },
  getAvailableVoicesAsync: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
}));

// A fake recognizer: the test plays the part of the phone's speech recognition.
type Listener = (e: unknown) => void;
const mockListeners = new Map<string, Set<Listener>>();
const mockPermission = { granted: true, canAskAgain: true };
jest.mock("expo-speech-recognition", () => ({
  ExpoSpeechRecognitionModule: {
    isRecognitionAvailable: () => true,
    supportsOnDeviceRecognition: () => true,
    getPermissionsAsync: jest.fn(async () => mockPermission),
    requestPermissionsAsync: jest.fn(async () => ({ granted: true, canAskAgain: true })),
    addListener: (name: string, fn: Listener) => {
      if (!mockListeners.has(name)) mockListeners.set(name, new Set());
      mockListeners.get(name)!.add(fn);
      return { remove: () => mockListeners.get(name)!.delete(fn) };
    },
    start: jest.fn(),
    stop: jest.fn(),
  },
}));
const emit = (name: string, e: unknown = null) => [...(mockListeners.get(name) ?? [])].forEach((fn) => fn(e));
const hear = async (transcript: string) => {
  await act(async () => {
    emit("result", { isFinal: true, results: [{ transcript, confidence: 0.9, segments: [] }] });
    emit("end");
  });
};

const press = (name: string) => fireEvent.press(screen.getByRole("button", { name }));

async function answerFirstQuestion() {
  await render(
    <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } }}>
      <ScenePlayer scene={koffiebarKlant} onClose={jest.fn()} onFinish={jest.fn()} />
    </SafeAreaProvider>,
  );
  await act(async () => {});
  await press("Een koffie, alstublieft.");
}

describe("speaking exercise", () => {
  beforeEach(() => {
    mockListeners.clear();
    clearVoiceCache();
    mockPermission.granted = true;
    jest.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([
      { identifier: "nl-voice", language: "nl-NL", name: "Xander", quality: Speech.VoiceQuality.Default },
    ]);
  });

  it("offers to say a right answer out loud, and praises a complete sentence", async () => {
    await answerFirstQuestion();
    expect(screen.getByText("Verder zonder spreken")).toBeOnTheScreen();
    await press("Zeg het hardop");
    expect(await screen.findByText("ZEG HET HARDOP")).toBeOnTheScreen();

    await press("Tik en spreek");
    expect(screen.getByText("Ik luister…")).toBeOnTheScreen();
    await hear("een koffie alstublieft");
    expect(screen.getByText("GOED VERSTAAN")).toBeOnTheScreen();

    await press("Verder");
    expect(await screen.findByText("Met melk of zwart?")).toBeOnTheScreen();
  });

  it("points at the missed word and lets the learner try again or go on", async () => {
    await answerFirstQuestion();
    await press("Zeg het hardop");
    await screen.findByText("ZEG HET HARDOP");
    await press("Tik en spreek");
    await hear("een koffie");
    expect(screen.getByText("BIJNA! LET OP DIT WOORD")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "„alstublieft” · langzaam" })).toBeOnTheScreen();

    await press("Probeer opnieuw");
    expect(screen.getByText("Ik luister…")).toBeOnTheScreen();
    await hear("een koffie alstublieft");
    expect(screen.getByText("GOED VERSTAAN")).toBeOnTheScreen();
  });

  it("asks for the microphone first when access was never asked", async () => {
    mockPermission.granted = false;
    await answerFirstQuestion();
    await press("Zeg het hardop");
    expect(await screen.findByText("Microfoon aanzetten")).toBeOnTheScreen();
    await press("Microfoon aanzetten");
    expect(await screen.findByText("ZEG HET HARDOP")).toBeOnTheScreen();
  });
});
