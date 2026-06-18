import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import type { InputSize, InputTone } from "../Input/Input";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options: SelectOption[];
  selectSize?: InputSize;
  tone?: InputTone;
  fullWidth?: boolean;
  /** Placeholder shown as a disabled first option. */
  placeholder?: string;
}

/** Styled wrapper around a native <select> (accessible by default). */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    selectSize = "md",
    tone = "default",
    fullWidth = false,
    placeholder,
    className,
    disabled,
    value,
    defaultValue,
    ...rest
  },
  ref,
) {
  return (
    <span
      className={cx("msr-Select", className)}
      data-size={selectSize}
      data-tone={tone}
      data-full-width={fullWidth || undefined}
      data-disabled={disabled || undefined}
    >
      <select
        ref={ref}
        className="msr-Select__field"
        disabled={disabled}
        aria-invalid={tone === "danger" || undefined}
        value={value}
        defaultValue={defaultValue ?? (placeholder && value === undefined ? "" : undefined)}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="msr-Select__chevron" aria-hidden="true">
        <Icon name="chevronDown" size={16} />
      </span>
    </span>
  );
});
