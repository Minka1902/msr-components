import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface OnboardingTask {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  done?: boolean;
  /** Optional action button label. */
  actionLabel?: string;
}

export interface OnboardingChecklistProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "title"> {
  title?: React.ReactNode;
  tasks: OnboardingTask[];
  /** Called when a task row (or its action) is activated. */
  onTaskAction?: (task: OnboardingTask) => void;
  /** Toggle a task's done state (renders an interactive checkbox). */
  onToggle?: (task: OnboardingTask, done: boolean) => void;
  /** Show the completion progress bar + percentage. */
  showProgress?: boolean;
  /** Optional dismiss handler — renders a close button. */
  onDismiss?: () => void;
}

/** Getting-started checklist with progress for new users. */
export const OnboardingChecklist = React.forwardRef<HTMLDivElement, OnboardingChecklistProps>(
  function OnboardingChecklist(
    { title = "Get started", tasks, onTaskAction, onToggle, showProgress = true, onDismiss, className, ...rest },
    ref,
  ) {
    const done = tasks.filter((t) => t.done).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

    return (
      <div ref={ref} className={cx("msr-OnboardingChecklist", className)} {...rest}>
        <div className="msr-OnboardingChecklist__header">
          <div className="msr-OnboardingChecklist__heading">{title}</div>
          {onDismiss && (
            <button type="button" className="msr-OnboardingChecklist__dismiss" aria-label="Dismiss" onClick={onDismiss}>
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        {showProgress && (
          <div className="msr-OnboardingChecklist__progress">
            <div
              className="msr-OnboardingChecklist__bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className="msr-OnboardingChecklist__fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="msr-OnboardingChecklist__pct">
              {done} of {tasks.length} · {pct}%
            </span>
          </div>
        )}

        <ul className="msr-OnboardingChecklist__list">
          {tasks.map((task) => (
            <li key={task.id} className="msr-OnboardingChecklist__task" data-done={task.done || undefined}>
              {onToggle ? (
                <button
                  type="button"
                  className="msr-OnboardingChecklist__check"
                  role="checkbox"
                  aria-checked={!!task.done}
                  aria-label={typeof task.title === "string" ? task.title : "Toggle task"}
                  onClick={() => onToggle(task, !task.done)}
                >
                  {task.done && <Icon name="check" size={14} />}
                </button>
              ) : (
                <span className="msr-OnboardingChecklist__check" data-static aria-hidden="true">
                  {task.done && <Icon name="check" size={14} />}
                </span>
              )}
              <div className="msr-OnboardingChecklist__taskBody">
                <span className="msr-OnboardingChecklist__taskTitle">{task.title}</span>
                {task.description && (
                  <span className="msr-OnboardingChecklist__taskDesc">{task.description}</span>
                )}
              </div>
              {!task.done && task.actionLabel && (
                <button
                  type="button"
                  className="msr-OnboardingChecklist__action"
                  onClick={() => onTaskAction?.(task)}
                >
                  {task.actionLabel}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
