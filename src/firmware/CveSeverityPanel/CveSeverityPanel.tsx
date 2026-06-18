import * as React from "react";
import { cx } from "../../lib/cx";

export interface CveCounts {
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface CveSeverityPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  counts: CveCounts;
  title?: React.ReactNode;
  /** Render as a single stacked bar instead of per-severity rows. */
  layout?: "rows" | "bar";
}

const ORDER: Array<keyof CveCounts> = ["critical", "high", "medium", "low"];
const LABELS: Record<keyof CveCounts, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

/** Vulnerability breakdown by severity. */
export const CveSeverityPanel = React.forwardRef<HTMLDivElement, CveSeverityPanelProps>(
  function CveSeverityPanel(
    { counts, title = "Vulnerabilities", layout = "rows", className, ...rest },
    ref,
  ) {
    const total = ORDER.reduce((sum, k) => sum + (counts[k] ?? 0), 0);

    return (
      <div ref={ref} className={cx("msr-Cve", className)} data-layout={layout} {...rest}>
        <div className="msr-Cve__header">
          <span className="msr-Cve__title">{title}</span>
          <span className="msr-Cve__total">{total} total</span>
        </div>

        {layout === "bar" ? (
          <div className="msr-Cve__bar" role="img" aria-label={`${total} vulnerabilities`}>
            {ORDER.map((k) => {
              const n = counts[k] ?? 0;
              if (!n) return null;
              return (
                <span
                  key={k}
                  className="msr-Cve__bar-seg"
                  data-severity={k}
                  style={{ flexGrow: n }}
                  title={`${LABELS[k]}: ${n}`}
                />
              );
            })}
            {total === 0 && <span className="msr-Cve__bar-seg" data-severity="none" style={{ flexGrow: 1 }} />}
          </div>
        ) : (
          <ul className="msr-Cve__rows">
            {ORDER.map((k) => {
              const n = counts[k] ?? 0;
              const pct = total ? (n / total) * 100 : 0;
              return (
                <li key={k} className="msr-Cve__row" data-severity={k}>
                  <span className="msr-Cve__dot" />
                  <span className="msr-Cve__label">{LABELS[k]}</span>
                  <span className="msr-Cve__track">
                    <span className="msr-Cve__fill" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="msr-Cve__count">{n}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
