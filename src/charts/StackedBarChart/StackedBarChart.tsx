import * as React from "react";
import { cx } from "../../lib/cx";

export interface StackSeries {
  key: string;
  label: string;
  color?: string;
}

export interface StackDatum {
  label: string;
  /** Map of series key → value. */
  values: Record<string, number>;
}

export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: StackDatum[];
  series: StackSeries[];
  height?: number;
  showLegend?: boolean;
}

const PALETTE = [
  "var(--msr-color-primary)",
  "var(--msr-tone-success-fg)",
  "var(--msr-tone-warning-fg)",
  "var(--msr-tone-danger-fg)",
  "var(--msr-tone-processing-fg)",
];

/** Stacked bar chart (CSS bars). */
export const StackedBarChart = React.forwardRef<HTMLDivElement, StackedBarChartProps>(
  function StackedBarChart({ data, series, height = 200, showLegend = true, className, style, ...rest }, ref) {
    const totals = data.map((d) => series.reduce((s, ser) => s + (d.values[ser.key] ?? 0), 0));
    const max = Math.max(...totals, 1);
    const colorFor = (i: number, ser: StackSeries) => ser.color ?? PALETTE[i % PALETTE.length];

    return (
      <div ref={ref} className={cx("msr-Stacked", className)} {...rest}>
        <div className="msr-Stacked__plot" style={{ height, ...style }}>
          {data.map((d, di) => (
            <div className="msr-Stacked__col" key={di}>
              <div className="msr-Stacked__stack">
                {series.map((ser, si) => {
                  const v = d.values[ser.key] ?? 0;
                  if (!v) return null;
                  return (
                    <span
                      key={ser.key}
                      className="msr-Stacked__seg"
                      title={`${ser.label}: ${v}`}
                      style={{ height: `${(v / max) * 100}%`, backgroundColor: colorFor(si, ser) }}
                    />
                  );
                })}
              </div>
              <span className="msr-Stacked__label" title={d.label}>{d.label}</span>
            </div>
          ))}
        </div>
        {showLegend && (
          <div className="msr-Stacked__legend">
            {series.map((ser, si) => (
              <span key={ser.key} className="msr-Stacked__legend-item">
                <span className="msr-Stacked__swatch" style={{ backgroundColor: colorFor(si, ser) }} />
                {ser.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
);
