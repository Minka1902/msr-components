import { useThemeContext } from "./ThemeProvider";
import { THEMES, type ThemeName } from "./themes";

export interface UseThemeResult {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: readonly ThemeName[];
}

/**
 * Read and update the active theme. Must be used within a `ThemeProvider`;
 * throws otherwise so misuse is caught early.
 */
export function useTheme(): UseThemeResult {
  const ctx = useThemeContext();
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return ctx;
}

export { THEMES };
export type { ThemeName };
