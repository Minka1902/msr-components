import * as React from "react";
import { useClickOutsideObject, useEscapeKey } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { formatTime, minutesToHM } from "../../lib/date";

export interface TimePickerProps {
  /** Minutes since midnight (0–1439), or null. */
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (minutes: number | null) => void;
  /** Step between options, in minutes. */
  step?: number;
  /** Earliest selectable time, minutes since midnight. */
  min?: number;
  /** Latest selectable time, minutes since midnight. */
  max?: number;
  hour12?: boolean;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

/** Time selector with a scrollable list of stepped options (no date dep). */
export function TimePicker({
  value,
  defaultValue,
  onChange,
  step = 30,
  min = 0,
  max = 1439,
  hour12 = false,
  placeholder = "Select time",
  disabled,
  clearable = true,
  className,
}: TimePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<number | null>(defaultValue ?? null);
  const selected = controlled ? (value ?? null) : internal;
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  useClickOutsideObject(wrapperRef, () => setOpen(false));
  useEscapeKey(() => setOpen(false));

  const options = React.useMemo(() => {
    const out: number[] = [];
    for (let m = min; m <= max; m += step) out.push(m);
    return out;
  }, [min, max, step]);

  const commit = (m: number | null) => {
    if (!controlled) setInternal(m);
    onChange?.(m);
  };

  // Scroll the selected option into view when the list opens.
  React.useEffect(() => {
    if (!open || selected == null) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-selected="true"]');
    el?.scrollIntoView?.({ block: "center" });
  }, [open, selected]);

  const label = (m: number) => {
    const { h, m: mm } = minutesToHM(m);
    return formatTime(h, mm, hour12);
  };

  return (
    <div ref={wrapperRef} className={cx("msr-TimePicker", className)} data-disabled={disabled || undefined}>
      <button
        type="button"
        className="msr-TimePicker__trigger"
        data-open={open || undefined}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="clock" size={16} />
        <span className={cx("msr-TimePicker__value", selected == null && "msr-TimePicker__placeholder")}>
          {selected == null ? placeholder : label(selected)}
        </span>
        {clearable && selected != null && !disabled && (
          <span
            className="msr-TimePicker__clear"
            role="button"
            aria-label="Clear time"
            onClick={(e) => { e.stopPropagation(); commit(null); }}
          >
            <Icon name="close" size={14} />
          </span>
        )}
      </button>
      {open && (
        <div ref={listRef} className="msr-TimePicker__popover" role="listbox" aria-label="Choose time">
          {options.map((m) => (
            <button
              key={m}
              type="button"
              role="option"
              aria-selected={selected === m}
              data-selected={selected === m}
              className="msr-TimePicker__option"
              onClick={() => { commit(m); setOpen(false); }}
            >
              {label(m)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
