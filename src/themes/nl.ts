import type { Theme } from "./types";

/**
 * Visual design blueprint (v7): one calm palette and Nunito for every language; only the
 * content and illustrations change per country.
 */
export const nl: Theme = {
  id: "nl",
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
