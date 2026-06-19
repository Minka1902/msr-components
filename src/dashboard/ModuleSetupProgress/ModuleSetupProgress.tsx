import * as React from "react";
import { cx } from "../../lib/cx";
import { Stepper, type Step } from "../../components/Stepper/Stepper";
import { ProgressBar } from "../../charts/ProgressBar/ProgressBar";

export interface SetupStep extends Step {
  done?: boolean;
}

export interface ModuleSetupProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  steps: SetupStep[];
  title?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  onStepClick?: (index: number) => void;
}

/** Setup tracker showing completed/remaining steps + overall progress. */
export const ModuleSetupProgress = React.forwardRef<HTMLDivElement, ModuleSetupProgressProps>(
  function ModuleSetupProgress({ steps, title = "Setup progress", orientation = "vertical", onStepClick, className, ...rest }, ref) {
    const doneCount = steps.filter((s) => s.done).length;
    // Active = first not-done step (or all done).
    const active = steps.findIndex((s) => !s.done);
    const activeIndex = active < 0 ? steps.length : active;
    const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

    return (
      <div ref={ref} className={cx("msr-ModuleSetup", className)} {...rest}>
        <div className="msr-ModuleSetup__header">
          <span className="msr-ModuleSetup__title">{title}</span>
          <span className="msr-ModuleSetup__count">{doneCount}/{steps.length}</span>
        </div>
        <ProgressBar value={pct} tone={pct === 100 ? "success" : "primary"} />
        <div className="msr-ModuleSetup__steps">
          <Stepper steps={steps} active={activeIndex} orientation={orientation} onStepClick={onStepClick} />
        </div>
      </div>
    );
  },
);
