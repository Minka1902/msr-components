import * as React from "react";
import { cx } from "../../lib/cx";
import { DataTable, type DataTableColumn } from "../../components/DataTable/DataTable";
import { CopyButton } from "../../components/CopyButton/CopyButton";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { FilePathViewer } from "../../components/FilePathViewer/FilePathViewer";

export interface HashMatch {
  id: string;
  path: string;
  vendor: string;
  firmware: string;
  size?: number;
}

export interface HashMatchExplorerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The SHA256 (or other) hash being matched. */
  hash: string;
  matches: HashMatch[];
  hashLabel?: string;
}

function formatSize(n?: number): string {
  if (n == null) return "—";
  const u = ["B", "KB", "MB", "GB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(i ? 1 : 0)} ${u[i]}`;
}

/** Shows a hash and every file matching it, grouped by vendor/firmware. */
export const HashMatchExplorer = React.forwardRef<HTMLDivElement, HashMatchExplorerProps>(
  function HashMatchExplorer({ hash, matches, hashLabel = "SHA256", className, ...rest }, ref) {
    const vendors = new Set(matches.map((m) => m.vendor)).size;
    const firmwares = new Set(matches.map((m) => m.firmware)).size;

    const columns: Array<DataTableColumn<HashMatch>> = [
      { id: "path", header: "Path", accessor: (r) => <FilePathViewer path={r.path} showIcon={false} />, value: (r) => r.path },
      { id: "vendor", header: "Vendor", accessor: (r) => r.vendor, value: (r) => r.vendor },
      { id: "firmware", header: "Firmware", accessor: (r) => r.firmware, value: (r) => r.firmware },
      { id: "size", header: "Size", accessor: (r) => formatSize(r.size), value: (r) => r.size ?? 0, align: "right" },
    ];

    return (
      <div ref={ref} className={cx("msr-HashMatch", className)} {...rest}>
        <div className="msr-HashMatch__header">
          <div className="msr-HashMatch__hash">
            <span className="msr-HashMatch__hash-label">{hashLabel}</span>
            <code className="msr-HashMatch__hash-value">{hash}</code>
            <CopyButton value={hash} />
          </div>
          <div className="msr-HashMatch__stats">
            <StatusBadge tone="info" variant="soft">{matches.length} files</StatusBadge>
            <StatusBadge tone="muted" variant="soft">{vendors} vendors</StatusBadge>
            <StatusBadge tone="muted" variant="soft">{firmwares} firmwares</StatusBadge>
          </div>
        </div>
        <DataTable data={matches} columns={columns} rowKey={(r) => r.id} searchPlaceholder="Filter matches…" />
      </div>
    );
  },
);
