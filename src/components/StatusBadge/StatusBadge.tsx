import * as React from "react";
import { cx } from "../../lib/cx";

export type BadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "muted"
  | "processing"
  | "new";
export type BadgeVariant = "soft" | "solid" | "outline";
export type BadgeSize = "sm" | "md";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** Show a leading status dot. `processing` pulses automatically. */
  dot?: boolean;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  function StatusBadge(
    {
      tone = "muted",
      variant = "soft",
      size = "md",
      dot = false,
      icon,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={cx("msr-StatusBadge", className)}
        data-tone={tone}
        data-variant={variant}
        data-size={size}
        {...rest}
      >
        {dot && (
          <span
            className="msr-StatusBadge__dot"
            data-pulse={tone === "processing" || undefined}
            aria-hidden="true"
          />
        )}
        {icon && <span className="msr-StatusBadge__icon">{icon}</span>}
        {children}
      </span>
    );
  },
);
