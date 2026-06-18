import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface SegmentOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

/** iOS-style segmented control with an animated active thumb. */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { options, value, defaultValue, onValueChange, size = "md", fullWidth, className, ...rest },
    ref,
  ) {
    const [active, setActive] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? options[0]?.value ?? "",
      onChange: onValueChange,
    });
    const activeIndex = Math.max(0, options.findIndex((o) => o.value === active));

    return (
      <div
        ref={ref}
        role="tablist"
        className={cx("msr-Segmented", className)}
        data-size={size}
        data-full-width={fullWidth || undefined}
        style={{ "--seg-count": options.length, "--seg-active": activeIndex } as React.CSSProperties}
        {...rest}
      >
        <span className="msr-Segmented__thumb" aria-hidden="true" />
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={opt.value === active}
            disabled={opt.disabled}
            className="msr-Segmented__option"
            data-selected={opt.value === active || undefined}
            onClick={() => setActive(opt.value)}
          >
            {opt.icon && <span className="msr-Segmented__icon">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    );
  },
);
