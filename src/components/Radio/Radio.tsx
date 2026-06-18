import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  name?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
}

/** Accessible radio group built on native inputs. */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      name,
      options,
      value,
      defaultValue,
      onValueChange,
      orientation = "vertical",
      disabled,
      className,
      ...rest
    },
    ref,
  ) {
    const reactName = React.useId();
    const groupName = name ?? reactName;
    const [selected, setSelected] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? "",
      onChange: onValueChange,
    });

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cx("msr-RadioGroup", className)}
        data-orientation={orientation}
        {...rest}
      >
        {options.map((opt) => {
          const optDisabled = disabled || opt.disabled;
          return (
            <label
              key={opt.value}
              className="msr-Radio"
              data-disabled={optDisabled || undefined}
            >
              <span className="msr-Radio__circle">
                <input
                  type="radio"
                  className="msr-Radio__input"
                  name={groupName}
                  value={opt.value}
                  checked={selected === opt.value}
                  disabled={optDisabled}
                  onChange={() => setSelected(opt.value)}
                />
                <span className="msr-Radio__dot" aria-hidden="true" />
              </span>
              <span className="msr-Radio__label">{opt.label}</span>
            </label>
          );
        })}
      </div>
    );
  },
);
