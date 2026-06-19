import * as React from "react";
import { cx } from "../../lib/cx";
import { RadialProgress } from "../../charts/RadialProgress/RadialProgress";

export interface HealthBreakdownItem {
  label: string;
  /** 0–100 contribution or score for this factor. */
  value: number;
  tone?: "success" | "warning" | "danger" | "info";
}

export interface HealthScoreCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Overall score 0–100. */
  score: number;
  title?: React.ReactNode;
  breakdown?: HealthBreakdownItem[];
  /** Optional descriptive grade, e.g. "Good". */
  grade?: string;
}

function scoreTone(score: number): "success" | "warning" | "danger" {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

/** Big health/quality score with a per-factor breakdown. */
export const HealthScoreCard = React.forwardRef<HTMLDivElement, HealthScoreCardProps>(
  function HealthScoreCard({ score, title = "Health score", breakdown, grade, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("msr-Health", className)} {...rest}>
        <div className="msr-Health__main">
          <RadialProgress value={score} tone={scoreTone(score)} size={104} thickness={10} />
          <div className="msr-Health__head">
            <span className="msr-Health__title">{title}</span>
            {grade && <span className="msr-Health__grade" data-tone={scoreTone(score)}>{grade}</span>}
          </div>
        </div>
        {breakdown && breakdown.length > 0 && (
          <ul className="msr-Health__breakdown">
            {breakdown.map((b) => (
              <li key={b.label} className="msr-Health__row">
                <span className="msr-Health__label">{b.label}</span>
                <span className="msr-Health__track">
                  <span className="msr-Health__fill" data-tone={b.tone ?? "info"} style={{ width: `${Math.max(0, Math.min(100, b.value))}%` }} />
                </span>
                <span className="msr-Health__value">{b.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
