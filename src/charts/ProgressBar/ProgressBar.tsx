import * as React from "react";
import { cx } from "../../lib/cx";

export type ProgressTone = "primary" | "success" | "warning" | "danger";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit (or null) for an indeterminate bar. */
  value?: number | null;
  tone?: ProgressTone;
  size?: "sm" | "md";
  /** Show the percentage label on the right. */
  showValue?: boolean;
}

const TONE: Record<ProgressTone, string> = {
  primary: "var(--msr-color-primary)",
  success: "var(--msr-tone-success-fg)",
  warning: "var(--msr-tone-warning-fg)",
  danger: "var(--msr-tone-danger-fg)",
};

/** Linear progress bar (determinate or indeterminate). */
export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, tone = "primary", size = "md", showValue = false, className, ...rest },
  ref,
) {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value));

  return (
    <div className={cx("msr-Progress__wrap", className)}>
      <div
        ref={ref}
        className="msr-Progress"
        data-size={size}
        data-indeterminate={indeterminate || undefined}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <span
          className="msr-Progress__fill"
          style={{ width: indeterminate ? undefined : `${pct}%`, backgroundColor: TONE[tone] }}
        />
      </div>
      {showValue && !indeterminate && (
        <span className="msr-Progress__value">{Math.round(pct)}%</span>
      )}
    </div>
  );
});
