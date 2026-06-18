/** The 15 built-in theme names. Each maps to a [data-theme] block in the CSS. */
export const THEMES = [
  "light",
  "dark",
  "midnight",
  "slate",
  "sand",
  "ocean",
  "forest",
  "sunset",
  "rose",
  "grape",
  "nord",
  "dracula",
  "solarized",
  "mono",
  "contrast",
] as const;

export type ThemeName = (typeof THEMES)[number];

/** Themes whose base background is light (useful for previews/affordances). */
export const LIGHT_THEMES: ThemeName[] = [
  "light",
  "sand",
  "rose",
  "solarized",
  "mono",
  "contrast",
];
