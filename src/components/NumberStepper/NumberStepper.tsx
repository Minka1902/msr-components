import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useControllableState } from "../../lib/useControllableState";

export interface NumberStepperProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  /** Format the displayed value (e.g. currency). */
  format?: (value: number) => string;
}

/** Numeric input with increment/decrement buttons. */
export const NumberStepper = React.forwardRef<HTMLDivElement, NumberStepperProps>(
  function NumberStepper(
    { min = -Infinity, max = Infinity, step = 1, value, defaultValue, onValueChange, disabled, size = "md", format, className, ...rest },
    ref,
  ) {
    const [val, setVal] = useControllableState<number>({
      value,
      defaultValue: defaultValue ?? 0,
      onChange: onValueChange,
    });
    const clamp = (v: number) => Math.max(min, Math.min(max, v));

    return (
      <div ref={ref} className={cx("msr-Stepper", className)} data-size={size} data-disabled={disabled || undefined} {...rest}>
        <button
          type="button"
          className="msr-Stepper__btn"
          aria-label="Decrease"
          disabled={disabled || val <= min}
          onClick={() => setVal(clamp(val - step))}
        >
          <Icon name="minus" size={14} />
        </button>
        <input
          className="msr-Stepper__input"
          inputMode="numeric"
          role="spinbutton"
          aria-valuenow={val}
          aria-valuemin={min === -Infinity ? undefined : min}
          aria-valuemax={max === Infinity ? undefined : max}
          disabled={disabled}
          value={format ? format(val) : val}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/[^\d.-]/g, ""));
            if (!Number.isNaN(n)) setVal(clamp(n));
          }}
        />
        <button
          type="button"
          className="msr-Stepper__btn"
          aria-label="Increase"
          disabled={disabled || val >= max}
          onClick={() => setVal(clamp(val + step))}
        >
          <Icon name="plus" size={14} />
        </button>
      </div>
    );
  },
);
