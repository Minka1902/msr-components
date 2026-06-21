import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* RelationshipGraph                                                   */
/* ------------------------------------------------------------------ */

export interface GraphNode {
  id: string;
  label: string;
  /** Optional grouping/type used for color. */
  group?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label?: string;
}

export interface RelationshipGraphProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "onSelect"> {
  nodes: GraphNode[];
  edges: GraphEdge[];
  size?: number;
  onSelect?: (node: GraphNode) => void;
  selectedId?: string;
}

const GROUP_COLORS = [
  "var(--msr-color-primary)",
  "var(--msr-tone-success-fg)",
  "var(--msr-tone-warning-fg)",
  "var(--msr-tone-processing-fg)",
  "var(--msr-tone-info-fg)",
  "var(--msr-tone-danger-fg)",
];

/** Visualizes relationships between entities on a radial layout. */
export const RelationshipGraph = React.forwardRef<
  SVGSVGElement,
  RelationshipGraphProps
>(function RelationshipGraph(
  { nodes, edges, size = 360, onSelect, selectedId, className, ...rest },
  ref,
) {
  const cx0 = size / 2;
  const cy0 = size / 2;
  const radius = size / 2 - 48;
  const groups = Array.from(
    new Set(nodes.map((n) => n.group ?? "default")),
  );
  const positions = React.useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    const n = nodes.length || 1;
    nodes.forEach((node, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      map.set(node.id, {
        x: cx0 + radius * Math.cos(angle),
        y: cy0 + radius * Math.sin(angle),
      });
    });
    return map;
  }, [nodes, cx0, cy0, radius]);

  return (
    <svg
      ref={ref}
      className={cx("msr-RelGraph", className)}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Relationship graph"
      {...rest}
    >
      <g className="msr-RelGraph__edges">
        {edges.map((e, i) => {
          const a = positions.get(e.source);
          const b = positions.get(e.target);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              className="msr-RelGraph__edge"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          );
        })}
      </g>
      <g className="msr-RelGraph__nodes">
        {nodes.map((node) => {
          const p = positions.get(node.id);
          if (!p) return null;
          const color =
            GROUP_COLORS[groups.indexOf(node.group ?? "default") % GROUP_COLORS.length];
          const selected = node.id === selectedId;
          return (
            <g
              key={node.id}
              className="msr-RelGraph__node"
              data-selected={selected || undefined}
              transform={`translate(${p.x} ${p.y})`}
              onClick={onSelect ? () => onSelect(node) : undefined}
              style={{ cursor: onSelect ? "pointer" : undefined }}
            >
              <circle r={selected ? 10 : 7} fill={color} />
              <text
                className="msr-RelGraph__label"
                y={-14}
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
});

/* ------------------------------------------------------------------ */
/* LineageViewer                                                       */
/* ------------------------------------------------------------------ */

export interface LineageNode {
  id: string;
  label: React.ReactNode;
  /** Column index (left → right flow). */
  stage: number;
  detail?: React.ReactNode;
  kind?: "source" | "transform" | "output";
}

export interface LineageViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  nodes: LineageNode[];
  /** Edges by node id. */
  edges: Array<{ from: string; to: string }>;
  onSelect?: (node: LineageNode) => void;
}

/** Shows where data came from, what transformed it and how it flowed. */
export const LineageViewer = React.forwardRef<HTMLDivElement, LineageViewerProps>(
  function LineageViewer({ nodes, edges, onSelect, className, ...rest }, ref) {
    const stages = Array.from(new Set(nodes.map((n) => n.stage))).sort(
      (a, b) => a - b,
    );
    return (
      <div ref={ref} className={cx("msr-Lineage", className)} {...rest}>
        {stages.map((stage, si) => (
          <React.Fragment key={stage}>
            <div className="msr-Lineage__stage">
              {nodes
                .filter((n) => n.stage === stage)
                .map((n) => {
                  const Comp = onSelect ? "button" : "div";
                  const hasUpstream = edges.some((e) => e.to === n.id);
                  return (
                    <Comp
                      key={n.id}
                      type={onSelect ? "button" : undefined}
                      className="msr-Lineage__node"
                      data-kind={n.kind ?? "transform"}
                      onClick={onSelect ? () => onSelect(n) : undefined}
                    >
                      {hasUpstream && (
                        <span
                          className="msr-Lineage__connector"
                          aria-hidden="true"
                        />
                      )}
                      <span className="msr-Lineage__nodeLabel">{n.label}</span>
                      {n.detail && (
                        <span className="msr-Lineage__nodeDetail">
                          {n.detail}
                        </span>
                      )}
                    </Comp>
                  );
                })}
            </div>
            {si < stages.length - 1 && (
              <div className="msr-Lineage__arrow" aria-hidden="true">
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);
