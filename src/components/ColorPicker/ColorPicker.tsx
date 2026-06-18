import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

const DEFAULT_SWATCHES = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#ec4899", "#f43f5e", "#64748b", "#111827", "#ffffff",
];

export interface ColorPickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Swatch palette to show. */
  swatches?: string[];
  /** Show the native color input + hex field. */
  showCustom?: boolean;
  disabled?: boolean;
}

/** Color picker with a swatch palette, native picker, and hex entry. */
export const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  function ColorPicker(
    { value, defaultValue, onValueChange, swatches = DEFAULT_SWATCHES, showCustom = true, disabled, className, ...rest },
    ref,
  ) {
    const [color, setColor] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? swatches[0],
      onChange: onValueChange,
    });

    return (
      <div ref={ref} className={cx("msr-ColorPicker", className)} data-disabled={disabled || undefined} {...rest}>
        <div className="msr-ColorPicker__swatches" role="radiogroup" aria-label="Color">
          {swatches.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={c.toLowerCase() === color.toLowerCase()}
              aria-label={c}
              className="msr-ColorPicker__swatch"
              data-selected={c.toLowerCase() === color.toLowerCase() || undefined}
              style={{ backgroundColor: c }}
              disabled={disabled}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        {showCustom && (
          <div className="msr-ColorPicker__custom">
            <input
              type="color"
              className="msr-ColorPicker__native"
              value={color}
              disabled={disabled}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Custom color"
            />
            <input
              type="text"
              className="msr-ColorPicker__hex"
              value={color}
              disabled={disabled}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Hex value"
            />
          </div>
        )}
      </div>
    );
  },
);
