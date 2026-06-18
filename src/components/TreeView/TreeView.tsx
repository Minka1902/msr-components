import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface TreeNode {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: TreeNode[];
}

export interface TreeViewProps extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect"> {
  nodes: TreeNode[];
  /** Controlled set of expanded ids. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
}

interface NodeProps {
  node: TreeNode;
  depth: number;
  expandedSet: Set<string>;
  toggle: (id: string) => void;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
}

function TreeItem({ node, depth, expandedSet, toggle, selectedId, onSelect }: NodeProps) {
  const hasChildren = !!node.children?.length;
  const open = expandedSet.has(node.id);
  return (
    <li role="treeitem" aria-expanded={hasChildren ? open : undefined} aria-selected={selectedId === node.id}>
      <div
        className="msr-Tree__row"
        data-selected={selectedId === node.id || undefined}
        style={{ paddingLeft: `calc(${depth} * var(--msr-space-4) + var(--msr-space-2))` }}
        onClick={() => {
          onSelect?.(node);
          if (hasChildren) toggle(node.id);
        }}
      >
        <span className="msr-Tree__chevron" data-open={open || undefined} data-leaf={!hasChildren || undefined}>
          {hasChildren && <Icon name="chevronRight" size={14} />}
        </span>
        {node.icon && <span className="msr-Tree__icon">{node.icon}</span>}
        <span className="msr-Tree__label">{node.label}</span>
      </div>
      {hasChildren && open && (
        <ul role="group" className="msr-Tree__group">
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedSet={expandedSet}
              toggle={toggle}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Hierarchical tree with expand/collapse and selection. */
export const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  { nodes, expanded, defaultExpanded, onExpandedChange, selectedId, onSelect, className, ...rest },
  ref,
) {
  const controlled = expanded !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultExpanded ?? []);
  const ids = controlled ? expanded! : internal;
  const expandedSet = React.useMemo(() => new Set(ids), [ids]);

  const toggle = (id: string) => {
    const next = expandedSet.has(id) ? ids.filter((x) => x !== id) : [...ids, id];
    if (!controlled) setInternal(next);
    onExpandedChange?.(next);
  };

  return (
    <ul ref={ref} role="tree" className={cx("msr-Tree", className)} {...rest}>
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          depth={0}
          expandedSet={expandedSet}
          toggle={toggle}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
});
