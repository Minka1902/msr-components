import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* ValidationSummary                                                   */
/* ------------------------------------------------------------------ */

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  message: string;
  severity?: ValidationSeverity;
  field?: string;
  row?: number;
  section?: string;
}

export interface ValidationSummaryProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  issues: ValidationIssue[];
  /** Group issues by this dimension. */
  groupBy?: "field" | "row" | "section" | "severity";
  title?: React.ReactNode;
  /** Jump to the offending field/row. */
  onIssueClick?: (issue: ValidationIssue) => void;
}

const SEVERITY_RANK: Record<ValidationSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

/** Structured display of validation errors/warnings, optionally grouped. */
export const ValidationSummary = React.forwardRef<
  HTMLDivElement,
  ValidationSummaryProps
>(function ValidationSummary(
  { issues, groupBy, title, onIssueClick, className, ...rest },
  ref,
) {
  const counts = issues.reduce(
    (acc, i) => {
      const s = i.severity ?? "error";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const groups = React.useMemo(() => {
    if (!groupBy) return null;
    const map = new Map<string, ValidationIssue[]>();
    for (const issue of issues) {
      const key =
        groupBy === "row"
          ? issue.row != null
            ? `Row ${issue.row}`
            : "Other"
          : (issue[groupBy] as string) ?? "Other";
      const arr = map.get(key) ?? [];
      arr.push(issue);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [issues, groupBy]);

  const renderIssue = (issue: ValidationIssue, key: React.Key) => {
    const sev = issue.severity ?? "error";
    const Comp = onIssueClick ? "button" : "div";
    return (
      <Comp
        key={key}
        type={onIssueClick ? "button" : undefined}
        className="msr-Validation__issue"
        data-severity={sev}
        onClick={onIssueClick ? () => onIssueClick(issue) : undefined}
      >
        <span className="msr-Validation__dot" aria-hidden="true" />
        <span className="msr-Validation__msg">{issue.message}</span>
        {(issue.field || issue.row != null) && (
          <span className="msr-Validation__loc">
            {issue.field}
            {issue.field && issue.row != null ? " · " : ""}
            {issue.row != null ? `row ${issue.row}` : ""}
          </span>
        )}
      </Comp>
    );
  };

  if (issues.length === 0) {
    return (
      <div
        ref={ref}
        className={cx("msr-Validation", "msr-Validation--ok", className)}
        {...rest}
      >
        <span className="msr-Validation__okIcon" aria-hidden="true">
          ✓
        </span>
        All checks passed.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cx("msr-Validation", className)}
      role="alert"
      {...rest}
    >
      <div className="msr-Validation__head">
        <span className="msr-Validation__title">
          {title ?? "Validation results"}
        </span>
        <span className="msr-Validation__counts">
          {(["error", "warning", "info"] as ValidationSeverity[])
            .filter((s) => counts[s])
            .map((s) => (
              <span key={s} className="msr-Validation__count" data-severity={s}>
                {counts[s]} {s}
                {counts[s] === 1 ? "" : "s"}
              </span>
            ))}
        </span>
      </div>
      {groups ? (
        <div className="msr-Validation__groups">
          {groups.map(([name, list]) => (
            <div key={name} className="msr-Validation__group">
              <div className="msr-Validation__groupName">{name}</div>
              {list
                .slice()
                .sort(
                  (a, b) =>
                    SEVERITY_RANK[a.severity ?? "error"] -
                    SEVERITY_RANK[b.severity ?? "error"],
                )
                .map((issue, i) => renderIssue(issue, i))}
            </div>
          ))}
        </div>
      ) : (
        <div className="msr-Validation__list">
          {issues
            .slice()
            .sort(
              (a, b) =>
                SEVERITY_RANK[a.severity ?? "error"] -
                SEVERITY_RANK[b.severity ?? "error"],
            )
            .map((issue, i) => renderIssue(issue, i))}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* DataQualityPanel                                                    */
/* ------------------------------------------------------------------ */

export interface DataQualityMetric {
  label: string;
  /** 0–100. */
  value: number;
  detail?: string;
  tone?: "success" | "warning" | "danger" | "info";
}

export interface DataQualityPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Overall completeness score 0–100. */
  score?: number;
  metrics: DataQualityMetric[];
}

function toneForScore(score: number): NonNullable<DataQualityMetric["tone"]> {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

/** Shows completeness score and data-quality metrics (missing, invalid…). */
export const DataQualityPanel = React.forwardRef<
  HTMLDivElement,
  DataQualityPanelProps
>(function DataQualityPanel({ score, metrics, className, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("msr-DataQuality", className)} {...rest}>
      {score != null && (
        <div
          className="msr-DataQuality__score"
          data-tone={toneForScore(score)}
        >
          <div className="msr-DataQuality__scoreValue">{Math.round(score)}</div>
          <div className="msr-DataQuality__scoreLabel">Quality score</div>
        </div>
      )}
      <ul className="msr-DataQuality__metrics">
        {metrics.map((m, i) => (
          <li key={i} className="msr-DataQuality__metric">
            <div className="msr-DataQuality__metricHead">
              <span>{m.label}</span>
              <span className="msr-DataQuality__metricValue">{m.value}%</span>
            </div>
            <div className="msr-DataQuality__track">
              <div
                className="msr-DataQuality__fill"
                data-tone={m.tone ?? toneForScore(m.value)}
                style={{ width: `${Math.max(0, Math.min(100, m.value))}%` }}
              />
            </div>
            {m.detail && (
              <div className="msr-DataQuality__detail">{m.detail}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});
