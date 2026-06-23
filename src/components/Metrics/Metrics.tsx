import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* TrendIndicator                                                      */
/* ------------------------------------------------------------------ */

export interface TrendIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Signed change. Positive → up, negative → down. */
  delta: number;
  /** Render delta as a percentage. */
  percent?: boolean;
  /** When true, a downward trend is treated as good (e.g. error rate). */
  invert?: boolean;
  /** Decimal places. */
  precision?: number;
}

/** Up/down delta with arrow, color-coded by direction (and optional invert). */
export const TrendIndicator = React.forwardRef<
  HTMLSpanElement,
  TrendIndicatorProps
>(function TrendIndicator(
  { delta, percent, invert, precision = 1, className, ...rest },
  ref,
) {
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  const good =
    dir === "flat" ? "neutral" : (dir === "up") !== Boolean(invert) ? "good" : "bad";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "—";
  const text = `${Math.abs(delta).toFixed(precision)}${percent ? "%" : ""}`;
  return (
    <span
      ref={ref}
      className={cx("msr-Trend", className)}
      data-tone={good}
      {...rest}
    >
      <span className="msr-Trend__arrow" aria-hidden="true">
        {arrow}
      </span>
      {text}
    </span>
  );
});

/* ------------------------------------------------------------------ */
/* Inline mini sparkline (internal helper)                            */
/* ------------------------------------------------------------------ */

function MiniSpark({ points, width = 80, height = 24 }: {
  points: number[];
  width?: number;
  height?: number;
}) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * step;
      const y = height - ((p - min) / span) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      className="msr-Metric__spark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <path d={d} fill="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* MetricCard                                                          */
/* ------------------------------------------------------------------ */

export interface MetricCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Signed change shown via a TrendIndicator. */
  delta?: number;
  deltaPercent?: boolean;
  /** Down is good (e.g. error rate, latency). */
  invertTrend?: boolean;
  /** Small caption under the value (e.g. "vs last week"). */
  caption?: React.ReactNode;
  icon?: React.ReactNode;
  /** Inline sparkline series. */
  sparkline?: number[];
}

/** A single KPI card: label, value, trend, optional sparkline. */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    {
      label,
      value,
      delta,
      deltaPercent,
      invertTrend,
      caption,
      icon,
      sparkline,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-Metric", className)} {...rest}>
        <div className="msr-Metric__head">
          <span className="msr-Metric__label">{label}</span>
          {icon && <span className="msr-Metric__icon">{icon}</span>}
        </div>
        <div className="msr-Metric__valueRow">
          <span className="msr-Metric__value">{value}</span>
          {delta != null && (
            <TrendIndicator
              delta={delta}
              percent={deltaPercent}
              invert={invertTrend}
            />
          )}
        </div>
        {sparkline && sparkline.length > 1 && (
          <MiniSpark points={sparkline} />
        )}
        {caption && <div className="msr-Metric__caption">{caption}</div>}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* StatComparison                                                      */
/* ------------------------------------------------------------------ */

export interface StatComparisonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label: React.ReactNode;
  current: number;
  previous: number;
  /** Format the displayed numbers. */
  format?: (n: number) => string;
  previousLabel?: React.ReactNode;
  invertTrend?: boolean;
}

/** Compares a current value to a previous one with the % change. */
export const StatComparison = React.forwardRef<
  HTMLDivElement,
  StatComparisonProps
>(function StatComparison(
  {
    label,
    current,
    previous,
    format = (n) => n.toLocaleString(),
    previousLabel = "previous",
    invertTrend,
    className,
    ...rest
  },
  ref,
) {
  const pct =
    previous === 0 ? (current === 0 ? 0 : 100) : ((current - previous) / Math.abs(previous)) * 100;
  return (
    <div ref={ref} className={cx("msr-StatCompare", className)} {...rest}>
      <div className="msr-StatCompare__label">{label}</div>
      <div className="msr-StatCompare__row">
        <span className="msr-StatCompare__current">{format(current)}</span>
        <TrendIndicator delta={pct} percent invert={invertTrend} />
      </div>
      <div className="msr-StatCompare__previous">
        {format(previous)} {previousLabel}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* KpiGrid                                                             */
/* ------------------------------------------------------------------ */

export interface KpiGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Minimum column width before wrapping. */
  minColumnWidth?: number;
  children?: React.ReactNode;
}

/** Responsive grid wrapper for MetricCards / stats. */
export const KpiGrid = React.forwardRef<HTMLDivElement, KpiGridProps>(
  function KpiGrid({ minColumnWidth = 200, className, style, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx("msr-KpiGrid", className)}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`,
          ...style,
        }}
        {...rest}
      />
    );
  },
);
