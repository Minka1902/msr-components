import * as React from "react";
import { useClickOutsideObject, useEscapeKey } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import {
  MONTH_NAMES,
  monthGrid,
  orderedDow,
  sameDay,
  sameMonth,
  startOfDay,
  startOfMonth,
  addMonths,
  isBetween,
  type WeekStart,
} from "../../lib/date";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  min?: Date;
  max?: Date;
  weekStartsOn?: WeekStart;
  /** Number of month panels shown side by side. */
  numberOfMonths?: number;
  placeholder?: string;
  disabled?: boolean;
  format?: (date: Date) => string;
  className?: string;
}

const EMPTY_RANGE: DateRange = { start: null, end: null };

function defaultFormat(d: Date): string {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function MonthPanel({
  view,
  weekStartsOn,
  range,
  hover,
  min,
  max,
  onPick,
  onHover,
}: {
  view: Date;
  weekStartsOn: WeekStart;
  range: DateRange;
  hover: Date | null;
  min?: Date;
  max?: Date;
  onPick: (d: Date) => void;
  onHover: (d: Date | null) => void;
}) {
  const today = startOfDay(new Date());
  const cells = monthGrid(view.getFullYear(), view.getMonth(), weekStartsOn);
  const dow = orderedDow(weekStartsOn);
  const { start, end } = range;
  const previewEnd = end ?? hover;

  const disabled = (d: Date) =>
    (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || false;

  const inRange = (d: Date) =>
    start && previewEnd ? isBetween(d, start, previewEnd) : false;

  return (
    <div className="msr-DateRangePicker__panel">
      <div className="msr-DateRangePicker__monthTitle">
        {MONTH_NAMES[view.getMonth()]} {view.getFullYear()}
      </div>
      <div className="msr-DateRangePicker__dows">
        {dow.map((d) => (
          <span key={d} className="msr-DateRangePicker__dow">{d}</span>
        ))}
      </div>
      <div className="msr-DateRangePicker__grid" role="grid">
        {cells.map((d) => {
          const outside = !sameMonth(d, view);
          const isStart = start && sameDay(d, start);
          const isEnd = previewEnd && sameDay(d, previewEnd);
          return (
            <button
              key={d.toISOString()}
              type="button"
              role="gridcell"
              className="msr-DateRangePicker__day"
              disabled={disabled(d)}
              data-outside={outside || undefined}
              data-today={sameDay(d, today) || undefined}
              data-in-range={inRange(d) || undefined}
              data-range-start={isStart || undefined}
              data-range-end={isEnd || undefined}
              onClick={() => onPick(d)}
              onMouseEnter={() => onHover(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Pick a start/end date across two (or more) month panels with range preview. */
export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  min,
  max,
  weekStartsOn = 0,
  numberOfMonths = 2,
  placeholder = "Select range",
  disabled,
  format = defaultFormat,
  className,
}: DateRangePickerProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<DateRange>(defaultValue ?? EMPTY_RANGE);
  const range = controlled ? (value as DateRange) : internal;
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState<Date | null>(null);
  const [baseMonth, setBaseMonth] = React.useState(() =>
    startOfMonth(range.start ?? new Date()),
  );
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useClickOutsideObject(wrapperRef, () => setOpen(false));
  useEscapeKey(() => setOpen(false));

  const commit = (next: DateRange) => {
    if (!controlled) setInternal(next);
    onChange?.(next);
  };

  const pick = (d: Date) => {
    const { start, end } = range;
    if (!start || end) {
      // Begin a new range.
      commit({ start: d, end: null });
    } else if (d < start) {
      commit({ start: d, end: start });
      setOpen(false);
    } else {
      commit({ start, end: d });
      setOpen(false);
    }
  };

  const labelText =
    range.start && range.end
      ? `${format(range.start)} – ${format(range.end)}`
      : range.start
        ? `${format(range.start)} – …`
        : placeholder;

  return (
    <div ref={wrapperRef} className={cx("msr-DateRangePicker", className)} data-disabled={disabled || undefined}>
      <button
        type="button"
        className="msr-DateRangePicker__trigger"
        data-open={open || undefined}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="calendar" size={16} />
        <span className={cx("msr-DateRangePicker__value", !range.start && "msr-DateRangePicker__placeholder")}>
          {labelText}
        </span>
      </button>
      {open && (
        <div className="msr-DateRangePicker__popover" role="dialog" aria-label="Choose date range">
          <div className="msr-DateRangePicker__head">
            <button
              type="button"
              className="msr-DateRangePicker__nav"
              aria-label="Previous month"
              onClick={() => setBaseMonth(addMonths(baseMonth, -1))}
            >
              <Icon name="chevronLeft" size={16} />
            </button>
            <button
              type="button"
              className="msr-DateRangePicker__nav"
              aria-label="Next month"
              onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
            >
              <Icon name="chevronRight" size={16} />
            </button>
          </div>
          <div className="msr-DateRangePicker__panels" onMouseLeave={() => setHover(null)}>
            {Array.from({ length: numberOfMonths }, (_, i) => (
              <MonthPanel
                key={i}
                view={addMonths(baseMonth, i)}
                weekStartsOn={weekStartsOn}
                range={range}
                hover={hover}
                min={min}
                max={max}
                onPick={pick}
                onHover={setHover}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
