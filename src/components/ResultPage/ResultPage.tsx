import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export type ResultStatus = "success" | "info" | "warning" | "error" | "404" | "500";

export interface ResultPageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  status?: ResultStatus;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Override the status icon. */
  icon?: IconName;
  /** Action buttons / links. */
  actions?: React.ReactNode;
  /** Extra detail block (e.g. an error code or support info). */
  extra?: React.ReactNode;
}

const STATUS_ICON: Record<ResultStatus, IconName> = {
  success: "checkCircle",
  info: "infoCircle",
  warning: "warning",
  error: "alert",
  "404": "search",
  "500": "shieldAlert",
};

const STATUS_TITLE: Record<ResultStatus, string> = {
  success: "Success",
  info: "Info",
  warning: "Warning",
  error: "Error",
  "404": "Page not found",
  "500": "Server error",
};

/** Centered result/status screen for success, empty, 404 and 500 states. */
export const ResultPage = React.forwardRef<HTMLDivElement, ResultPageProps>(function ResultPage(
  { status = "info", title, subtitle, icon, actions, extra, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-ResultPage", className)} data-status={status} {...rest}>
      <span className="msr-ResultPage__icon" aria-hidden="true">
        <Icon name={icon ?? STATUS_ICON[status]} size={40} />
      </span>
      <h1 className="msr-ResultPage__title">{title ?? STATUS_TITLE[status]}</h1>
      {subtitle && <p className="msr-ResultPage__subtitle">{subtitle}</p>}
      {extra && <div className="msr-ResultPage__extra">{extra}</div>}
      {actions && <div className="msr-ResultPage__actions">{actions}</div>}
    </div>
  );
});
