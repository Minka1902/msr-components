import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { TreeView, type TreeNode } from "../../components/TreeView/TreeView";

export type FileNodeType = "vendor" | "model" | "firmware" | "folder" | "file";

export interface FileNode {
  id: string;
  name: string;
  type: FileNodeType;
  children?: FileNode[];
  /** Optional trailing meta (size, count…). */
  meta?: React.ReactNode;
}

export interface FileTreeExplorerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: FileNode[];
  selectedId?: string;
  defaultExpanded?: string[];
  onSelectNode?: (node: FileNode) => void;
}

const TYPE_ICON: Record<FileNodeType, IconName> = {
  vendor: "folder",
  model: "folder",
  firmware: "shield",
  folder: "folder",
  file: "file",
};

function toTreeNodes(nodes: FileNode[], lookup: Map<string, FileNode>): TreeNode[] {
  return nodes.map((n) => {
    lookup.set(n.id, n);
    return {
      id: n.id,
      label: (
        <span className="msr-FwTree__row">
          <span className="msr-FwTree__name">{n.name}</span>
          {n.meta != null && <span className="msr-FwTree__meta">{n.meta}</span>}
        </span>
      ),
      icon: <Icon name={TYPE_ICON[n.type]} size={14} />,
      children: n.children ? toTreeNodes(n.children, lookup) : undefined,
    };
  });
}

/** Vendor → model → firmware → files explorer (built on TreeView). */
export const FileTreeExplorer = React.forwardRef<HTMLDivElement, FileTreeExplorerProps>(
  function FileTreeExplorer({ data, selectedId, defaultExpanded, onSelectNode, className, ...rest }, ref) {
    const lookup = React.useRef(new Map<string, FileNode>());
    lookup.current = new Map();
    const nodes = toTreeNodes(data, lookup.current);

    return (
      <div ref={ref} className={cx("msr-FwTree", className)} {...rest}>
        <TreeView
          nodes={nodes}
          selectedId={selectedId}
          defaultExpanded={defaultExpanded}
          onSelect={(node) => {
            const fw = lookup.current.get(node.id);
            if (fw) onSelectNode?.(fw);
          }}
        />
      </div>
    );
  },
);
