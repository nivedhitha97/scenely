import type { Theme } from "./types";

/**
 * Visual design blueprint (v7): one calm palette and Nunito for every language; only the
 * content and illustrations change per country.
 */
export const nl: Theme = {
  id: "nl",
  scheme: "light",
  name: "Nederland",
  colors: {
    paper: "#FFF8EF",
    card: "#FFFFFF",
    ink: "#293B3A",
    inkMuted: "#8B9290",
    brand: "#3D8279",
    brandSoft: "#E4F0E9",
    primary: "#F29B62",
    primaryDark: "#D97C42",
    primarySoft: "#FCE9DC",
    accent: "#3D8279",
    accentSoft: "#E4F0E9",
    correct: "#3D8279",
    correctSoft: "#E4F0E9",
    incorrect: "#F29B62",
    warm: "#EACB78",
    warmSoft: "#F6E3AE",
    locked: "#DCD7D0",
    line: "#EFE4D6",
    chip: "#F5EFE6",
  },
  fonts: {
    display: "Nunito_800ExtraBold",
    displayBold: "Nunito_800ExtraBold",
    body: "Nunito_600SemiBold",
    bodyMedium: "Nunito_600SemiBold",
    bodyBold: "Nunito_800ExtraBold",
    hand: "Nunito_800ExtraBold",
  },
};

/**
 * The same palette for dark mode: deep canal green-grey instead of cream, light text, and the
 * coral, teal and gold kept bright enough to read. Illustrations stay as drawn.
 */
export const nlDark: Theme = {
  ...nl,
  scheme: "dark",
  colors: {
    paper: "#172120",
    card: "#21302E",
    ink: "#EEF2EF",
    inkMuted: "#A3ADA9",
    brand: "#6FB5AA",
    brandSoft: "#1E3530",
    primary: "#F29B62",
    primaryDark: "#F4AE7F",
    primarySoft: "#3A2A20",
    accent: "#6FB5AA",
    accentSoft: "#1E3530",
    correct: "#6FB5AA",
    correctSoft: "#1E3530",
    incorrect: "#F29B62",
    warm: "#E5C76D",
    warmSoft: "#352F1C",
    locked: "#3A4442",
    line: "#2E3D3B",
    chip: "#2A3836",
  },
};
