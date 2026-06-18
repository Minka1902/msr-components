import * as React from "react";
import { cx } from "../../lib/cx";
import { useThemeContext } from "../../theme/ThemeProvider";
import type { ThemeName } from "../../theme/themes";

export interface AnimatedThemeToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Controlled dark state. If omitted, uses the ThemeProvider context. */
  dark?: boolean;
  onToggle?: (dark: boolean) => void;
  /** The (light, dark) theme names to switch between when using the provider. */
  themes?: [ThemeName, ThemeName];
}

/** Sun↔moon toggle that animates between light and dark. */
export const AnimatedThemeToggle = React.forwardRef<HTMLButtonElement, AnimatedThemeToggleProps>(
  function AnimatedThemeToggle(
    { dark, onToggle, themes = ["light", "dark"], className, ...rest },
    ref,
  ) {
    const ctx = useThemeContext();
    const isControlled = dark !== undefined;
    const isDark = isControlled ? dark : ctx ? ctx.theme === themes[1] : false;

    const toggle = () => {
      const next = !isDark;
      onToggle?.(next);
      if (!isControlled && ctx) ctx.setTheme(next ? themes[1] : themes[0]);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cx("msr-ThemeToggle", className)}
        data-dark={isDark || undefined}
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        onClick={toggle}
        {...rest}
      >
        <span className="msr-ThemeToggle__orb" aria-hidden="true" />
        <span className="msr-ThemeToggle__rays" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="msr-ThemeToggle__ray" style={{ ["--ray" as string]: i }} />
          ))}
        </span>
      </button>
    );
  },
);
