import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface FilePathViewerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** The full path, e.g. "/vendor/model/fw/etc/passwd". */
  path: string;
  separator?: string;
  /** Collapse the middle when there are more than this many segments. */
  maxSegments?: number;
  /** Called with the cumulative path and index when a segment is clicked. */
  onSelect?: (segmentPath: string, index: number) => void;
  /** Show a leading file/folder icon. */
  showIcon?: boolean;
}

interface Segment {
  label: string;
  fullPath: string;
  index: number;
}

/** Renders a long path as clickable breadcrumb segments with middle collapsing. */
export const FilePathViewer = React.forwardRef<HTMLElement, FilePathViewerProps>(
  function FilePathViewer(
    { path, separator = "/", maxSegments = 0, onSelect, showIcon = true, className, ...rest },
    ref,
  ) {
    const leading = path.startsWith(separator);
    const parts = path.split(separator).filter(Boolean);

    const segments: Segment[] = parts.map((label, index) => ({
      label,
      index,
      fullPath: (leading ? separator : "") + parts.slice(0, index + 1).join(separator),
    }));

    const collapsed =
      maxSegments > 0 && segments.length > maxSegments
        ? [
            ...segments.slice(0, 1),
            null,
            ...segments.slice(segments.length - (maxSegments - 1)),
          ]
        : segments;

    const interactive = !!onSelect;

    return (
      <nav ref={ref} className={cx("msr-FilePath", className)} aria-label="File path" {...rest}>
        {showIcon && (
          <span className="msr-FilePath__lead">
            <Icon name="file" size={14} />
          </span>
        )}
        <ol className="msr-FilePath__list">
          {collapsed.map((seg, i) =>
            seg === null ? (
              <li key={`ellipsis-${i}`} className="msr-FilePath__segment" aria-hidden="true">
                <span className="msr-FilePath__ellipsis">…</span>
                <span className="msr-FilePath__sep">{separator}</span>
              </li>
            ) : (
              <li key={seg.fullPath} className="msr-FilePath__segment">
                {interactive ? (
                  <button
                    type="button"
                    className="msr-FilePath__crumb"
                    onClick={() => onSelect?.(seg.fullPath, seg.index)}
                  >
                    {seg.label}
                  </button>
                ) : (
                  <span className="msr-FilePath__crumb" data-static>
                    {seg.label}
                  </span>
                )}
                {i < collapsed.length - 1 && <span className="msr-FilePath__sep">{separator}</span>}
              </li>
            ),
          )}
        </ol>
      </nav>
    );
  },
);
