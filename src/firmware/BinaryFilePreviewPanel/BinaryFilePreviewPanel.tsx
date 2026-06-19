import * as React from "react";
import { cx } from "../../lib/cx";

export interface BinaryFilePreviewPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Raw bytes to preview. */
  data: Uint8Array | number[];
  /** Bytes shown per row (default 16). */
  bytesPerRow?: number;
  /** Max rows rendered (default 32). */
  maxRows?: number;
  /** Detected file type label. */
  fileType?: string;
  /** Number of leading bytes treated as magic bytes (highlighted). */
  magicByteCount?: number;
}

function hex(n: number): string {
  return n.toString(16).padStart(2, "0");
}
function ascii(n: number): string {
  return n >= 0x20 && n < 0x7f ? String.fromCharCode(n) : ".";
}

/** Hex + ASCII dump with magic-byte highlighting and detected type. */
export const BinaryFilePreviewPanel = React.forwardRef<HTMLDivElement, BinaryFilePreviewPanelProps>(
  function BinaryFilePreviewPanel(
    { data, bytesPerRow = 16, maxRows = 32, fileType, magicByteCount = 4, className, ...rest },
    ref,
  ) {
    const bytes = React.useMemo(() => Array.from(data), [data]);
    const rows = Math.min(Math.ceil(bytes.length / bytesPerRow), maxRows);
    const magic = bytes.slice(0, magicByteCount).map(hex).join(" ");

    return (
      <div ref={ref} className={cx("msr-BinPreview", className)} {...rest}>
        <div className="msr-BinPreview__header">
          {fileType && <span className="msr-BinPreview__type">{fileType}</span>}
          <span className="msr-BinPreview__magic">
            <span className="msr-BinPreview__magic-label">magic</span>
            <code>{magic || "—"}</code>
          </span>
          <span className="msr-BinPreview__size">{bytes.length.toLocaleString()} bytes</span>
        </div>
        <div className="msr-BinPreview__grid" role="img" aria-label="Hex preview">
          {Array.from({ length: rows }).map((_, r) => {
            const start = r * bytesPerRow;
            const slice = bytes.slice(start, start + bytesPerRow);
            return (
              <div className="msr-BinPreview__row" key={r}>
                <span className="msr-BinPreview__offset">{start.toString(16).padStart(8, "0")}</span>
                <span className="msr-BinPreview__hex">
                  {slice.map((b, i) => (
                    <span key={i} className="msr-BinPreview__byte" data-magic={start + i < magicByteCount || undefined}>
                      {hex(b)}
                    </span>
                  ))}
                </span>
                <span className="msr-BinPreview__ascii">{slice.map(ascii).join("")}</span>
              </div>
            );
          })}
          {Math.ceil(bytes.length / bytesPerRow) > maxRows && (
            <div className="msr-BinPreview__more">… {bytes.length - rows * bytesPerRow} more bytes</div>
          )}
        </div>
      </div>
    );
  },
);
