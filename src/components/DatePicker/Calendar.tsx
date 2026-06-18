import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date | null;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Month-view calendar grid. */
export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { value, onChange, min, max, weekStartsOn = 0, className, ...rest },
  ref,
) {
  const today = startOfDay(new Date());
  const [view, setView] = React.useState(() => value ?? today);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDow = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  const dow = [...DOW.slice(weekStartsOn), ...DOW.slice(0, weekStartsOn)];
  const disabled = (d: Date) => (min && d < startOfDay(min)) || (max && d > startOfDay(max));

  return (
    <div ref={ref} className={cx("msr-Calendar", className)} {...rest}>
      <div className="msr-Calendar__header">
        <button type="button" className="msr-Calendar__nav" aria-label="Previous month" onClick={() => setView(new Date(year, month - 1, 1))}>
          <Icon name="chevronLeft" size={16} />
        </button>
        <span className="msr-Calendar__title">{MONTHS[month]} {year}</span>
        <button type="button" className="msr-Calendar__nav" aria-label="Next month" onClick={() => setView(new Date(year, month + 1, 1))}>
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
      <div className="msr-Calendar__grid" role="grid">
        {dow.map((d) => (
          <span key={d} className="msr-Calendar__dow">{d}</span>
        ))}
        {cells.map((d, i) =>
          d === null ? (
            <span key={`e${i}`} />
          ) : (
            <button
              key={d.toISOString()}
              type="button"
              className="msr-Calendar__day"
              role="gridcell"
              disabled={disabled(d)}
              data-today={sameDay(d, today) || undefined}
              data-selected={value ? sameDay(d, value) || undefined : undefined}
              aria-selected={value ? sameDay(d, value) : undefined}
              onClick={() => onChange?.(d)}
            >
              {d.getDate()}
            </button>
          ),
        )}
      </div>
    </div>
  );
});
