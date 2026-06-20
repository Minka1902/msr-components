import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface AuthProvider {
  id: string;
  label: string;
  /** Registry icon name. */
  icon?: IconName;
  /** Text/emoji glyph used when no icon is supplied (e.g. brand mark). */
  glyph?: string;
  /** Brand color for the glyph. */
  color?: string;
}

export interface SocialAuthButtonsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  providers?: AuthProvider[];
  onProvider?: (provider: AuthProvider) => void;
  layout?: "stack" | "grid";
  /** Prefix label, e.g. "Continue with". */
  prefix?: string;
  disabled?: boolean;
}

const DEFAULT_PROVIDERS: AuthProvider[] = [
  { id: "google", label: "Google", glyph: "G", color: "#ea4335" },
  { id: "github", label: "GitHub", glyph: "", color: "var(--msr-color-fg)" },
  { id: "apple", label: "Apple", glyph: "", color: "var(--msr-color-fg)" },
];

/** Row/grid of social sign-in buttons. */
export const SocialAuthButtons = React.forwardRef<HTMLDivElement, SocialAuthButtonsProps>(function SocialAuthButtons(
  { providers = DEFAULT_PROVIDERS, onProvider, layout = "stack", prefix = "Continue with", disabled, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-SocialAuthButtons", className)} data-layout={layout} {...rest}>
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          className="msr-SocialAuthButtons__btn"
          disabled={disabled}
          onClick={() => onProvider?.(p)}
        >
          <span className="msr-SocialAuthButtons__icon" style={p.color ? { color: p.color } : undefined} aria-hidden="true">
            {p.icon ? <Icon name={p.icon} size={18} /> : <span className="msr-SocialAuthButtons__glyph">{p.glyph || p.label[0]}</span>}
          </span>
          <span className="msr-SocialAuthButtons__label">
            {layout === "stack" ? `${prefix} ${p.label}` : p.label}
          </span>
        </button>
      ))}
    </div>
  );
});
