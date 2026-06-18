import * as React from "react";
import { useClickOutsideObject, useEscapeKey } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Calendar } from "./Calendar";

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  disabled?: boolean;
  /** Format the displayed date. */
  format?: (date: Date) => string;
  clearable?: boolean;
  className?: string;
}

function defaultFormat(d: Date): string {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** Date input with a popover calendar (no external date library). */
export function DatePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  placeholder = "Select date",
  disabled,
  format = defaultFormat,
  clearable = true,
  className,
}: DatePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<Date | null>(defaultValue ?? null);
  const selected = controlled ? (value ?? null) : internal;
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useClickOutsideObject(wrapperRef, () => setOpen(false));
  useEscapeKey(() => setOpen(false));

  const commit = (d: Date | null) => {
    if (!controlled) setInternal(d);
    onChange?.(d);
  };

  return (
    <div ref={wrapperRef} className={cx("msr-DatePicker", className)} data-disabled={disabled || undefined}>
      <button
        type="button"
        className="msr-DatePicker__trigger"
        data-open={open || undefined}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="calendar" size={16} />
        <span className={cx("msr-DatePicker__value", !selected && "msr-DatePicker__placeholder")}>
          {selected ? format(selected) : placeholder}
        </span>
        {clearable && selected && !disabled && (
          <span
            className="msr-DatePicker__clear"
            role="button"
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); commit(null); }}
          >
            <Icon name="close" size={14} />
          </span>
        )}
      </button>
      {open && (
        <div className="msr-DatePicker__popover" role="dialog" aria-label="Choose date">
          <Calendar
            value={selected}
            min={min}
            max={max}
            onChange={(d) => {
              commit(d);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
