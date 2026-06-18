import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface Step {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  /** Mark this step as errored. */
  error?: boolean;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  /** Index of the active step. */
  active: number;
  orientation?: "horizontal" | "vertical";
  /** Called when a completed/active step is clicked. */
  onStepClick?: (index: number) => void;
}

/** Progress stepper for multi-step flows/wizards. */
export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  { steps, active, orientation = "horizontal", onStepClick, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Stepper2", className)}
      data-orientation={orientation}
      {...rest}
    >
      {steps.map((step, i) => {
        const state = step.error ? "error" : i < active ? "complete" : i === active ? "active" : "upcoming";
        const clickable = onStepClick && i <= active;
        return (
          <div key={step.id} className="msr-Stepper2__step" data-state={state}>
            <div className="msr-Stepper2__indicator-wrap">
              <button
                type="button"
                className="msr-Stepper2__indicator"
                disabled={!clickable}
                aria-current={state === "active" ? "step" : undefined}
                onClick={() => clickable && onStepClick?.(i)}
              >
                {state === "complete" ? <Icon name="check" size={14} /> : state === "error" ? <Icon name="close" size={14} /> : i + 1}
              </button>
              {i < steps.length - 1 && <span className="msr-Stepper2__line" />}
            </div>
            <div className="msr-Stepper2__content">
              <span className="msr-Stepper2__label">{step.label}</span>
              {step.description && <span className="msr-Stepper2__desc">{step.description}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
});
