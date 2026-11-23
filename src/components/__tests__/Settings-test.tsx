import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SettingsScreen from "@/app/settings";
import { GameProvider } from "@/hooks/useGame";
import { SettingsProvider } from "@/hooks/useSettings";

jest.mock("expo-router", () => ({ router: { back: jest.fn(), replace: jest.fn(), canGoBack: () => true } }));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

async function setup() {
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <SettingsProvider language="nl-NL">
        <GameProvider language="nl-NL">
          <SettingsScreen />
        </GameProvider>
      </SettingsProvider>
    </SafeAreaProvider>,
  );
  await act(async () => {});
}

const saved = async () => JSON.parse((await AsyncStorage.getItem("scenely/v1/settings")) ?? "{}");

describe("Settings", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("switches to dark mode and saves it", async () => {
    await setup();
    await fireEvent.press(screen.getByRole("radio", { name: "Donker" }));
    await act(async () => {});
    expect((await saved()).theme).toBe("dark");
  });

  it("turns on the daily reminder and picks a time", async () => {
    await setup();
    expect(screen.queryByText("08:00")).toBeNull();
    await fireEvent(screen.getByLabelText("Herinner me elke dag"), "valueChange", true);
    await act(async () => {});
    await fireEvent.press(screen.getByText("08:00"));
    await act(async () => {});
    expect((await saved()).reminder).toEqual({ enabled: true, hour: 8, minute: 0 });
  });

  it("turns speaking exercises off", async () => {
    await setup();
    await fireEvent(screen.getByLabelText("Spreekoefeningen"), "valueChange", false);
    await act(async () => {});
    expect((await saved()).speaking).toBe(false);
  });

  it("asks before clearing progress", async () => {
    await setup();
    await fireEvent.press(screen.getByRole("button", { name: "Voortgang wissen" }));
    expect(screen.getByText(/Je begint weer bij de koffiebar/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Annuleren" }));
    expect(screen.queryByText(/Je begint weer bij de koffiebar/)).toBeNull();
  });
});
