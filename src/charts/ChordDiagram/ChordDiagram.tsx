import * as React from "react";
import { cx } from "../../lib/cx";

export interface ChordDiagramProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Square flow matrix: matrix[i][j] = flow from i to j. */
  matrix: number[][];
  labels?: string[];
  colors?: string[];
  size?: number;
  /** Gap between node arcs, degrees. */
  padAngle?: number;
  onSelect?: (index: number) => void;
}

const PALETTE = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#a855f7", "#14b8a6", "#ec4899", "#6366f1", "#84cc16"];

/** Circular chord diagram of inter-group flows (dependency-free SVG). */
export const ChordDiagram = React.forwardRef<HTMLDivElement, ChordDiagramProps>(function ChordDiagram(
  { matrix, labels, colors, size = 340, padAngle = 2, onSelect, className, ...rest },
  ref,
) {
  const [active, setActive] = React.useState<number | null>(null);
  const n = matrix.length;
  const cxy = size / 2;
  const rOuter = size / 2 - 26;
  const ring = 10;
  const rInner = rOuter - ring - 2;

  const color = (i: number) => colors?.[i] ?? PALETTE[i % PALETTE.length];
  const polar = (deg: number, r: number) => ({
    x: cxy + r * Math.cos(((deg - 90) * Math.PI) / 180),
    y: cxy + r * Math.sin(((deg - 90) * Math.PI) / 180),
  });

  const layout = React.useMemo(() => {
    const rowSum = matrix.map((row) => row.reduce((a, b) => a + b, 0));
    const total = rowSum.reduce((a, b) => a + b, 0);
    if (total === 0) return null;
    const available = 360 - n * padAngle;
    const nodes: Array<{ start: number; end: number }> = [];
    const sub: Array<Array<{ start: number; end: number }>> = [];
    let cursor = 0;
    for (let i = 0; i < n; i++) {
      const span = (rowSum[i] / total) * available;
      nodes.push({ start: cursor, end: cursor + span });
      const subs: Array<{ start: number; end: number }> = [];
      let sc = cursor;
      for (let j = 0; j < n; j++) {
        const w = rowSum[i] > 0 ? (matrix[i][j] / rowSum[i]) * span : 0;
        subs.push({ start: sc, end: sc + w });
        sc += w;
      }
      sub.push(subs);
      cursor += span + padAngle;
    }
    return { nodes, sub };
  }, [matrix, n, padAngle]);

  if (!layout) return <div ref={ref} className={cx("msr-ChordDiagram", className)} {...rest} />;

  const ribbons: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (i === j || (matrix[i][j] === 0 && matrix[j][i] === 0)) continue;
      const a = layout.sub[i][j];
      const b = layout.sub[j][i];
      const p1 = polar(a.start, rInner);
      const p2 = polar(a.end, rInner);
      const p3 = polar(b.start, rInner);
      const p4 = polar(b.end, rInner);
      const d = `M ${p1.x} ${p1.y} A ${rInner} ${rInner} 0 0 1 ${p2.x} ${p2.y} Q ${cxy} ${cxy} ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 0 1 ${p4.x} ${p4.y} Q ${cxy} ${cxy} ${p1.x} ${p1.y} Z`;
      const dim = active !== null && active !== i && active !== j;
      ribbons.push(
        <path
          key={`${i}-${j}`}
          className="msr-ChordDiagram__ribbon"
          d={d}
          fill={color(i)}
          fillOpacity={dim ? 0.05 : 0.4}
        >
          <title>{`${labels?.[i] ?? i} ↔ ${labels?.[j] ?? j}: ${matrix[i][j] + matrix[j][i]}`}</title>
        </path>,
      );
    }
  }

  return (
    <div ref={ref} className={cx("msr-ChordDiagram", className)} {...rest}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Chord diagram">
        <g>{ribbons}</g>
        {layout.nodes.map((node, i) => {
          const p1 = polar(node.start, rOuter);
          const p2 = polar(node.end, rOuter);
          const large = node.end - node.start > 180 ? 1 : 0;
          const mid = (node.start + node.end) / 2;
          const lp = polar(mid, rOuter + 12);
          return (
            <g
              key={i}
              className="msr-ChordDiagram__node"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={onSelect ? () => onSelect(i) : undefined}
            >
              <path
                d={`M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}`}
                stroke={color(i)}
                strokeWidth={ring}
                fill="none"
              />
              {labels?.[i] && (
                <text
                  className="msr-ChordDiagram__label"
                  x={lp.x}
                  y={lp.y}
                  textAnchor={mid > 180 ? "end" : "start"}
                  dominantBaseline="middle"
                >
                  {labels[i]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
});
