import * as React from "react";
import { cx } from "../../lib/cx";

export interface SeverityCounts {
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export interface SeverityPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  counts: SeverityCounts;
  title?: React.ReactNode;
  /** Render as a single stacked bar instead of per-severity rows. */
  layout?: "rows" | "bar";
}

const ORDER: Array<keyof SeverityCounts> = ["critical", "high", "medium", "low"];
const LABELS: Record<keyof SeverityCounts, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

/** Vulnerability breakdown by severity. */
export const SeverityPanel = React.forwardRef<HTMLDivElement, SeverityPanelProps>(
  function SeverityPanel(
    { counts, title = "Vulnerabilities", layout = "rows", className, ...rest },
    ref,
  ) {
    const total = ORDER.reduce((sum, k) => sum + (counts[k] ?? 0), 0);

    return (
      <div ref={ref} className={cx("msr-SeverityPanel", className)} data-layout={layout} {...rest}>
        <div className="msr-SeverityPanel__header">
          <span className="msr-SeverityPanel__title">{title}</span>
          <span className="msr-SeverityPanel__total">{total} total</span>
        </div>

        {layout === "bar" ? (
          <div className="msr-SeverityPanel__bar" role="img" aria-label={`${total} vulnerabilities`}>
            {ORDER.map((k) => {
              const n = counts[k] ?? 0;
              if (!n) return null;
              return (
                <span
                  key={k}
                  className="msr-SeverityPanel__bar-seg"
                  data-severity={k}
                  style={{ flexGrow: n }}
                  title={`${LABELS[k]}: ${n}`}
                />
              );
            })}
            {total === 0 && <span className="msr-SeverityPanel__bar-seg" data-severity="none" style={{ flexGrow: 1 }} />}
          </div>
        ) : (
          <ul className="msr-SeverityPanel__rows">
            {ORDER.map((k) => {
              const n = counts[k] ?? 0;
              const pct = total ? (n / total) * 100 : 0;
              return (
                <li key={k} className="msr-SeverityPanel__row" data-severity={k}>
                  <span className="msr-SeverityPanel__dot" />
                  <span className="msr-SeverityPanel__label">{LABELS[k]}</span>
                  <span className="msr-SeverityPanel__track">
                    <span className="msr-SeverityPanel__fill" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="msr-SeverityPanel__count">{n}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
