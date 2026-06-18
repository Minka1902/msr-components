import * as React from "react";
import { cx } from "../../lib/cx";
import { mapSeries, linePath, areaPath } from "../_lib/scale";

export interface LineSeries {
  /** Y values; all series should share the same length/x-domain. */
  data: number[];
  label?: string;
  /** CSS color; defaults cycle through chart palette tokens. */
  color?: string;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  series: LineSeries[];
  width?: number;
  height?: number;
  /** Fill under each line. */
  area?: boolean;
  /** Show horizontal gridlines. */
  grid?: boolean;
  /** X-axis category labels (rendered under the chart). */
  labels?: string[];
}

const PALETTE = [
  "var(--msr-color-primary)",
  "var(--msr-tone-success-fg)",
  "var(--msr-tone-warning-fg)",
  "var(--msr-tone-danger-fg)",
  "var(--msr-tone-processing-fg)",
];

/** Multi-series line/area chart (dependency-free SVG). */
export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  { series, width = 320, height = 160, area = false, grid = true, labels, className, ...rest },
  ref,
) {
  // Shared domain across all series so they align.
  const all = series.flatMap((s) => s.data);
  const min = Math.min(...all, 0);
  const max = Math.max(...all, 1);

  const mapWithDomain = (data: number[]) =>
    mapSeries(
      data.map((v) => v),
      width,
      height,
    ).map((p, i) => ({
      x: p.x,
      // re-map using shared min/max
      y: 2 + (height - 4) - ((data[i] - min) / (max - min || 1)) * (height - 4),
    }));

  const gridLines = grid ? [0.25, 0.5, 0.75] : [];

  return (
    <div ref={ref} className={cx("msr-LineChart", className)} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" className="msr-LineChart__svg">
        {gridLines.map((g) => (
          <line key={g} className="msr-LineChart__grid" x1={0} x2={width} y1={height * g} y2={height * g} />
        ))}
        {series.map((s, i) => {
          const pts = mapWithDomain(s.data);
          const color = s.color ?? PALETTE[i % PALETTE.length];
          return (
            <g key={i}>
              {area && <path d={areaPath(pts, width, height)} fill={color} opacity={0.12} />}
              <path d={linePath(pts)} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </svg>
      {labels && (
        <div className="msr-LineChart__labels">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      )}
      {series.some((s) => s.label) && (
        <div className="msr-LineChart__legend">
          {series.map((s, i) => (
            <span key={i} className="msr-LineChart__legend-item">
              <span className="msr-LineChart__swatch" style={{ backgroundColor: s.color ?? PALETTE[i % PALETTE.length] }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
