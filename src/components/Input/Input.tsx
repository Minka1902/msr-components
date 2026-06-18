import * as React from "react";
import { cx } from "../../lib/cx";

export type InputSize = "sm" | "md" | "lg";
export type InputTone = "default" | "danger";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: InputSize;
  tone?: InputTone;
  /** Content rendered inside the field on the left (e.g. an icon). */
  leftIcon?: React.ReactNode;
  /** Content rendered inside the field on the right. */
  rightIcon?: React.ReactNode;
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
}

/** Text input with optional leading/trailing adornments and tones. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    inputSize = "md",
    tone = "default",
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <span
      className={cx("msr-Input", className)}
      data-size={inputSize}
      data-tone={tone}
      data-full-width={fullWidth || undefined}
      data-disabled={disabled || undefined}
    >
      {leftIcon && <span className="msr-Input__icon" data-side="left">{leftIcon}</span>}
      <input
        ref={ref}
        className="msr-Input__field"
        disabled={disabled}
        aria-invalid={tone === "danger" || undefined}
        {...rest}
      />
      {rightIcon && <span className="msr-Input__icon" data-side="right">{rightIcon}</span>}
    </span>
  );
});
