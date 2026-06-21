import * as React from "react";
import { cx } from "../../lib/cx";

export interface HistogramProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Raw values to bin. */
  values: number[];
  /** Number of bins. */
  bins?: number;
  width?: number;
  height?: number;
  color?: string;
  showAxis?: boolean;
  /** Format an axis tick value. */
  formatTick?: (value: number) => string;
}

interface Bin {
  x0: number;
  x1: number;
  count: number;
}

function computeBins(values: number[], bins: number): { bins: Bin[]; min: number; max: number; maxCount: number } {
  if (values.length === 0) return { bins: [], min: 0, max: 1, maxCount: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = span / bins;
  const out: Bin[] = Array.from({ length: bins }, (_, i) => ({
    x0: min + i * width,
    x1: min + (i + 1) * width,
    count: 0,
  }));
  for (const v of values) {
    let idx = Math.floor((v - min) / width);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    out[idx].count++;
  }
  return { bins: out, min, max, maxCount: Math.max(1, ...out.map((b) => b.count)) };
}

/** Frequency histogram binned from raw values (dependency-free SVG). */
export const Histogram = React.forwardRef<HTMLDivElement, HistogramProps>(function Histogram(
  { values, bins = 12, width = 420, height = 200, color = "var(--msr-color-primary)", showAxis = true, formatTick = (v) => String(Math.round(v)), className, ...rest },
  ref,
) {
  const { bins: bars, min, max, maxCount } = React.useMemo(() => computeBins(values, bins), [values, bins]);
  const pad = showAxis ? 24 : 4;
  const plotH = height - pad;
  const barW = (width - 2) / Math.max(bars.length, 1);

  return (
    <div ref={ref} className={cx("msr-Histogram", className)} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Histogram">
        {bars.map((b, i) => {
          const h = (b.count / maxCount) * (plotH - 4);
          return (
            <rect
              key={i}
              className="msr-Histogram__bar"
              x={i * barW + 1}
              y={plotH - h}
              width={Math.max(barW - 2, 1)}
              height={h}
              fill={color}
              rx={2}
            >
              <title>{`${formatTick(b.x0)}–${formatTick(b.x1)}: ${b.count}`}</title>
            </rect>
          );
        })}
        {showAxis && (
          <g className="msr-Histogram__axis">
            <line x1={0} y1={plotH} x2={width} y2={plotH} />
            <text x={0} y={height - 6} className="msr-Histogram__tick">{formatTick(min)}</text>
            <text x={width} y={height - 6} textAnchor="end" className="msr-Histogram__tick">{formatTick(max)}</text>
          </g>
        )}
      </svg>
    </div>
  );
});
