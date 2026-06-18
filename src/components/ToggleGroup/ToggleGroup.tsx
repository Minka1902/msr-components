import * as React from "react";
import { cx } from "../../lib/cx";

export interface ToggleOption {
  value: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface BaseProps {
  options: ToggleOption[];
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
}

export interface SingleToggleGroupProps extends BaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}
export interface MultiToggleGroupProps extends BaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
export type ToggleGroupProps = SingleToggleGroupProps | MultiToggleGroupProps;

/** Button group acting as a single- or multi-select toggle. */
export function ToggleGroup(props: ToggleGroupProps) {
  const { options, size = "md", disabled, className } = props;
  const multiple = props.multiple === true;
  const controlled = props.value !== undefined;

  const [singleInternal, setSingleInternal] = React.useState<string | null>(
    (props as SingleToggleGroupProps).defaultValue ?? null,
  );
  const [multiInternal, setMultiInternal] = React.useState<string[]>(
    (props as MultiToggleGroupProps).defaultValue ?? [],
  );

  const single = controlled ? ((props as SingleToggleGroupProps).value ?? null) : singleInternal;
  const multi = controlled ? ((props as MultiToggleGroupProps).value ?? []) : multiInternal;

  const toggle = (value: string) => {
    if (multiple) {
      const next = multi.includes(value) ? multi.filter((v) => v !== value) : [...multi, value];
      if (!controlled) setMultiInternal(next);
      (props as MultiToggleGroupProps).onValueChange?.(next);
    } else {
      const next = single === value ? null : value;
      if (!controlled) setSingleInternal(next);
      (props as SingleToggleGroupProps).onValueChange?.(next);
    }
  };

  const isOn = (value: string) => (multiple ? multi.includes(value) : single === value);

  return (
    <div role="group" className={cx("msr-ToggleGroup", className)} data-size={size} {...(disabled ? { "aria-disabled": true } : {})}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="msr-ToggleGroup__btn"
          aria-pressed={isOn(opt.value)}
          data-on={isOn(opt.value) || undefined}
          disabled={disabled || opt.disabled}
          onClick={() => toggle(opt.value)}
        >
          {opt.icon && <span className="msr-ToggleGroup__icon">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
