import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { TreeView, type TreeNode } from "../../components/TreeView/TreeView";

export type FirmwareNodeType = "vendor" | "model" | "firmware" | "folder" | "file";

export interface FirmwareNode {
  id: string;
  name: string;
  type: FirmwareNodeType;
  children?: FirmwareNode[];
  /** Optional trailing meta (size, count…). */
  meta?: React.ReactNode;
}

export interface FirmwareTreeExplorerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: FirmwareNode[];
  selectedId?: string;
  defaultExpanded?: string[];
  onSelectNode?: (node: FirmwareNode) => void;
}

const TYPE_ICON: Record<FirmwareNodeType, IconName> = {
  vendor: "folder",
  model: "folder",
  firmware: "shield",
  folder: "folder",
  file: "file",
};

function toTreeNodes(nodes: FirmwareNode[], lookup: Map<string, FirmwareNode>): TreeNode[] {
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
export const FirmwareTreeExplorer = React.forwardRef<HTMLDivElement, FirmwareTreeExplorerProps>(
  function FirmwareTreeExplorer({ data, selectedId, defaultExpanded, onSelectNode, className, ...rest }, ref) {
    const lookup = React.useRef(new Map<string, FirmwareNode>());
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
