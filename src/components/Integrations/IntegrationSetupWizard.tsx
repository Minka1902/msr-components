import * as React from "react";
import { cx } from "../../lib/cx";

export interface IntegrationSetupStep {
  id: string;
  label: React.ReactNode;
  /** Step content (auth form, API key input, webhook config…). */
  content: React.ReactNode;
  /** Block advancing past this step until true. */
  complete?: boolean;
  optional?: boolean;
}

export interface IntegrationSetupWizardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  steps: IntegrationSetupStep[];
  /** Controlled active step index. */
  activeStep?: number;
  onStepChange?: (index: number) => void;
  onFinish?: () => void;
  finishLabel?: string;
}

/** Guided setup flow for OAuth, API keys, webhooks and connection testing. */
export const IntegrationSetupWizard = React.forwardRef<
  HTMLDivElement,
  IntegrationSetupWizardProps
>(function IntegrationSetupWizard(
  {
    steps,
    activeStep,
    onStepChange,
    onFinish,
    finishLabel = "Finish setup",
    className,
    ...rest
  },
  ref,
) {
  const [internal, setInternal] = React.useState(0);
  const current = activeStep ?? internal;
  const go = (i: number) => {
    setInternal(i);
    onStepChange?.(i);
  };
  const step = steps[current];
  const isLast = current === steps.length - 1;
  const canAdvance = step?.complete || step?.optional;

  return (
    <div ref={ref} className={cx("msr-IntSetup", className)} {...rest}>
      <ol className="msr-IntSetup__steps">
        {steps.map((s, i) => (
          <li
            key={s.id}
            className="msr-IntSetup__step"
            data-active={i === current || undefined}
            data-done={(s.complete && i < current) || undefined}
          >
            <button
              type="button"
              onClick={() => go(i)}
              disabled={i > current && !steps[i - 1]?.complete}
            >
              <span className="msr-IntSetup__num">
                {s.complete && i < current ? "✓" : i + 1}
              </span>
              <span className="msr-IntSetup__label">
                {s.label}
                {s.optional && (
                  <span className="msr-IntSetup__optional">optional</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="msr-IntSetup__body">{step?.content}</div>
      <div className="msr-IntSetup__footer">
        <button
          type="button"
          className="msr-IntSetup__back"
          onClick={() => go(current - 1)}
          disabled={current === 0}
        >
          Back
        </button>
        <button
          type="button"
          className="msr-IntSetup__next"
          disabled={!canAdvance}
          onClick={() => (isLast ? onFinish?.() : go(current + 1))}
        >
          {isLast ? finishLabel : "Continue"}
        </button>
      </div>
    </div>
  );
});
