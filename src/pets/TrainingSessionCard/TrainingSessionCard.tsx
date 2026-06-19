import * as React from "react";
import { cx } from "../../lib/cx";
import { StatusBadge, type BadgeTone } from "../../components/StatusBadge/StatusBadge";

export type TrainingResult = "success" | "partial" | "failed";

export interface TrainingSessionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  objective: React.ReactNode;
  setup?: React.ReactNode;
  environment?: React.ReactNode;
  result?: TrainingResult;
  notes?: React.ReactNode;
  /** Trainer insights / takeaways. */
  insights?: string[];
  date?: React.ReactNode;
}

const RESULT: Record<TrainingResult, { label: string; tone: BadgeTone }> = {
  success: { label: "Success", tone: "success" },
  partial: { label: "Partial", tone: "warning" },
  failed: { label: "Needs work", tone: "danger" },
};

/** Training session record: objective, setup, environment, result, insights. */
export const TrainingSessionCard = React.forwardRef<HTMLDivElement, TrainingSessionCardProps>(
  function TrainingSessionCard(
    { objective, setup, environment, result, notes, insights = [], date, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-Training", className)} {...rest}>
        <div className="msr-Training__header">
          <div className="msr-Training__objective">
            <span className="msr-Training__label">Objective</span>
            <span className="msr-Training__title">{objective}</span>
          </div>
          {result && <StatusBadge tone={RESULT[result].tone} variant="soft">{RESULT[result].label}</StatusBadge>}
        </div>
        <dl className="msr-Training__meta">
          {setup != null && (<div><dt>Setup</dt><dd>{setup}</dd></div>)}
          {environment != null && (<div><dt>Environment</dt><dd>{environment}</dd></div>)}
          {date != null && (<div><dt>Date</dt><dd>{date}</dd></div>)}
        </dl>
        {notes && <p className="msr-Training__notes">{notes}</p>}
        {insights.length > 0 && (
          <div className="msr-Training__insights">
            <span className="msr-Training__label">Trainer insights</span>
            <ul>
              {insights.map((ins, i) => <li key={i}>{ins}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  },
);
