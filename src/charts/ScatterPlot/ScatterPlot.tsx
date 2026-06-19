import * as React from "react";
import { cx } from "../../lib/cx";

export interface ScatterPoint {
  x: number;
  y: number;
  /** Optional bubble radius. */
  r?: number;
  label?: string;
}

export interface ScatterSeries {
  label?: string;
  points: ScatterPoint[];
  color?: string;
}

export interface ScatterPlotProps extends React.HTMLAttributes<HTMLDivElement> {
  series: ScatterSeries[];
  width?: number;
  height?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
  grid?: boolean;
}

const PALETTE = ["var(--msr-color-primary)", "var(--msr-tone-success-fg)", "var(--msr-tone-danger-fg)"];

/** Scatter / bubble plot. */
export const ScatterPlot = React.forwardRef<HTMLDivElement, ScatterPlotProps>(function ScatterPlot(
  { series, width = 320, height = 220, xDomain, yDomain, grid = true, className, ...rest },
  ref,
) {
  const all = series.flatMap((s) => s.points);
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const [minX, maxX] = xDomain ?? [Math.min(...xs, 0), Math.max(...xs, 1)];
  const [minY, maxY] = yDomain ?? [Math.min(...ys, 0), Math.max(...ys, 1)];
  const pad = 8;

  const sx = (x: number) => pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);
  const sy = (y: number) => height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2);

  return (
    <div ref={ref} className={cx("msr-Scatter", className)} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" role="img" className="msr-Scatter__svg">
        {grid && [0.25, 0.5, 0.75].map((g) => (
          <line key={g} className="msr-Scatter__grid" x1={0} x2={width} y1={height * g} y2={height * g} />
        ))}
        {series.map((s, si) => {
          const color = s.color ?? PALETTE[si % PALETTE.length];
          return s.points.map((p, pi) => (
            <circle key={`${si}-${pi}`} cx={sx(p.x)} cy={sy(p.y)} r={p.r ?? 4} fill={color} fillOpacity={0.7}>
              {p.label && <title>{p.label}</title>}
            </circle>
          ));
        })}
      </svg>
    </div>
  );
});
