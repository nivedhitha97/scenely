import { fireEvent, render, screen } from "@testing-library/react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { sceneSummary } from "@/engine/summary";
import { koffiebarKlant } from "@/scenes/nl/koffiebar-klant";
import { Completion } from "../Completion";

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

async function setup(overrides: Partial<Parameters<typeof Completion>[0]> = {}) {
  const props = {
    scene: koffiebarKlant,
    summary: sceneSummary(koffiebarKlant, { t2: "koffie", t4: "zwart", t6: "pinnen" }, ["t2"]),
    badgeEarned: true,
    showSpoken: true,
    canPlay: true,
    onPlay: jest.fn(),
    onBack: jest.fn(),
    onReplay: jest.fn(),
    ...overrides,
  };
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Completion {...props} />
    </SafeAreaProvider>,
  );
  return props;
}

describe("Completion", () => {
  it("shows the new badge, the counts and the practised sentences", async () => {
    await setup();
    expect(screen.getByText("Goed gedaan!")).toBeOnTheScreen();
    expect(screen.getByText(/Nieuwe badge:/)).toBeOnTheScreen();
    expect(screen.getByLabelText("4 regels gehoord")).toBeOnTheScreen();
    expect(screen.getByLabelText("3 antwoorden")).toBeOnTheScreen();
    expect(screen.getByLabelText("1 hardop gezegd")).toBeOnTheScreen();
    expect(screen.getByText("Zwart, alstublieft.")).toBeOnTheScreen();
    expect(screen.getAllByLabelText("Hardop gezegd")).toHaveLength(1);
  });

  it("says Badge instead of Nieuwe badge on a replay", async () => {
    await setup({ badgeEarned: false });
    expect(screen.queryByText(/Nieuwe badge:/)).toBeNull();
    expect(screen.getByText(/Badge:/)).toBeOnTheScreen();
  });

  it("hides the spoken count where speaking isn't available", async () => {
    await setup({ showSpoken: false });
    expect(screen.queryByLabelText(/hardop gezegd/)).toBeNull();
  });

  it("replays a sentence and offers both ways out", async () => {
    const props = await setup();
    await fireEvent.press(screen.getByRole("button", { name: "Luister: Pinnen, alstublieft." }));
    expect(props.onPlay).toHaveBeenCalledWith("Pinnen, alstublieft.");
    await fireEvent.press(screen.getByRole("button", { name: "Terug naar scènes" }));
    expect(props.onBack).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("button", { name: "Opnieuw spelen" }));
    expect(props.onReplay).toHaveBeenCalled();
  });
});
