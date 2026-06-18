import * as React from "react";
import { cx } from "../../lib/cx";

export interface HeatmapCell {
  /** ISO date or any key for the tooltip. */
  date: string;
  value: number;
}

export interface HeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  data: HeatmapCell[];
  /** Number of rows (e.g. 7 for days of week). */
  rows?: number;
  /** Intensity levels (0..levels). */
  levels?: number;
  cellSize?: number;
}

/** GitHub-style activity heatmap grid. */
export const Heatmap = React.forwardRef<HTMLDivElement, HeatmapProps>(function Heatmap(
  { data, rows = 7, levels = 4, cellSize = 12, className, style, ...rest },
  ref,
) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const levelOf = (v: number) => (v <= 0 ? 0 : Math.max(1, Math.ceil((v / max) * levels)));

  return (
    <div
      ref={ref}
      className={cx("msr-Heatmap", className)}
      style={{
        ["--hm-rows" as string]: rows,
        ["--hm-cell" as string]: `${cellSize}px`,
        ...style,
      }}
      role="img"
      {...rest}
    >
      {data.map((cell, i) => (
        <span
          key={i}
          className="msr-Heatmap__cell"
          data-level={levelOf(cell.value)}
          title={`${cell.date}: ${cell.value}`}
        />
      ))}
    </div>
  );
});
