import * as React from "react";
import { cx } from "../../lib/cx";

export interface RadarAxis {
  label: string;
  /** Max value for this axis (defaults to chart `max`). */
  max?: number;
}

export interface RadarSeries {
  label?: string;
  /** One value per axis, in axis order. */
  values: number[];
  color?: string;
}

export interface RadarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  axes: RadarAxis[];
  series: RadarSeries[];
  size?: number;
  max?: number;
  /** Number of concentric grid rings. */
  rings?: number;
}

const PALETTE = ["var(--msr-color-primary)", "var(--msr-tone-success-fg)", "var(--msr-tone-warning-fg)"];

/** Radar / spider chart for multi-axis comparisons. */
export const RadarChart = React.forwardRef<HTMLDivElement, RadarChartProps>(function RadarChart(
  { axes, series, size = 240, max = 100, rings = 4, className, ...rest },
  ref,
) {
  const cx0 = size / 2;
  const cy0 = size / 2;
  const r = size / 2 - 28;
  const n = axes.length;

  const point = (axisIdx: number, ratio: number) => {
    const angle = (Math.PI * 2 * axisIdx) / n - Math.PI / 2;
    return [cx0 + Math.cos(angle) * r * ratio, cy0 + Math.sin(angle) * r * ratio] as const;
  };

  return (
    <div ref={ref} className={cx("msr-Radar", className)} {...rest}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
        {/* grid rings */}
        {Array.from({ length: rings }).map((_, ri) => {
          const ratio = (ri + 1) / rings;
          const pts = axes.map((_, ai) => point(ai, ratio).join(",")).join(" ");
          return <polygon key={ri} className="msr-Radar__ring" points={pts} />;
        })}
        {/* spokes + labels */}
        {axes.map((axis, ai) => {
          const [ex, ey] = point(ai, 1);
          const [lx, ly] = point(ai, 1.16);
          return (
            <g key={ai}>
              <line className="msr-Radar__spoke" x1={cx0} y1={cy0} x2={ex} y2={ey} />
              <text className="msr-Radar__label" x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">
                {axis.label}
              </text>
            </g>
          );
        })}
        {/* series polygons */}
        {series.map((s, si) => {
          const color = s.color ?? PALETTE[si % PALETTE.length];
          const pts = s.values.map((v, ai) => point(ai, Math.max(0, Math.min(1, v / (axes[ai].max ?? max)))).join(",")).join(" ");
          return <polygon key={si} points={pts} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} />;
        })}
      </svg>
    </div>
  );
});
