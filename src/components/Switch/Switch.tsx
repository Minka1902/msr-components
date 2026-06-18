import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export type SwitchSize = "sm" | "md";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
}

/** Accessible on/off switch (role="switch"). */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, size = "md", className, disabled, ...rest },
  ref,
) {
  const [on, setOn] = useControllableState<boolean>({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      className={cx("msr-Switch", className)}
      data-size={size}
      disabled={disabled}
      onClick={() => setOn(!on)}
      {...rest}
    >
      <span className="msr-Switch__thumb" />
    </button>
  );
});
