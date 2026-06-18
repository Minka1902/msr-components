import * as React from "react";
import { cx } from "../../lib/cx";

export interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–100. */
  value: number;
  size?: number;
  thickness?: number;
  /** Override the centered label (defaults to "NN%"). */
  label?: React.ReactNode;
  tone?: "primary" | "success" | "warning" | "danger";
}

const TONE: Record<NonNullable<RadialProgressProps["tone"]>, string> = {
  primary: "var(--msr-color-primary)",
  success: "var(--msr-tone-success-fg)",
  warning: "var(--msr-tone-warning-fg)",
  danger: "var(--msr-tone-danger-fg)",
};

/** Circular single-value progress ring. */
export const RadialProgress = React.forwardRef<HTMLDivElement, RadialProgressProps>(
  function RadialProgress(
    { value, size = 96, thickness = 10, label, tone = "primary", className, ...rest },
    ref,
  ) {
    const pct = Math.max(0, Math.min(100, value));
    const r = (size - thickness) / 2;
    const c = 2 * Math.PI * r;
    const dash = (pct / 100) * c;

    return (
      <div
        ref={ref}
        className={cx("msr-Radial", className)}
        style={{ width: size, height: size }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <svg viewBox={`0 0 ${size} ${size}`}>
          <circle className="msr-Radial__track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={thickness} />
          <circle
            className="msr-Radial__value"
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={TONE[tone]}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="msr-Radial__label">{label ?? `${Math.round(pct)}%`}</div>
      </div>
    );
  },
);
