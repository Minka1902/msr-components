import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* CostEstimator                                                       */
/* ------------------------------------------------------------------ */

export interface CostLineItem {
  label: string;
  /** Quantity, e.g. token count. */
  units: number;
  /** Price per unit. */
  unitPrice: number;
  /** Label for the unit, e.g. "1K tokens". */
  unitLabel?: string;
}

export interface CostEstimatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: CostLineItem[];
  currency?: string;
  /** Decimal places for money. */
  precision?: number;
}

/** Breaks down the estimated cost of an AI run by line item. */
export const CostEstimator = React.forwardRef<HTMLDivElement, CostEstimatorProps>(
  function CostEstimator(
    { items, currency = "$", precision = 4, className, ...rest },
    ref,
  ) {
    const fmt = (n: number) => `${currency}${n.toFixed(precision)}`;
    const total = items.reduce((s, i) => s + i.units * i.unitPrice, 0);
    return (
      <div ref={ref} className={cx("msr-Cost", className)} {...rest}>
        <table className="msr-Cost__table">
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="msr-Cost__label">{it.label}</td>
                <td className="msr-Cost__units">
                  {it.units.toLocaleString()}
                  {it.unitLabel && (
                    <span className="msr-Cost__unitLabel"> {it.unitLabel}</span>
                  )}
                </td>
                <td className="msr-Cost__amount">
                  {fmt(it.units * it.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="msr-Cost__label">Total</td>
              <td />
              <td className="msr-Cost__total">{fmt(total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* ConfidenceMeter                                                     */
/* ------------------------------------------------------------------ */

export interface ConfidenceMeterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–1. */
  value: number;
  label?: React.ReactNode;
  /** Show the percentage text. */
  showValue?: boolean;
}

function confidenceTone(v: number): "danger" | "warning" | "success" {
  if (v >= 0.75) return "success";
  if (v >= 0.4) return "warning";
  return "danger";
}

/** Compact gauge showing a model's confidence (0–1). */
export const ConfidenceMeter = React.forwardRef<
  HTMLDivElement,
  ConfidenceMeterProps
>(function ConfidenceMeter(
  { value, label = "Confidence", showValue = true, className, ...rest },
  ref,
) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      ref={ref}
      className={cx("msr-Confidence", className)}
      role="meter"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div className="msr-Confidence__head">
        {label && <span className="msr-Confidence__label">{label}</span>}
        {showValue && (
          <span className="msr-Confidence__value">{Math.round(pct)}%</span>
        )}
      </div>
      <div className="msr-Confidence__track">
        <div
          className="msr-Confidence__fill"
          data-tone={confidenceTone(value)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* LatencyBadge                                                        */
/* ------------------------------------------------------------------ */

export interface LatencyBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Latency in milliseconds. */
  ms: number;
  /** Thresholds (ms) for warning/danger tones. */
  warnAbove?: number;
  dangerAbove?: number;
  label?: React.ReactNode;
}

/** Pill showing a latency measurement, color-coded by threshold. */
export const LatencyBadge = React.forwardRef<HTMLSpanElement, LatencyBadgeProps>(
  function LatencyBadge(
    { ms, warnAbove = 1000, dangerAbove = 3000, label, className, ...rest },
    ref,
  ) {
    const tone =
      ms >= dangerAbove ? "danger" : ms >= warnAbove ? "warning" : "success";
    const text = ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
    return (
      <span
        ref={ref}
        className={cx("msr-Latency", className)}
        data-tone={tone}
        {...rest}
      >
        <span className="msr-Latency__dot" aria-hidden="true" />
        {label && <span className="msr-Latency__label">{label}</span>}
        {text}
      </span>
    );
  },
);

/* ------------------------------------------------------------------ */
/* RateLimitBanner                                                     */
/* ------------------------------------------------------------------ */

export interface RateLimitBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Requests/tokens remaining in the window. */
  remaining: number;
  limit: number;
  /** When the limit resets (countdown is shown if in the future). */
  resetAt?: Date | string;
  message?: React.ReactNode;
}

/** Warns when an API rate limit is near or exceeded, with reset time. */
export const RateLimitBanner = React.forwardRef<
  HTMLDivElement,
  RateLimitBannerProps
>(function RateLimitBanner(
  { remaining, limit, resetAt, message, className, ...rest },
  ref,
) {
  const ratio = limit > 0 ? remaining / limit : 0;
  const exceeded = remaining <= 0;
  const tone = exceeded ? "danger" : ratio <= 0.1 ? "warning" : "info";
  const reset =
    resetAt && (typeof resetAt === "string" ? new Date(resetAt) : resetAt);
  return (
    <div
      ref={ref}
      className={cx("msr-RateLimit", className)}
      data-tone={tone}
      role={exceeded ? "alert" : "status"}
      {...rest}
    >
      <span className="msr-RateLimit__icon" aria-hidden="true">
        {exceeded ? "⛔" : "⚠"}
      </span>
      <span className="msr-RateLimit__text">
        {message ??
          (exceeded
            ? "Rate limit reached."
            : `${remaining.toLocaleString()} of ${limit.toLocaleString()} requests left.`)}
        {reset && (
          <span className="msr-RateLimit__reset">
            {" "}
            Resets at {reset.toLocaleTimeString()}.
          </span>
        )}
      </span>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* UsageMeter                                                          */
/* ------------------------------------------------------------------ */

export interface UsageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  used: number;
  limit: number;
  label?: React.ReactNode;
  /** Format numbers (e.g. add units). */
  format?: (n: number) => string;
}

/** Generic quota usage bar (used / limit) with overage coloring. */
export const UsageMeter = React.forwardRef<HTMLDivElement, UsageMeterProps>(
  function UsageMeter(
    { used, limit, label, format = (n) => n.toLocaleString(), className, ...rest },
    ref,
  ) {
    const ratio = limit > 0 ? used / limit : 0;
    const pct = Math.min(100, ratio * 100);
    const tone = ratio >= 1 ? "danger" : ratio >= 0.85 ? "warning" : "primary";
    return (
      <div ref={ref} className={cx("msr-Usage", className)} {...rest}>
        <div className="msr-Usage__head">
          {label && <span className="msr-Usage__label">{label}</span>}
          <span className="msr-Usage__value">
            {format(used)} / {format(limit)}
          </span>
        </div>
        <div
          className="msr-Usage__track"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="msr-Usage__fill"
            data-tone={tone}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  },
);
