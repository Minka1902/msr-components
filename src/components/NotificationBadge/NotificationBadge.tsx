import * as React from "react";
import { cx } from "../../lib/cx";

export interface NotificationBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Numeric count. Hidden at 0 unless `showZero`. */
  count?: number;
  /** Render a small dot instead of a number. */
  dot?: boolean;
  /** Cap the displayed number, e.g. 99 → "99+". */
  max?: number;
  showZero?: boolean;
  tone?: "danger" | "primary" | "success" | "warning" | "neutral";
  /** Corner to pin the badge to. */
  placement?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Element the badge is attached to. Omit to render the badge standalone. */
  children?: React.ReactNode;
}

/** Count/dot badge overlaid on the corner of an element (bell, avatar, tab…). */
export const NotificationBadge = React.forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  function NotificationBadge(
    { count = 0, dot = false, max = 99, showZero = false, tone = "danger", placement = "top-right", children, className, ...rest },
    ref,
  ) {
    const visible = dot || count > 0 || (count === 0 && showZero);
    const label = count > max ? `${max}+` : String(count);

    const badge = visible ? (
      <span
        className={cx("msr-NotificationBadge__badge", dot && "msr-NotificationBadge__badge--dot")}
        data-tone={tone}
        aria-label={dot ? "New" : `${count} notifications`}
      >
        {!dot && label}
      </span>
    ) : null;

    if (children === undefined) {
      return (
        <span ref={ref} className={cx("msr-NotificationBadge", className)} {...rest}>
          {badge}
        </span>
      );
    }

    return (
      <span ref={ref} className={cx("msr-NotificationBadge", "msr-NotificationBadge--anchored", className)} data-placement={placement} {...rest}>
        {children}
        {badge}
      </span>
    );
  },
);
