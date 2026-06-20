import * as React from "react";
import { cx } from "../../lib/cx";
import { Stepper, type Step } from "../../components/Stepper/Stepper";
import { ProgressBar } from "../../charts/ProgressBar/ProgressBar";

export interface SetupStep extends Step {
  done?: boolean;
}

export interface SetupProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  steps: SetupStep[];
  title?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  onStepClick?: (index: number) => void;
}

/** Setup tracker showing completed/remaining steps + overall progress. */
export const SetupProgress = React.forwardRef<HTMLDivElement, SetupProgressProps>(
  function SetupProgress({ steps, title = "Setup progress", orientation = "vertical", onStepClick, className, ...rest }, ref) {
    const doneCount = steps.filter((s) => s.done).length;
    // Active = first not-done step (or all done).
    const active = steps.findIndex((s) => !s.done);
    const activeIndex = active < 0 ? steps.length : active;
    const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

    return (
      <div ref={ref} className={cx("msr-SetupProgress", className)} {...rest}>
        <div className="msr-SetupProgress__header">
          <span className="msr-SetupProgress__title">{title}</span>
          <span className="msr-SetupProgress__count">{doneCount}/{steps.length}</span>
        </div>
        <ProgressBar value={pct} tone={pct === 100 ? "success" : "primary"} />
        <div className="msr-SetupProgress__steps">
          <Stepper steps={steps} active={activeIndex} orientation={orientation} onStepClick={onStepClick} />
        </div>
      </div>
    );
  },
);
