import * as React from "react";
import { cx } from "../../lib/cx";

export interface StreamSeries {
  label: string;
  values: number[];
  color?: string;
}

export interface StreamGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  series: StreamSeries[];
  /** Optional x-axis labels (length = values length). */
  labels?: string[];
  width?: number;
  height?: number;
  showLegend?: boolean;
}

const PALETTE = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7", "#14b8a6", "#ec4899"];

/** Stacked "stream" (themeriver) graph with a centered silhouette baseline. */
export const StreamGraph = React.forwardRef<HTMLDivElement, StreamGraphProps>(function StreamGraph(
  { series, labels, width = 480, height = 220, showLegend = true, className, ...rest },
  ref,
) {
  const n = Math.max(0, ...series.map((s) => s.values.length));

  const paths = React.useMemo(() => {
    if (n === 0 || series.length === 0) return [];
    // Cumulative offsets per x with a centered (silhouette) baseline.
    const lowers: number[][] = series.map(() => new Array(n).fill(0));
    const uppers: number[][] = series.map(() => new Array(n).fill(0));
    let maxTotal = 1;
    for (let j = 0; j < n; j++) {
      let total = 0;
      for (const s of series) total += s.values[j] ?? 0;
      maxTotal = Math.max(maxTotal, total);
      let cursor = -total / 2;
      for (let i = 0; i < series.length; i++) {
        lowers[i][j] = cursor;
        cursor += series[i].values[j] ?? 0;
        uppers[i][j] = cursor;
      }
    }
    const yScale = (height * 0.86) / maxTotal;
    const center = height / 2;
    const xStep = n > 1 ? width / (n - 1) : 0;
    const py = (offset: number) => center - offset * yScale;

    return series.map((s, i) => {
      const top = uppers[i].map((o, j) => `${j === 0 ? "M" : "L"}${(j * xStep).toFixed(1)},${py(o).toFixed(1)}`).join(" ");
      let bottom = "";
      for (let j = n - 1; j >= 0; j--) bottom += ` L${(j * xStep).toFixed(1)},${py(lowers[i][j]).toFixed(1)}`;
      return { d: `${top}${bottom} Z`, color: s.color ?? PALETTE[i % PALETTE.length], label: s.label };
    });
  }, [series, n, width, height]);

  return (
    <div ref={ref} className={cx("msr-StreamGraph", className)} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Stream graph" preserveAspectRatio="none">
        {paths.map((p, i) => (
          <path key={i} className="msr-StreamGraph__layer" d={p.d} fill={p.color}>
            <title>{p.label}</title>
          </path>
        ))}
      </svg>
      {labels && labels.length > 0 && (
        <div className="msr-StreamGraph__axis">
          <span>{labels[0]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
      {showLegend && (
        <div className="msr-StreamGraph__legend">
          {paths.map((p, i) => (
            <span key={i} className="msr-StreamGraph__legendItem">
              <span className="msr-StreamGraph__swatch" style={{ backgroundColor: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
