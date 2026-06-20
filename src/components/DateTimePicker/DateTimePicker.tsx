import * as React from "react";
import { cx } from "../../lib/cx";
import { DatePicker } from "../DatePicker";
import { TimePicker } from "../TimePicker";
import { minutesToHM } from "../../lib/date";

export interface DateTimePickerProps {
  /** A single `Date` carrying both the day and the time-of-day. */
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  /** Minute step for the time list. */
  step?: number;
  hour12?: boolean;
  disabled?: boolean;
  datePlaceholder?: string;
  timePlaceholder?: string;
  className?: string;
}

/** Combined day + time-of-day picker built from `DatePicker` + `TimePicker`. */
export function DateTimePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 30,
  hour12 = false,
  disabled,
  datePlaceholder = "Select date",
  timePlaceholder = "Time",
  className,
}: DateTimePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<Date | null>(defaultValue ?? null);
  const current = controlled ? (value ?? null) : internal;

  const commit = (d: Date | null) => {
    if (!controlled) setInternal(d);
    onChange?.(d);
  };

  const minutes = current ? current.getHours() * 60 + current.getMinutes() : null;

  const onDate = (d: Date | null) => {
    if (!d) {
      commit(null);
      return;
    }
    const next = new Date(d);
    if (current) {
      next.setHours(current.getHours(), current.getMinutes(), 0, 0);
    } else {
      next.setHours(0, 0, 0, 0);
    }
    commit(next);
  };

  const onTime = (m: number | null) => {
    if (m == null) {
      if (current) {
        const next = new Date(current);
        next.setHours(0, 0, 0, 0);
        commit(next);
      }
      return;
    }
    const base = current ? new Date(current) : new Date();
    const { h, m: mm } = minutesToHM(m);
    base.setHours(h, mm, 0, 0);
    commit(base);
  };

  return (
    <div className={cx("msr-DateTimePicker", className)} data-disabled={disabled || undefined}>
      <DatePicker
        value={current}
        onChange={onDate}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={datePlaceholder}
        clearable
      />
      <TimePicker
        value={minutes}
        onChange={onTime}
        step={step}
        hour12={hour12}
        disabled={disabled || !current}
        placeholder={timePlaceholder}
        clearable={false}
      />
    </div>
  );
}
