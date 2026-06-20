import * as React from "react";
import { cx } from "../../lib/cx";

export interface TreemapDatum {
  label: string;
  value: number;
  color?: string;
}

export interface TreemapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  data: TreemapDatum[];
  width?: number;
  height?: number;
  /** Color palette used when a datum has no explicit color. */
  palette?: string[];
  showLabels?: boolean;
  onSelect?: (datum: TreemapDatum, index: number) => void;
}

interface Rect { x: number; y: number; w: number; h: number }

const DEFAULT_PALETTE = [
  "#0284c7", "#0891b2", "#059669", "#65a30d", "#ca8a04",
  "#ea580c", "#dc2626", "#db2777", "#9333ea", "#4f46e5",
];

/** Squarified treemap layout (compact, aspect-ratio-aware). */
function squarify(values: number[], rect: Rect): Rect[] {
  const result: Rect[] = new Array(values.length);
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const area = rect.w * rect.h;
  const areas = values.map((v) => (v / total) * area);
  const order = values.map((_, i) => i).sort((a, b) => areas[b] - areas[a]);

  let { x, y, w, h } = rect;

  const worst = (row: number[], side: number): number => {
    const sum = row.reduce((a, b) => a + areas[b], 0) || 1;
    const max = Math.max(...row.map((b) => areas[b]));
    const min = Math.min(...row.map((b) => areas[b]));
    const s2 = sum * sum;
    const side2 = side * side || 1;
    return Math.max((side2 * max) / s2, s2 / (side2 * min || 1));
  };

  let pos = 0;
  while (pos < order.length) {
    const side = Math.min(w, h) || 1;
    const row: number[] = [];
    while (pos < order.length) {
      const next = order[pos];
      if (row.length === 0) {
        row.push(next);
        pos++;
        continue;
      }
      if (worst([...row, next], side) <= worst(row, side)) {
        row.push(next);
        pos++;
      } else break;
    }
    const rowSum = row.reduce((a, b) => a + areas[b], 0) || 1;
    if (w >= h) {
      const colW = rowSum / (h || 1);
      let yy = y;
      for (const b of row) {
        const cellH = (areas[b] / rowSum) * h;
        result[b] = { x, y: yy, w: colW, h: cellH };
        yy += cellH;
      }
      x += colW;
      w -= colW;
    } else {
      const rowH = rowSum / (w || 1);
      let xx = x;
      for (const b of row) {
        const cellW = (areas[b] / rowSum) * w;
        result[b] = { x: xx, y, w: cellW, h: rowH };
        xx += cellW;
      }
      y += rowH;
      h -= rowH;
    }
  }
  return result;
}

/** Treemap: nested-area visualization of part-to-whole values. */
export const Treemap = React.forwardRef<HTMLDivElement, TreemapProps>(function Treemap(
  { data, width = 480, height = 300, palette = DEFAULT_PALETTE, showLabels = true, onSelect, className, ...rest },
  ref,
) {
  const rects = React.useMemo(
    () => squarify(data.map((d) => Math.max(d.value, 0)), { x: 0, y: 0, w: width, h: height }),
    [data, width, height],
  );

  return (
    <div ref={ref} className={cx("msr-Treemap", className)} {...rest}>
      <svg className="msr-Treemap__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Treemap" preserveAspectRatio="none">
        {data.map((d, i) => {
          const r = rects[i];
          if (!r) return null;
          const fill = d.color ?? palette[i % palette.length];
          const showText = showLabels && r.w > 44 && r.h > 24;
          return (
            <g
              key={i}
              className="msr-Treemap__cell"
              data-interactive={onSelect ? true : undefined}
              onClick={onSelect ? () => onSelect(d, i) : undefined}
            >
              <rect x={r.x} y={r.y} width={Math.max(r.w - 2, 0)} height={Math.max(r.h - 2, 0)} rx={3} fill={fill}>
                <title>{`${d.label}: ${d.value}`}</title>
              </rect>
              {showText && (
                <text x={r.x + 6} y={r.y + 16} className="msr-Treemap__label">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});
