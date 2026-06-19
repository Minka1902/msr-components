import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { ProgressBar } from "../../charts/ProgressBar/ProgressBar";

export interface OnboardingTask {
  id: string;
  label: React.ReactNode;
  done?: boolean;
  onAction?: () => void;
  actionLabel?: string;
}

export interface BusinessOnboardingDashboardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tasks: OnboardingTask[];
  title?: React.ReactNode;
  /** Headline shown with the readiness %, e.g. "ready to launch". */
  readinessLabel?: string;
}

/** "You're N% ready to launch" dashboard with a task checklist. */
export const BusinessOnboardingDashboard = React.forwardRef<HTMLDivElement, BusinessOnboardingDashboardProps>(
  function BusinessOnboardingDashboard(
    { tasks, title = "Get ready to launch", readinessLabel = "ready to launch", className, ...rest },
    ref,
  ) {
    const done = tasks.filter((t) => t.done).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

    return (
      <div ref={ref} className={cx("msr-Onboarding", className)} {...rest}>
        <div className="msr-Onboarding__header">
          <span className="msr-Onboarding__title">{title}</span>
          <span className="msr-Onboarding__pct">
            <strong>{pct}%</strong> {readinessLabel}
          </span>
        </div>
        <ProgressBar value={pct} tone={pct === 100 ? "success" : "primary"} />
        <ul className="msr-Onboarding__tasks">
          {tasks.map((t) => (
            <li key={t.id} className="msr-Onboarding__task" data-done={t.done || undefined}>
              <span className="msr-Onboarding__check">
                {t.done ? <Icon name="checkCircle" size={18} /> : <span className="msr-Onboarding__circle" />}
              </span>
              <span className="msr-Onboarding__label">{t.label}</span>
              {!t.done && t.onAction && (
                <button type="button" className="msr-Onboarding__action" onClick={t.onAction}>
                  {t.actionLabel ?? "Start"}
                  <Icon name="arrowRight" size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
