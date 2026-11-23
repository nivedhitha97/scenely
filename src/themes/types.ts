/** Every language theme provides the same tokens, so layouts never change per language. */
export type Theme = {
  id: string;
  /** Light or dark variant of the same palette. */
  scheme: "light" | "dark";
  /** Theme name in the target language, e.g. "Nederland". */
  name: string;
  colors: {
    paper: string;
    card: string;
    ink: string;
    inkMuted: string;
    brand: string;
    brandSoft: string;
    primary: string;
    primaryDark: string;
    primarySoft: string;
    accent: string;
    accentSoft: string;
    correct: string;
    correctSoft: string;
    incorrect: string;
    warm: string;
    warmSoft: string;
    locked: string;
    /** Hairline borders and dividers on cards. */
    line: string;
    /** Soft fill behind small buttons and chips. */
    chip: string;
  };
  /** Font family names as registered with expo-font (see src/app/_layout.tsx). */
  fonts: {
    display: string;
    displayBold: string;
    body: string;
    bodyMedium: string;
    bodyBold: string;
    hand: string;
  };
};
