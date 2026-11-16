import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as Speech from "expo-speech";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { supermarktKassa } from "@/scenes/nl/supermarkt-kassa";
import { supermarktKlant } from "@/scenes/nl/supermarkt-klant";
import { clearVoiceCache } from "@/services/speech";
import { ScenePlayer } from "../ScenePlayer";

jest.mock("expo-speech", () => ({
  VoiceQuality: { Default: "Default", Enhanced: "Enhanced" },
  getAvailableVoicesAsync: jest.fn(),
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
}));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };
const press = (name: string) => fireEvent.press(screen.getByRole("button", { name }));

async function play(scene: typeof supermarktKlant, answers: string[]) {
  const onFinish = jest.fn();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <ScenePlayer scene={scene} onClose={jest.fn()} onFinish={onFinish} />
    </SafeAreaProvider>,
  );
  await act(async () => {});
  for (const a of answers) {
    await press(a);
    await act(async () => {});
    await press("Verder");
  }
  await press("Klaar");
  return onFinish;
}

describe("Supermarkt scenes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearVoiceCache();
    jest.mocked(Speech.getAvailableVoicesAsync).mockResolvedValue([
      { identifier: "nl-voice", language: "nl-NL", name: "Xander", quality: Speech.VoiceQuality.Default },
    ]);
  });

  it("plays the customer's side at the checkout", async () => {
    const onFinish = await play(supermarktKlant, ["Goedemiddag!", "Nee, dank u. Ik heb een tas.", "Kan ik pinnen?", "Ja, graag."]);
    expect(screen.getByText("Alstublieft. Fijne dag nog!")).toBeOnTheScreen();
    expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({ answers: { t2: "goedemiddag", t4: "eigen-tas", t6: "pinnen", t8: "bon-graag" } }));
  });

  it("plays the cashier's side", async () => {
    const onFinish = await play(supermarktKassa, ["Goedemorgen! Heeft u een tas nodig?", "Dat is dan €12,80.", "Ja hoor, dat kan.", "Ja, het is gelukt. Wilt u de bon?"]);
    expect(screen.getByText("Nee, dank u. Fijne dag!")).toBeOnTheScreen();
    expect(onFinish).toHaveBeenCalled();
  });
});
