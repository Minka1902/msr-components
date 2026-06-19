import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { FilePathViewer } from "../../components/FilePathViewer/FilePathViewer";

export interface FirmwareDiff {
  added: string[];
  removed: string[];
  changed: string[];
  unchanged?: number;
}

export interface FirmwareDiffViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  diff: FirmwareDiff;
  beforeLabel?: string;
  afterLabel?: string;
  /** Hide a section's list but keep its count chip. */
  collapsedSections?: Array<"added" | "removed" | "changed">;
}

type Section = { key: "added" | "removed" | "changed"; label: string; tone: string; sign: string; files: string[] };

/** Compares two firmwares: added / removed / changed file lists. */
export const FirmwareDiffViewer = React.forwardRef<HTMLDivElement, FirmwareDiffViewerProps>(
  function FirmwareDiffViewer(
    { diff, beforeLabel = "Before", afterLabel = "After", collapsedSections = [], className, ...rest },
    ref,
  ) {
    const sections: Section[] = [
      { key: "added", label: "Added", tone: "success", sign: "+", files: diff.added },
      { key: "removed", label: "Removed", tone: "danger", sign: "−", files: diff.removed },
      { key: "changed", label: "Changed", tone: "warning", sign: "~", files: diff.changed },
    ];

    return (
      <div ref={ref} className={cx("msr-FwDiff", className)} {...rest}>
        <div className="msr-FwDiff__header">
          <span className="msr-FwDiff__labels">{beforeLabel} → {afterLabel}</span>
          <span className="msr-FwDiff__summary">
            <span className="msr-FwDiff__stat" data-tone="success">+{diff.added.length}</span>
            <span className="msr-FwDiff__stat" data-tone="danger">−{diff.removed.length}</span>
            <span className="msr-FwDiff__stat" data-tone="warning">~{diff.changed.length}</span>
            {diff.unchanged != null && <span className="msr-FwDiff__stat" data-tone="muted">={diff.unchanged}</span>}
          </span>
        </div>
        {sections.map((s) =>
          s.files.length === 0 ? null : (
            <div key={s.key} className="msr-FwDiff__section" data-tone={s.tone}>
              <div className="msr-FwDiff__section-head">
                <span className="msr-FwDiff__section-title">{s.label}</span>
                <span className="msr-FwDiff__section-count">{s.files.length}</span>
              </div>
              {!collapsedSections.includes(s.key) && (
                <ul className="msr-FwDiff__list">
                  {s.files.map((f, i) => (
                    <li key={i} className="msr-FwDiff__row" data-tone={s.tone}>
                      <span className="msr-FwDiff__sign">{s.sign}</span>
                      <FilePathViewer path={f} showIcon={false} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        )}
        {diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0 && (
          <div className="msr-FwDiff__identical">
            <Icon name="checkCircle" size={16} /> No file differences
          </div>
        )}
      </div>
    );
  },
);
