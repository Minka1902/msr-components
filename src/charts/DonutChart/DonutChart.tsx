import * as React from "react";
import { cx } from "../../lib/cx";

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DonutSegment[];
  size?: number;
  thickness?: number;
  /** Center content (e.g. a total). */
  centerLabel?: React.ReactNode;
  showLegend?: boolean;
}

const PALETTE = [
  "var(--msr-color-primary)",
  "var(--msr-tone-success-fg)",
  "var(--msr-tone-warning-fg)",
  "var(--msr-tone-danger-fg)",
  "var(--msr-tone-processing-fg)",
  "var(--msr-tone-new-fg)",
];

/** Donut/pie chart via stroke-dasharray segments. */
export const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  { data, size = 140, thickness = 18, centerLabel, showLegend = true, className, ...rest },
  ref,
) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div ref={ref} className={cx("msr-Donut", className)} {...rest}>
      <div className="msr-Donut__chart" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} role="img">
          <circle
            className="msr-Donut__track"
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={thickness}
          />
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * c;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color ?? PALETTE[i % PALETTE.length]}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        {centerLabel != null && <div className="msr-Donut__center">{centerLabel}</div>}
      </div>
      {showLegend && (
        <div className="msr-Donut__legend">
          {data.map((d, i) => (
            <span key={i} className="msr-Donut__legend-item">
              <span className="msr-Donut__swatch" style={{ backgroundColor: d.color ?? PALETTE[i % PALETTE.length] }} />
              <span className="msr-Donut__legend-label">{d.label}</span>
              <span className="msr-Donut__legend-value">{Math.round((d.value / total) * 100)}%</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
