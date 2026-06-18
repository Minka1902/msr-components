import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import type { ThemeName } from "../../theme/themes";

export interface ThemePreviewCardProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Theme this card previews. */
  theme: ThemeName;
  /** Human label (defaults to a capitalized theme name). */
  label?: string;
  /** Whether this theme is currently active. */
  selected?: boolean;
  onSelect?: (theme: ThemeName) => void;
}

/**
 * A selectable swatch card that previews a theme by rendering miniature themed
 * surface/text/accent tokens inside a `[data-theme]` scope.
 */
export const ThemePreviewCard = React.forwardRef<
  HTMLButtonElement,
  ThemePreviewCardProps
>(function ThemePreviewCard(
  { theme, label, selected = false, onSelect, className, ...rest },
  ref,
) {
  const name = label ?? theme.charAt(0).toUpperCase() + theme.slice(1);
  return (
    <button
      ref={ref}
      type="button"
      className={cx("msr-ThemePreview", className)}
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={() => onSelect?.(theme)}
      {...rest}
    >
      <span className="msr-ThemePreview__swatch" data-theme={theme} aria-hidden="true">
        <span className="msr-ThemePreview__bar msr-ThemePreview__bar--title" />
        <span className="msr-ThemePreview__bar msr-ThemePreview__bar--text" />
        <span className="msr-ThemePreview__chips">
          <span className="msr-ThemePreview__chip msr-ThemePreview__chip--primary" />
          <span className="msr-ThemePreview__chip msr-ThemePreview__chip--surface" />
        </span>
      </span>
      <span className="msr-ThemePreview__label">
        {name}
        {selected && <Icon name="check" size={14} />}
      </span>
    </button>
  );
});
