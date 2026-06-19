import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export type ExportFormat = "html" | "json" | "csv" | "pdf";

export interface ReportExportToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which export formats to show. */
  formats?: ExportFormat[];
  onExport?: (format: ExportFormat) => void;
  onCopyLink?: () => void;
  onPrint?: () => void;
  busyFormat?: ExportFormat | null;
}

const FORMAT_META: Record<ExportFormat, { label: string; icon: IconName }> = {
  html: { label: "HTML", icon: "file" },
  json: { label: "JSON", icon: "hash" },
  csv: { label: "CSV", icon: "columns" },
  pdf: { label: "PDF", icon: "file" },
};

/** Toolbar to export a report (HTML/JSON/CSV/PDF), copy link, print. */
export const ReportExportToolbar = React.forwardRef<HTMLDivElement, ReportExportToolbarProps>(
  function ReportExportToolbar(
    { formats = ["html", "json", "csv", "pdf"], onExport, onCopyLink, onPrint, busyFormat, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} role="toolbar" className={cx("msr-ReportExport", className)} {...rest}>
        <span className="msr-ReportExport__label">
          <Icon name="export" size={15} /> Export
        </span>
        <div className="msr-ReportExport__group">
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              className="msr-ReportExport__btn"
              disabled={busyFormat === f}
              onClick={() => onExport?.(f)}
            >
              <Icon name={busyFormat === f ? "spinner" : FORMAT_META[f].icon} size={14} data-spin={busyFormat === f || undefined} />
              {FORMAT_META[f].label}
            </button>
          ))}
        </div>
        <span className="msr-ReportExport__divider" />
        {onCopyLink && (
          <button type="button" className="msr-ReportExport__btn" onClick={onCopyLink}>
            <Icon name="link" size={14} /> Copy link
          </button>
        )}
        {onPrint && (
          <button type="button" className="msr-ReportExport__btn" onClick={onPrint}>
            <Icon name="printer" size={14} /> Print
          </button>
        )}
      </div>
    );
  },
);
