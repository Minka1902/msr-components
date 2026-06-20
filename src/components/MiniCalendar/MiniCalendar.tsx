import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import {
  MONTH_NAMES_SHORT,
  monthGrid,
  orderedDow,
  sameDay,
  sameMonth,
  startOfDay,
  startOfMonth,
  addMonths,
  type WeekStart,
} from "../../lib/date";

export interface MiniCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  weekStartsOn?: WeekStart;
  /** Highlight these days with a marker dot (e.g. days that have events). */
  markedDays?: Date[];
}

/** Compact single-month calendar for sidebars and date popovers. */
export const MiniCalendar = React.forwardRef<HTMLDivElement, MiniCalendarProps>(function MiniCalendar(
  { value, defaultValue, onChange, min, max, weekStartsOn = 0, markedDays, className, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<Date | null>(defaultValue ?? null);
  const selected = controlled ? (value ?? null) : internal;
  const [view, setView] = React.useState(() => startOfMonth(selected ?? new Date()));

  const today = startOfDay(new Date());
  const cells = monthGrid(view.getFullYear(), view.getMonth(), weekStartsOn);
  const dow = orderedDow(weekStartsOn);

  const marked = React.useMemo(() => {
    const set = new Set<string>();
    for (const d of markedDays ?? []) set.add(startOfDay(d).toDateString());
    return set;
  }, [markedDays]);

  const disabled = (d: Date) =>
    (min && d < startOfDay(min)) || (max && d > startOfDay(max)) || false;

  const pick = (d: Date) => {
    if (!controlled) setInternal(d);
    onChange?.(d);
  };

  return (
    <div ref={ref} className={cx("msr-MiniCalendar", className)} {...rest}>
      <div className="msr-MiniCalendar__header">
        <button
          type="button"
          className="msr-MiniCalendar__nav"
          aria-label="Previous month"
          onClick={() => setView(addMonths(view, -1))}
        >
          <Icon name="chevronLeft" size={14} />
        </button>
        <span className="msr-MiniCalendar__title">
          {MONTH_NAMES_SHORT[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          className="msr-MiniCalendar__nav"
          aria-label="Next month"
          onClick={() => setView(addMonths(view, 1))}
        >
          <Icon name="chevronRight" size={14} />
        </button>
      </div>
      <div className="msr-MiniCalendar__grid" role="grid">
        {dow.map((d) => (
          <span key={d} className="msr-MiniCalendar__dow">{d[0]}</span>
        ))}
        {cells.map((d) => (
          <button
            key={d.toISOString()}
            type="button"
            role="gridcell"
            className="msr-MiniCalendar__day"
            disabled={disabled(d)}
            data-outside={!sameMonth(d, view) || undefined}
            data-today={sameDay(d, today) || undefined}
            data-selected={selected ? sameDay(d, selected) || undefined : undefined}
            data-marked={marked.has(d.toDateString()) || undefined}
            aria-selected={selected ? sameDay(d, selected) : undefined}
            onClick={() => pick(d)}
          >
            {d.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
});
