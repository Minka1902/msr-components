import * as React from "react";
import { cx } from "../../lib/cx";

export interface SankeyNode {
  id: string;
  label?: string;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  /** Vertical gap between stacked nodes, px. */
  nodePadding?: number;
  palette?: string[];
  showValues?: boolean;
  onNodeClick?: (node: SankeyNode) => void;
}

interface LaidNode extends SankeyNode {
  depth: number;
  value: number;
  x: number;
  y: number;
  h: number;
  outOffset: number;
  inOffset: number;
}

interface LaidLink extends SankeyLink {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  width: number;
  color: string;
}

const DEFAULT_PALETTE = [
  "#0284c7", "#0891b2", "#059669", "#65a30d", "#ca8a04",
  "#ea580c", "#dc2626", "#db2777", "#9333ea", "#4f46e5",
];

/** Dependency-free Sankey flow diagram (longest-path layering, bezier links). */
export const Sankey = React.forwardRef<HTMLDivElement, SankeyProps>(function Sankey(
  {
    nodes,
    links,
    width = 560,
    height = 320,
    nodeWidth = 14,
    nodePadding = 12,
    palette = DEFAULT_PALETTE,
    showValues = false,
    onNodeClick,
    className,
    ...rest
  },
  ref,
) {
  const { laidNodes, laidLinks } = React.useMemo(() => {
    const map = new Map<string, LaidNode>();
    nodes.forEach((n, i) =>
      map.set(n.id, {
        ...n,
        depth: 0,
        value: 0,
        x: 0,
        y: 0,
        h: 0,
        outOffset: 0,
        inOffset: 0,
        color: n.color ?? palette[i % palette.length],
      }),
    );

    // Longest-path layering (DAG): relax depths N times.
    for (let iter = 0; iter < nodes.length; iter++) {
      for (const l of links) {
        const s = map.get(l.source);
        const t = map.get(l.target);
        if (s && t) t.depth = Math.max(t.depth, s.depth + 1);
      }
    }

    // Node value = max(total in, total out).
    for (const n of map.values()) {
      const out = links.filter((l) => l.source === n.id).reduce((a, l) => a + l.value, 0);
      const inc = links.filter((l) => l.target === n.id).reduce((a, l) => a + l.value, 0);
      n.value = Math.max(out, inc, 0);
    }

    const maxDepth = Math.max(0, ...[...map.values()].map((n) => n.depth));
    const columns = new Map<number, LaidNode[]>();
    for (const n of map.values()) {
      const col = columns.get(n.depth);
      if (col) col.push(n);
      else columns.set(n.depth, [n]);
    }

    // Global value→pixel scale so the tallest column fits.
    let scale = Infinity;
    for (const col of columns.values()) {
      const sum = col.reduce((a, n) => a + n.value, 0) || 1;
      const avail = height - (col.length - 1) * nodePadding;
      scale = Math.min(scale, avail / sum);
    }
    if (!Number.isFinite(scale)) scale = 1;

    // Place nodes.
    for (const [depth, col] of columns) {
      let y = 0;
      for (const n of col) {
        n.x = maxDepth === 0 ? 0 : (depth * (width - nodeWidth)) / maxDepth;
        n.y = y;
        n.h = Math.max(n.value * scale, 1);
        y += n.h + nodePadding;
      }
    }

    // Build links, stacking on each node's edges ordered by the opposite node.
    const laid: LaidLink[] = [];
    for (const n of map.values()) {
      const outs = links
        .filter((l) => l.source === n.id)
        .sort((a, b) => (map.get(a.target)?.y ?? 0) - (map.get(b.target)?.y ?? 0));
      n.outOffset = 0;
      for (const l of outs) {
        const t = map.get(l.target);
        if (!t) continue;
        const w = Math.max(l.value * scale, 0.5);
        const sy = n.y + n.outOffset + w / 2;
        n.outOffset += w;
        // ty is resolved in the second pass once target incoming offsets are known.
        laid.push({ ...l, sx: n.x + nodeWidth, sy, tx: t.x, ty: 0, width: w, color: n.color! });
      }
    }
    // Second pass for incoming offsets, ordered by source y.
    for (const n of map.values()) n.inOffset = 0;
    const byTarget = new Map<string, LaidLink[]>();
    for (const l of laid) {
      const arr = byTarget.get(l.target);
      if (arr) arr.push(l);
      else byTarget.set(l.target, [l]);
    }
    for (const [targetId, arr] of byTarget) {
      const t = map.get(targetId);
      if (!t) continue;
      arr.sort((a, b) => a.sy - b.sy);
      for (const l of arr) {
        l.ty = t.y + t.inOffset + l.width / 2;
        t.inOffset += l.width;
      }
    }

    return { laidNodes: [...map.values()], laidLinks: laid };
  }, [nodes, links, width, height, nodeWidth, nodePadding, palette]);

  return (
    <div ref={ref} className={cx("msr-Sankey", className)} {...rest}>
      <svg className="msr-Sankey__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sankey diagram" preserveAspectRatio="xMidYMid meet">
        <g className="msr-Sankey__links">
          {laidLinks.map((l, i) => {
            const mx = (l.sx + l.tx) / 2;
            return (
              <path
                key={i}
                className="msr-Sankey__link"
                d={`M${l.sx},${l.sy} C${mx},${l.sy} ${mx},${l.ty} ${l.tx},${l.ty}`}
                stroke={l.color}
                strokeWidth={l.width}
                fill="none"
              >
                <title>{`${l.source} → ${l.target}: ${l.value}`}</title>
              </path>
            );
          })}
        </g>
        <g className="msr-Sankey__nodes">
          {laidNodes.map((n) => (
            <g
              key={n.id}
              className="msr-Sankey__node"
              data-interactive={onNodeClick ? true : undefined}
              onClick={onNodeClick ? () => onNodeClick(n) : undefined}
            >
              <rect x={n.x} y={n.y} width={nodeWidth} height={n.h} rx={2} fill={n.color}>
                <title>{`${n.label ?? n.id}: ${n.value}`}</title>
              </rect>
              <text
                className="msr-Sankey__label"
                x={n.depth === 0 ? n.x + nodeWidth + 4 : n.x - 4}
                y={n.y + n.h / 2}
                dominantBaseline="middle"
                textAnchor={n.depth === 0 ? "start" : "end"}
              >
                {n.label ?? n.id}
                {showValues ? ` (${n.value})` : ""}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
});
