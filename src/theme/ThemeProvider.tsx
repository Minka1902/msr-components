import * as React from "react";
import { cx } from "../lib/cx";
import { THEMES, type ThemeName } from "./themes";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: readonly ThemeName[];
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  /** Controlled theme. */
  theme?: ThemeName;
  /** Initial theme when uncontrolled. Defaults to "light". */
  defaultTheme?: ThemeName;
  /** Called whenever the theme changes. */
  onThemeChange?: (theme: ThemeName) => void;
  /**
   * Where to apply the `data-theme` attribute:
   * - "self" (default): on the wrapper element this provider renders.
   * - "documentElement": on <html>, so the whole page is themed.
   */
  target?: "self" | "documentElement";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Provides the active theme to all msr-components. Sets `data-theme` (which the
 * CSS variables key off) on a wrapper element or on <html>. Works controlled or
 * uncontrolled.
 */
export function ThemeProvider({
  theme: controlled,
  defaultTheme = "light",
  onThemeChange,
  target = "self",
  className,
  style,
  children,
}: ThemeProviderProps) {
  const [internal, setInternal] = React.useState<ThemeName>(defaultTheme);
  const theme = controlled ?? internal;

  const setTheme = React.useCallback(
    (next: ThemeName) => {
      if (controlled === undefined) setInternal(next);
      onThemeChange?.(next);
    },
    [controlled, onThemeChange],
  );

  React.useEffect(() => {
    if (target !== "documentElement") return;
    const el = document.documentElement;
    const prev = el.getAttribute("data-theme");
    el.setAttribute("data-theme", theme);
    return () => {
      if (prev) el.setAttribute("data-theme", prev);
      else el.removeAttribute("data-theme");
    };
  }, [theme, target]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, themes: THEMES }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {target === "self" ? (
        <div className={cx("msr-root", className)} data-theme={theme} style={style}>
          {children}
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue | null {
  return React.useContext(ThemeContext);
}
