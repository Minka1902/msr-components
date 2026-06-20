import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface DependencyNode {
  id: string;
  label: string;
  enabled?: boolean;
}

export interface DependencyEdge {
  /** `from` requires `to`. */
  from: string;
  to: string;
}

export interface DependencyGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

/** Readable dependency view: each module and what it requires, flagging unmet deps. */
export const DependencyGraph = React.forwardRef<HTMLDivElement, DependencyGraphProps>(
  function DependencyGraph({ nodes, edges, className, ...rest }, ref) {
    const byId = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

    return (
      <div ref={ref} className={cx("msr-DepGraph", className)} {...rest}>
        {nodes.map((node) => {
          const deps = edges.filter((e) => e.from === node.id).map((e) => byId.get(e.to)).filter(Boolean) as DependencyNode[];
          return (
            <div key={node.id} className="msr-DepGraph__node" data-enabled={node.enabled || undefined}>
              <span className="msr-DepGraph__name">
                <span className="msr-DepGraph__dot" data-on={node.enabled || undefined} />
                {node.label}
              </span>
              {deps.length > 0 && (
                <span className="msr-DepGraph__requires">
                  <Icon name="arrowRight" size={14} />
                  {deps.map((d) => (
                    <span key={d.id} className="msr-DepGraph__dep" data-unmet={!d.enabled || undefined}>
                      {d.label}
                      {!d.enabled && <Icon name="warning" size={12} />}
                    </span>
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);
