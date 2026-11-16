import { VoiceQuality } from "expo-speech";

import { pickVoice } from "../speech";

const v = (identifier: string, language: string, quality = VoiceQuality.Default) => ({
  identifier,
  language,
  name: identifier,
  quality,
});

describe("pickVoice", () => {
  it("only uses Netherlands Dutch, never Flemish", () => {
    expect(pickVoice([v("be", "nl-BE"), v("en", "en-US")], "nl-NL")).toBeUndefined();
    expect(pickVoice([v("be", "nl-BE"), v("nl", "nl-NL")], "nl-NL")?.identifier).toBe("nl");
  });

  it("accepts Android-style language tags", () => {
    expect(pickVoice([v("nl-nl-x-lfs-local", "nl_NL")], "nl-NL")?.identifier).toBe("nl-nl-x-lfs-local");
  });

  it("prefers enhanced, premium and network voices", () => {
    const voices = [
      v("com.apple.voice.compact.nl-NL.Xander", "nl-NL"),
      v("com.apple.voice.enhanced.nl-NL.Claire", "nl-NL", VoiceQuality.Enhanced),
    ];
    expect(pickVoice(voices, "nl-NL")?.identifier).toBe("com.apple.voice.enhanced.nl-NL.Claire");

    const android = [v("nl-nl-x-lfs-local", "nl-NL"), v("nl-nl-x-lfs-network", "nl-NL")];
    expect(pickVoice(android, "nl-NL")?.identifier).toBe("nl-nl-x-lfs-network");
  });
});
