import * as React from "react";
import { cx } from "../../lib/cx";
import { Stepper, type Step } from "../../components/Stepper/Stepper";
import { Button } from "../../components/Button/Button";

export interface WizardStep extends Step {
  /** Content rendered for this step. */
  content: React.ReactNode;
}

export interface SetupWizardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  steps: WizardStep[];
  active?: number;
  defaultActive?: number;
  onActiveChange?: (index: number) => void;
  onFinish?: () => void;
  finishLabel?: string;
  orientation?: "horizontal" | "vertical";
}

/** Multi-step wizard (enable → configure → test → publish) built on Stepper. */
export const SetupWizard = React.forwardRef<HTMLDivElement, SetupWizardProps>(
  function SetupWizard(
    { steps, active, defaultActive = 0, onActiveChange, onFinish, finishLabel = "Finish", orientation = "horizontal", className, ...rest },
    ref,
  ) {
    const controlled = active !== undefined;
    const [internal, setInternal] = React.useState(defaultActive);
    const current = controlled ? active! : internal;

    const goto = (i: number) => {
      const clamped = Math.max(0, Math.min(steps.length - 1, i));
      if (!controlled) setInternal(clamped);
      onActiveChange?.(clamped);
    };

    const isLast = current >= steps.length - 1;

    return (
      <div ref={ref} className={cx("msr-Wizard", className)} {...rest}>
        <Stepper steps={steps} active={current} orientation={orientation} onStepClick={(i) => i < current && goto(i)} />
        <div className="msr-Wizard__content">{steps[current]?.content}</div>
        <div className="msr-Wizard__actions">
          <Button variant="ghost" tone="neutral" disabled={current === 0} onClick={() => goto(current - 1)}>
            Back
          </Button>
          {isLast ? (
            <Button onClick={() => onFinish?.()}>{finishLabel}</Button>
          ) : (
            <Button onClick={() => goto(current + 1)}>Next</Button>
          )}
        </div>
      </div>
    );
  },
);
