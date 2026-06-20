import * as React from "react";
import { cx } from "../../lib/cx";

export interface WaterfallDatum {
  label: string;
  value: number;
  /** "total" pins the bar to the baseline (running sum); "delta" floats. */
  type?: "delta" | "total";
}

export interface WaterfallProps extends React.HTMLAttributes<HTMLDivElement> {
  data: WaterfallDatum[];
  height?: number;
  positiveColor?: string;
  negativeColor?: string;
  totalColor?: string;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}

/** Waterfall chart showing cumulative additions/subtractions to a running total. */
export const Waterfall = React.forwardRef<HTMLDivElement, WaterfallProps>(function Waterfall(
  {
    data,
    height = 220,
    positiveColor = "var(--msr-tone-success-fg)",
    negativeColor = "var(--msr-tone-danger-fg)",
    totalColor = "var(--msr-color-primary)",
    showValues = true,
    formatValue = (v) => String(v),
    className,
    ...rest
  },
  ref,
) {
  // Compute each bar's [start, end] on a running total.
  let running = 0;
  const bars = data.map((d) => {
    let start: number;
    let end: number;
    if (d.type === "total") {
      start = 0;
      end = d.value;
      running = d.value;
    } else {
      start = running;
      end = running + d.value;
      running = end;
    }
    return { ...d, start, end };
  });

  const min = Math.min(0, ...bars.map((b) => Math.min(b.start, b.end)));
  const max = Math.max(0, ...bars.map((b) => Math.max(b.start, b.end)));
  const span = max - min || 1;
  const yOf = (v: number) => ((max - v) / span) * 100;

  return (
    <div ref={ref} className={cx("msr-Waterfall", className)} style={{ height }} {...rest}>
      <div className="msr-Waterfall__plot" role="img" aria-label="Waterfall chart">
        {bars.map((b, i) => {
          const topPct = yOf(Math.max(b.start, b.end));
          const heightPct = (Math.abs(b.end - b.start) / span) * 100;
          const color = b.type === "total" ? totalColor : b.value >= 0 ? positiveColor : negativeColor;
          return (
            <div key={i} className="msr-Waterfall__col">
              <div className="msr-Waterfall__bars">
                <span
                  className="msr-Waterfall__bar"
                  style={{ top: `${topPct}%`, height: `${Math.max(heightPct, 0.5)}%`, backgroundColor: color }}
                  title={`${b.label}: ${formatValue(b.value)}`}
                />
                {showValues && (
                  <span className="msr-Waterfall__value" style={{ top: `${Math.max(topPct - 6, 0)}%` }}>
                    {formatValue(b.value)}
                  </span>
                )}
              </div>
              <span className="msr-Waterfall__label">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
