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

const mockedSpeech = jest.mocked(Speech);

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function renderScene() {
  const onFinish = jest.fn();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ScenePlayer scene={koffiebarKlant} onClose={jest.fn()} onFinish={onFinish} />
    </SafeAreaProvider>,
  );
  return { onFinish };
}

const press = (name: string) => fireEvent.press(screen.getByRole("button", { name }));

describe("ScenePlayer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearVoiceCache();
    mockedSpeech.getAvailableVoicesAsync.mockResolvedValue([
      { identifier: "nl-voice", language: "nl-NL", name: "Xander", quality: Speech.VoiceQuality.Default },
    ]);
  });

  it("speaks the first line in Dutch with the nl-NL voice", async () => {
    await renderScene();
    expect(await screen.findByText("Goedemorgen! Wat wilt u drinken?")).toBeOnTheScreen();
    await act(async () => {});
    expect(mockedSpeech.speak).toHaveBeenCalledWith(
      "Goedemorgen! Wat wilt u drinken?",
      expect.objectContaining({ language: "nl-NL", voice: "nl-voice", rate: 0.9 }),
    );
  });

  it("plays the whole café scene, retrying after a wrong answer", async () => {
    const { onFinish } = await renderScene();
    await act(async () => {});

    // The answers show together with the barista's question.
    expect(screen.getByText("Kies je antwoord")).toBeOnTheScreen();
    await press("Een bier, alstublieft.");
    expect(screen.getByText("Luister nog eens en probeer opnieuw.")).toBeOnTheScreen();
    await act(async () => {});
    expect(mockedSpeech.speak).toHaveBeenLastCalledWith(
      "Goedemorgen! Wat wilt u drinken?",
      expect.objectContaining({ rate: 0.75 }),
    );

    for (const answer of ["Een koffie, alstublieft.", "Zwart, alstublieft.", "Pinnen, alstublieft."]) {
      await press(answer);
      expect(screen.getByText("Goed zo!")).toBeOnTheScreen();
      await press("Verder");
    }

    expect(screen.getByText("Alstublieft! Fijne dag nog.")).toBeOnTheScreen();
    await press("Klaar");
    expect(onFinish).toHaveBeenCalledWith({ t2: 2, t4: 1, t6: 1 });
  });

  it("shows the install message and keeps the text when no Dutch voice exists", async () => {
    mockedSpeech.getAvailableVoicesAsync.mockResolvedValue([
      { identifier: "be", language: "nl-BE", name: "Ellen", quality: Speech.VoiceQuality.Default },
    ]);
    await renderScene();
    expect(
      await screen.findByText("Installeer een Nederlandse stem in de instellingen van je telefoon."),
    ).toBeOnTheScreen();
    expect(screen.getByText("Goedemorgen! Wat wilt u drinken?")).toBeOnTheScreen();
    expect(mockedSpeech.speak).not.toHaveBeenCalled();
  });
});
