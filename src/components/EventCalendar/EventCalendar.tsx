import * as React from "react";
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
  type WeekStart,
} from "../../lib/date";

export interface CalendarEvent {
  id: string;
  /** Day the event occurs on. Time is ignored for placement on the grid. */
  date: Date;
  title: string;
  /** Token tone used for the event dot/pill. */
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export interface EventCalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onSelect"> {
  /** Events to render across the visible month. */
  events?: CalendarEvent[];
  /** Controlled visible month (any date within it). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Currently selected day. */
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  weekStartsOn?: WeekStart;
  /** Max event pills to show per day before "+N more". */
  maxPerDay?: number;
}

/** Full month grid that lays out events as pills on each day. */
export const EventCalendar = React.forwardRef<HTMLDivElement, EventCalendarProps>(function EventCalendar(
  {
    events = [],
    month,
    defaultMonth,
    onMonthChange,
    selected,
    onSelect,
    onEventClick,
    weekStartsOn = 0,
    maxPerDay = 3,
    className,
    ...rest
  },
  ref,
) {
  const controlled = month !== undefined;
  const [internal, setInternal] = React.useState(() => startOfMonth(defaultMonth ?? new Date()));
  const view = startOfMonth(controlled ? (month as Date) : internal);

  const setView = (next: Date) => {
    if (!controlled) setInternal(next);
    onMonthChange?.(next);
  };

  const today = startOfDay(new Date());
  const cells = monthGrid(view.getFullYear(), view.getMonth(), weekStartsOn);
  const dow = orderedDow(weekStartsOn);

  const byDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = startOfDay(ev.date).toDateString();
      const list = map.get(key);
      if (list) list.push(ev);
      else map.set(key, [ev]);
    }
    return map;
  }, [events]);

  return (
    <div ref={ref} className={cx("msr-EventCalendar", className)} {...rest}>
      <div className="msr-EventCalendar__header">
        <button
          type="button"
          className="msr-EventCalendar__nav"
          aria-label="Previous month"
          onClick={() => setView(addMonths(view, -1))}
        >
          <Icon name="chevronLeft" size={18} />
        </button>
        <span className="msr-EventCalendar__title">
          {MONTH_NAMES[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          className="msr-EventCalendar__nav"
          aria-label="Next month"
          onClick={() => setView(addMonths(view, 1))}
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>

      <div className="msr-EventCalendar__dows">
        {dow.map((d) => (
          <span key={d} className="msr-EventCalendar__dow">{d}</span>
        ))}
      </div>

      <div className="msr-EventCalendar__grid" role="grid">
        {cells.map((d) => {
          const dayEvents = byDay.get(d.toDateString()) ?? [];
          const shown = dayEvents.slice(0, maxPerDay);
          const overflow = dayEvents.length - shown.length;
          const outside = !sameMonth(d, view);
          return (
            <div
              key={d.toISOString()}
              className="msr-EventCalendar__cell"
              role="gridcell"
              data-outside={outside || undefined}
              data-today={sameDay(d, today) || undefined}
              data-selected={selected ? sameDay(d, selected) || undefined : undefined}
            >
              <button
                type="button"
                className="msr-EventCalendar__date"
                onClick={() => onSelect?.(d)}
              >
                {d.getDate()}
              </button>
              <div className="msr-EventCalendar__events">
                {shown.map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    className="msr-EventCalendar__event"
                    data-tone={ev.tone ?? "primary"}
                    title={ev.title}
                    onClick={() => onEventClick?.(ev)}
                  >
                    <span className="msr-EventCalendar__eventDot" />
                    <span className="msr-EventCalendar__eventLabel">{ev.title}</span>
                  </button>
                ))}
                {overflow > 0 && (
                  <span className="msr-EventCalendar__more">+{overflow} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
