import * as React from "react";
import { useClipboard } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface FileMetadata {
  path?: string;
  size?: number | string;
  sha256?: string;
  type?: string;
  vendor?: string;
  firmware?: string;
  entropy?: number;
  permissions?: string;
}

export interface FileMetadataCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  metadata: FileMetadata;
  title?: React.ReactNode;
}

function formatSize(size: number | string | undefined): string | undefined {
  if (size === undefined) return undefined;
  if (typeof size === "string") return size;
  const units = ["B", "KB", "MB", "GB"];
  let n = size;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  return `${n.toFixed(u === 0 ? 0 : 1)} ${units[u]}`;
}

/** Key/value card describing a single extracted file. */
export const FileMetadataCard = React.forwardRef<HTMLDivElement, FileMetadataCardProps>(
  function FileMetadataCard({ metadata, title, className, ...rest }, ref) {
    const [copy, copied] = useClipboard();
    const m = metadata;

    const rows: Array<[string, React.ReactNode]> = [];
    if (m.size !== undefined) rows.push(["Size", formatSize(m.size)]);
    if (m.type) rows.push(["Type", m.type]);
    if (m.vendor) rows.push(["Vendor", m.vendor]);
    if (m.firmware) rows.push(["Firmware", m.firmware]);
    if (m.entropy !== undefined) rows.push(["Entropy", m.entropy.toFixed(2)]);
    if (m.permissions) rows.push(["Permissions", <code key="p">{m.permissions}</code>]);

    return (
      <div ref={ref} className={cx("msr-FileMeta", className)} {...rest}>
        {(title || m.path) && (
          <div className="msr-FileMeta__header">
            <Icon name="file" size={16} />
            <span className="msr-FileMeta__path">{title ?? m.path}</span>
          </div>
        )}
        <dl className="msr-FileMeta__grid">
          {rows.map(([k, v]) => (
            <div className="msr-FileMeta__row" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {m.sha256 && (
          <div className="msr-FileMeta__hash">
            <span className="msr-FileMeta__hash-label">SHA256</span>
            <code className="msr-FileMeta__hash-value" title={m.sha256}>
              {m.sha256}
            </code>
            <button
              type="button"
              className="msr-FileMeta__copy"
              aria-label={copied ? "Copied" : "Copy hash"}
              onClick={() => void copy(m.sha256!)}
            >
              <Icon name={copied ? "check" : "copy"} size={14} />
            </button>
          </div>
        )}
      </div>
    );
  },
);
