import { bareWord, bestMatch, matchWords, sameWord, tokens, verdict } from "../speaking";

const states = (sentence: string, heard: string, final = true) => matchWords(sentence, heard, final).map((m) => m.state);

describe("speaking", () => {
  it("normalises punctuation, case, accents and amounts", () => {
    expect(tokens("Een koffie, alstublieft.")).toEqual(["een", "koffie", "alstublieft"]);
    expect(tokens("Dat is €2,50.")).toEqual(["dat", "is", "2", "50"]);
    expect(tokens("Patiënt")).toEqual(["patient"]);
  });

  it("forgives small slips in longer words only", () => {
    expect(sameWord("koffie", "kofie")).toBe(true);
    expect(sameWord("alstublieft", "alstubliefd")).toBe(true);
    expect(sameWord("een", "en")).toBe(false);
    expect(sameWord("zwart", "zwaar")).toBe(false);
  });

  it("marks every word heard when the whole sentence was said", () => {
    expect(states("Een koffie, alstublieft.", "een koffie alstublieft")).toEqual(["ok", "ok", "ok"]);
    expect(verdict(matchWords("Een koffie, alstublieft.", "Een koffie alstublieft", true))).toEqual({ kind: "good" });
  });

  it("shows words not heard yet as waiting while listening, and as missed at the end", () => {
    expect(states("Een koffie, alstublieft.", "een koffie", false)).toEqual(["ok", "ok", "wait"]);
    expect(states("Een koffie, alstublieft.", "een koffie", true)).toEqual(["ok", "ok", "miss"]);
    expect(verdict(matchWords("Een koffie, alstublieft.", "een koffie", true))).toEqual({ kind: "almost", missed: ["alstublieft."] });
  });

  it("needs the words in order", () => {
    expect(states("Met melk of zwart?", "zwart of met melk")).toEqual(["ok", "ok", "miss", "miss"]);
  });

  it("matches amounts written with a euro sign", () => {
    expect(states("Dat is €2,50.", "dat is 2,50 euro")).toEqual(["ok", "ok", "ok"]);
    expect(states("Dat is €2,50.", "dat is twee euro vijftig")).toEqual(["ok", "ok", "miss"]);
  });

  it("picks the recognizer alternative that heard the most words", () => {
    const m = bestMatch("Zwart, alstublieft.", ["zwaar als je wil", "zwart alstublieft"], true);
    expect(m.map((x) => x.state)).toEqual(["ok", "ok"]);
  });

  it("strips punctuation from a word for quoting", () => {
    expect(bareWord("alstublieft.")).toBe("alstublieft");
    expect(bareWord("“Zwart,")).toBe("Zwart");
    expect(bareWord("€2,50.")).toBe("€2,50");
  });
});
