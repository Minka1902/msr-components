import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface ChecklistStep {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  done?: boolean;
  optional?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export interface SetupChecklistProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  steps: ChecklistStep[];
  title?: React.ReactNode;
  /** Show the "X of Y complete" progress summary. */
  showProgress?: boolean;
}

/** Checklist of required steps before something can be activated. */
export const SetupChecklist = React.forwardRef<HTMLDivElement, SetupChecklistProps>(
  function SetupChecklist(
    { steps, title = "Setup checklist", showProgress = true, className, ...rest },
    ref,
  ) {
    const required = steps.filter((s) => !s.optional);
    const doneCount = required.filter((s) => s.done).length;
    const pct = required.length ? Math.round((doneCount / required.length) * 100) : 0;

    return (
      <div ref={ref} className={cx("msr-Checklist", className)} {...rest}>
        <div className="msr-Checklist__header">
          <span className="msr-Checklist__title">{title}</span>
          {showProgress && (
            <span className="msr-Checklist__progress">
              {doneCount}/{required.length} complete
            </span>
          )}
        </div>
        {showProgress && (
          <div className="msr-Checklist__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <span className="msr-Checklist__fill" style={{ width: `${pct}%` }} />
          </div>
        )}
        <ul className="msr-Checklist__list">
          {steps.map((step) => (
            <li key={step.id} className="msr-Checklist__step" data-done={step.done || undefined}>
              <span className="msr-Checklist__check" aria-hidden="true">
                {step.done ? <Icon name="checkCircle" size={18} /> : <span className="msr-Checklist__circle" />}
              </span>
              <div className="msr-Checklist__content">
                <span className="msr-Checklist__label">
                  {step.label}
                  {step.optional && <span className="msr-Checklist__optional">Optional</span>}
                </span>
                {step.description && (
                  <span className="msr-Checklist__description">{step.description}</span>
                )}
              </div>
              {!step.done && step.onAction && (
                <button type="button" className="msr-Checklist__action" onClick={step.onAction}>
                  {step.actionLabel ?? "Complete"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
