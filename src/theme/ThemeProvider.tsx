import * as React from "react";
import { useMediaQuery } from "msr-hooks";
import { cx } from "../lib/cx";
import { THEMES, type ThemeName } from "./themes";

export type Density = "compact" | "comfortable" | "spacious";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: readonly ThemeName[];
  density: Density;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  /** Controlled theme. */
  theme?: ThemeName;
  /**
   * Initial theme when uncontrolled. Defaults to "light".
   * Pass "system" to follow the OS light/dark preference.
   */
  defaultTheme?: ThemeName | "system";
  /** Called whenever the theme changes. */
  onThemeChange?: (theme: ThemeName) => void;
  /** UI density; sets `data-density` and scales control sizes. */
  density?: Density;
  /**
   * Where to apply the `data-theme` attribute:
   * - "self" (default): on the wrapper element this provider renders.
   * - "documentElement": on <html>, so the whole page is themed.
   */
  target?: "self" | "documentElement";
  /** Text direction applied to the wrapper. */
  dir?: "ltr" | "rtl";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Provides the active theme to all msr-components. Sets `data-theme` (which the
 * CSS variables key off) on a wrapper element or on <html>. Works controlled or
 * uncontrolled, supports OS-driven theming via `defaultTheme="system"`, and a
 * `density` scale.
 */
export function ThemeProvider({
  theme: controlled,
  defaultTheme = "light",
  onThemeChange,
  density = "comfortable",
  target = "self",
  dir,
  className,
  style,
  children,
}: ThemeProviderProps) {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const systemTheme: ThemeName = prefersDark ? "dark" : "light";

  const [internal, setInternal] = React.useState<ThemeName>(
    defaultTheme === "system" ? systemTheme : defaultTheme,
  );
  // Track whether the user is still following the system preference.
  const [followSystem, setFollowSystem] = React.useState(defaultTheme === "system");

  const theme = controlled ?? (followSystem ? systemTheme : internal);

  const setTheme = React.useCallback(
    (next: ThemeName) => {
      setFollowSystem(false);
      if (controlled === undefined) setInternal(next);
      onThemeChange?.(next);
    },
    [controlled, onThemeChange],
  );

  React.useEffect(() => {
    if (target !== "documentElement") return;
    const el = document.documentElement;
    const prevTheme = el.getAttribute("data-theme");
    const prevDensity = el.getAttribute("data-density");
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-density", density);
    return () => {
      if (prevTheme) el.setAttribute("data-theme", prevTheme);
      else el.removeAttribute("data-theme");
      if (prevDensity) el.setAttribute("data-density", prevDensity);
      else el.removeAttribute("data-density");
    };
  }, [theme, density, target]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, themes: THEMES, density }),
    [theme, setTheme, density],
  );

  return (
    <ThemeContext.Provider value={value}>
      {target === "self" ? (
        <div
          className={cx("msr-root", className)}
          data-theme={theme}
          data-density={density}
          dir={dir}
          style={style}
        >
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
