/** How a full-body figure is drawn. Shared by the learner's avatar and the people in each place. */
export type FigureLook = {
  skin: string;
  hair: string;
  hairStyle: "short" | "long" | "curly" | "bun" | "cap" | "straw" | "volendam";
  top: string;
  bottom: string;
  shoes?: string;
  acc?: Accessory[];
};

export type Accessory =
  | "tote" | "scarf" | "glasses" | "backpack" | "apron" | "cup" | "coat" | "steth" | "clipboard"
  | "scrubs" | "lanyard" | "tape" | "tie" | "cheese" | "skirt" | "stripedApron" | "whiteBlouse" | "tulips";

/** The six looks the learner picks from. Different skin tones, hair and everyday Dutch clothes. */
export const AVATAR_LOOKS: FigureLook[] = [
  { hairStyle: "short", hair: "#3B2E2A", skin: "#E8B996", top: "#3F5F55", bottom: "#3E5A64", acc: ["tote"] },
  { hairStyle: "curly", hair: "#2E3440", skin: "#8C5A3C", top: "#E8C25A", bottom: "#3E5A64", acc: ["scarf"] },
  { hairStyle: "long", hair: "#B07A4A", skin: "#F0C9A8", top: "#C97B57", bottom: "#4A4A48" },
  { hairStyle: "bun", hair: "#1F1A17", skin: "#C98E6A", top: "#7FA6C2", bottom: "#3E5A64", acc: ["glasses"] },
  { hairStyle: "short", hair: "#C9C3BA", skin: "#E8B996", top: "#D98C7A", bottom: "#4A5A60", acc: ["glasses"] },
  { hairStyle: "long", hair: "#2E3440", skin: "#B98263", top: "#3F5F55", bottom: "#C9B79C", acc: ["backpack"] },
];

export const OUTFIT_COLOURS = ["#E8C25A", "#C97B57", "#3F5F55", "#7FA6C2", "#D98C7A", "#4A4A48"];

/** The look for a saved choice, with the chosen clothing colour. Falls back to the first look. */
export function lookFor(choice: { look: number; outfit: string }): FigureLook {
  const base = AVATAR_LOOKS[choice.look] ?? AVATAR_LOOKS[0];
  return { ...base, top: choice.outfit };
}
