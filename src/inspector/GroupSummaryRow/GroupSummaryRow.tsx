import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { FilePathViewer } from "../../components/FilePathViewer/FilePathViewer";

export interface GroupSummaryRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The most common / representative path for the group. */
  mostCommonPath: string;
  fileCount: number;
  firmwareCount: number;
  vendorCount: number;
  /** Controlled expanded state; if provided with children, renders a toggle. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  /** Expanded content (e.g. the full file list). */
  children?: React.ReactNode;
}

/** Collapsed summary row: counts + most common path, optionally expandable. */
export const GroupSummaryRow = React.forwardRef<HTMLDivElement, GroupSummaryRowProps>(
  function GroupSummaryRow(
    { mostCommonPath, fileCount, firmwareCount, vendorCount, expanded, defaultExpanded = false, onToggle, children, className, ...rest },
    ref,
  ) {
    const controlled = expanded !== undefined;
    const [internal, setInternal] = React.useState(defaultExpanded);
    const open = controlled ? expanded! : internal;
    const hasContent = children != null;

    const toggle = () => {
      if (!hasContent) return;
      const next = !open;
      if (!controlled) setInternal(next);
      onToggle?.(next);
    };

    return (
      <div ref={ref} className={cx("msr-GroupSummaryRow", className)} data-expanded={open || undefined} {...rest}>
        <button type="button" className="msr-GroupSummaryRow__row" onClick={toggle} aria-expanded={hasContent ? open : undefined} disabled={!hasContent}>
          {hasContent && (
            <span className="msr-GroupSummaryRow__chevron" data-open={open || undefined}>
              <Icon name="chevronRight" size={14} />
            </span>
          )}
          <span className="msr-GroupSummaryRow__path">
            <FilePathViewer path={mostCommonPath} showIcon={false} />
          </span>
          <span className="msr-GroupSummaryRow__stats">
            <span className="msr-GroupSummaryRow__stat"><strong>{fileCount}</strong> files</span>
            <span className="msr-GroupSummaryRow__stat"><strong>{firmwareCount}</strong> firmwares</span>
            <span className="msr-GroupSummaryRow__stat"><strong>{vendorCount}</strong> vendors</span>
          </span>
        </button>
        {hasContent && open && <div className="msr-GroupSummaryRow__content">{children}</div>}
      </div>
    );
  },
);
