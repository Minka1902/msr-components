import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export type AlertTone = "info" | "success" | "warning" | "danger" | "neutral";

const TONE_ICON: Record<AlertTone, IconName> = {
  info: "info",
  success: "checkCircle",
  warning: "warning",
  danger: "alert",
  neutral: "infoCircle",
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: React.ReactNode;
  /** Custom icon; pass `false` to hide. */
  icon?: React.ReactNode | false;
  /** Render a close button and call this when dismissed. */
  onDismiss?: () => void;
  /** Actions row (e.g. buttons) shown under the content. */
  actions?: React.ReactNode;
  variant?: "soft" | "outline";
}

/** Inline alert / callout for contextual messages. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = "info", title, icon, onDismiss, actions, variant = "soft", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cx("msr-Alert", className)}
      data-tone={tone}
      data-variant={variant}
      {...rest}
    >
      {icon !== false && (
        <span className="msr-Alert__icon">
          {icon ?? <Icon name={TONE_ICON[tone]} size={18} />}
        </span>
      )}
      <div className="msr-Alert__body">
        {title && <div className="msr-Alert__title">{title}</div>}
        {children && <div className="msr-Alert__text">{children}</div>}
        {actions && <div className="msr-Alert__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button type="button" className="msr-Alert__close" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
});

export interface BannerProps extends Omit<AlertProps, "variant"> {
  /** Stick to the top of the viewport. */
  sticky?: boolean;
}

/** Full-width banner, e.g. for page-level announcements. */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { sticky, className, ...rest },
  ref,
) {
  return (
    <Alert
      ref={ref}
      className={cx("msr-Banner", sticky && "msr-Banner--sticky", className)}
      variant="soft"
      {...rest}
    />
  );
});
