import * as React from "react";
import { cx } from "../../lib/cx";

export interface BoxPlotGroup {
  label: string;
  values: number[];
  color?: string;
}

export interface BoxPlotProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: BoxPlotGroup[];
  width?: number;
  height?: number;
  color?: string;
  showOutliers?: boolean;
}

interface Stats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function computeStats(values: number[]): Stats {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = percentile(sorted, 0.25);
  const median = percentile(sorted, 0.5);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const inRange = sorted.filter((v) => v >= lowFence && v <= highFence);
  const outliers = sorted.filter((v) => v < lowFence || v > highFence);
  return {
    min: inRange.length ? inRange[0] : sorted[0],
    q1,
    median,
    q3,
    max: inRange.length ? inRange[inRange.length - 1] : sorted[sorted.length - 1],
    outliers,
  };
}

/** Box-and-whisker plot with quartiles and outliers (dependency-free SVG). */
export const BoxPlot = React.forwardRef<HTMLDivElement, BoxPlotProps>(function BoxPlot(
  { groups, width = 440, height = 240, color = "var(--msr-color-primary)", showOutliers = true, className, ...rest },
  ref,
) {
  const stats = React.useMemo(() => groups.map((g) => computeStats(g.values)), [groups]);
  const all = groups.flatMap((g) => g.values);
  const min = all.length ? Math.min(...all) : 0;
  const max = all.length ? Math.max(...all) : 1;
  const span = max - min || 1;

  const padY = 16;
  const padX = 8;
  const plotH = height - padY * 2;
  const colW = (width - padX * 2) / Math.max(groups.length, 1);
  const boxW = Math.min(colW * 0.5, 56);

  const y = (v: number) => padY + plotH - ((v - min) / span) * plotH;

  return (
    <div ref={ref} className={cx("msr-BoxPlot", className)} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Box plot">
        {groups.map((g, i) => {
          const s = stats[i];
          const cx0 = padX + colW * i + colW / 2;
          const c = g.color ?? color;
          return (
            <g key={i} className="msr-BoxPlot__group">
              {/* whiskers */}
              <line className="msr-BoxPlot__whisker" x1={cx0} x2={cx0} y1={y(s.min)} y2={y(s.q1)} />
              <line className="msr-BoxPlot__whisker" x1={cx0} x2={cx0} y1={y(s.q3)} y2={y(s.max)} />
              <line className="msr-BoxPlot__cap" x1={cx0 - boxW / 3} x2={cx0 + boxW / 3} y1={y(s.min)} y2={y(s.min)} />
              <line className="msr-BoxPlot__cap" x1={cx0 - boxW / 3} x2={cx0 + boxW / 3} y1={y(s.max)} y2={y(s.max)} />
              {/* box */}
              <rect
                className="msr-BoxPlot__box"
                x={cx0 - boxW / 2}
                y={y(s.q3)}
                width={boxW}
                height={Math.max(y(s.q1) - y(s.q3), 1)}
                fill={c}
                fillOpacity={0.22}
                stroke={c}
              >
                <title>{`${g.label} — median ${s.median.toFixed(1)}, Q1 ${s.q1.toFixed(1)}, Q3 ${s.q3.toFixed(1)}`}</title>
              </rect>
              {/* median */}
              <line className="msr-BoxPlot__median" x1={cx0 - boxW / 2} x2={cx0 + boxW / 2} y1={y(s.median)} y2={y(s.median)} stroke={c} />
              {/* outliers */}
              {showOutliers &&
                s.outliers.map((o, k) => (
                  <circle key={k} className="msr-BoxPlot__outlier" cx={cx0} cy={y(o)} r={2.5} stroke={c} />
                ))}
              <text className="msr-BoxPlot__label" x={cx0} y={height - 2} textAnchor="middle">{g.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
