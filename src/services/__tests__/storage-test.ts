import AsyncStorage from "@react-native-async-storage/async-storage";

import { completeScene, emptyProgress } from "@/engine/progress";
import { loadAvatar, loadProgress, saveAvatar, saveProgress } from "../storage";

jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

beforeEach(() => AsyncStorage.clear());

describe("storage", () => {
  it("returns empty progress and no avatar on first launch", async () => {
    expect(await loadProgress("nl-NL")).toEqual(emptyProgress);
    expect(await loadAvatar()).toBeNull();
  });

  it("saves progress per language", async () => {
    const { progress } = completeScene(emptyProgress, "koffiebar-klant", { t2: 1 });
    await saveProgress("nl-NL", progress);
    expect(await loadProgress("nl-NL")).toEqual(progress);
    expect(await loadProgress("de-DE")).toEqual(emptyProgress);
  });

  it("saves the avatar", async () => {
    await saveAvatar({ look: 3, outfit: "#C97B57" });
    expect(await loadAvatar()).toEqual({ look: 3, outfit: "#C97B57" });
  });

  it("ignores corrupt data", async () => {
    await AsyncStorage.setItem("scenely/v1/progress/nl-NL", "{not json");
    await AsyncStorage.setItem("scenely/v1/avatar", JSON.stringify({ look: "x" }));
    expect(await loadProgress("nl-NL")).toEqual(emptyProgress);
    expect(await loadAvatar()).toBeNull();
  });
});
