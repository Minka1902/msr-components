import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface TreeTableNode {
  id: string;
  children?: TreeTableNode[];
}

export interface TreeTableColumn<N> {
  id: string;
  header: React.ReactNode;
  accessor: (row: N) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: number | string;
}

export interface TreeTableProps<N extends TreeTableNode> {
  data: N[];
  columns: Array<TreeTableColumn<N>>;
  /** Index of the column that carries the expand toggle + indentation. */
  treeColumnIndex?: number;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Indent step per depth level, px. */
  indent?: number;
  stickyHeader?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
}

interface FlatRow<N> {
  node: N;
  depth: number;
  hasChildren: boolean;
}

function flatten<N extends TreeTableNode>(
  nodes: N[],
  depth: number,
  expandedSet: Set<string>,
  out: FlatRow<N>[],
): void {
  for (const node of nodes) {
    const children = (node.children ?? []) as N[];
    const hasChildren = children.length > 0;
    out.push({ node, depth, hasChildren });
    if (hasChildren && expandedSet.has(node.id)) {
      flatten(children, depth + 1, expandedSet, out);
    }
  }
}

/** Table whose rows form an expandable hierarchy (grouped/tree rows). */
export function TreeTable<N extends TreeTableNode>({
  data,
  columns,
  treeColumnIndex = 0,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  indent = 18,
  stickyHeader = true,
  emptyMessage = "No rows",
  className,
}: TreeTableProps<N>) {
  const controlled = expanded !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultExpanded);
  const expandedIds = controlled ? (expanded as string[]) : internal;
  const expandedSet = React.useMemo(() => new Set(expandedIds), [expandedIds]);

  const toggle = (id: string) => {
    const next = expandedSet.has(id)
      ? expandedIds.filter((x) => x !== id)
      : [...expandedIds, id];
    if (!controlled) setInternal(next);
    onExpandedChange?.(next);
  };

  const rows = React.useMemo(() => {
    const out: FlatRow<N>[] = [];
    flatten(data, 0, expandedSet, out);
    return out;
  }, [data, expandedSet]);

  return (
    <div className={cx("msr-TreeTable", className)} data-sticky={stickyHeader || undefined}>
      <div className="msr-TreeTable__scroll">
        <table className="msr-TreeTable__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} style={{ width: col.width, textAlign: col.align ?? "left" }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="msr-TreeTable__empty" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map(({ node, depth, hasChildren }) => {
                const isOpen = expandedSet.has(node.id);
                return (
                  <tr key={node.id} className="msr-TreeTable__row">
                    {columns.map((col, ci) => {
                      const isTreeCol = ci === treeColumnIndex;
                      return (
                        <td key={col.id} style={{ textAlign: col.align ?? "left" }}>
                          {isTreeCol ? (
                            <span className="msr-TreeTable__tree" style={{ paddingInlineStart: depth * indent }}>
                              {hasChildren ? (
                                <button
                                  type="button"
                                  className="msr-TreeTable__toggle"
                                  aria-expanded={isOpen}
                                  aria-label={isOpen ? "Collapse" : "Expand"}
                                  onClick={() => toggle(node.id)}
                                >
                                  <Icon name={isOpen ? "chevronDown" : "chevronRight"} size={14} />
                                </button>
                              ) : (
                                <span className="msr-TreeTable__leaf" aria-hidden="true" />
                              )}
                              <span className="msr-TreeTable__cell">{col.accessor(node)}</span>
                            </span>
                          ) : (
                            col.accessor(node)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
