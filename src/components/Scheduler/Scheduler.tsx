import * as React from "react";
import { cx } from "../../lib/cx";
import {
  DOW_LABELS,
  MONTH_NAMES_SHORT,
  addDays,
  sameDay,
  startOfDay,
  startOfWeek,
  formatTime,
  type WeekStart,
} from "../../lib/date";

export interface SchedulerEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export interface SchedulerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  events?: SchedulerEvent[];
  view?: "day" | "week";
  /** Reference date — the day shown (day view) or week containing it (week view). */
  date?: Date;
  /** First hour shown on the axis (0–23). */
  startHour?: number;
  /** Last hour shown on the axis (1–24). */
  endHour?: number;
  /** Pixel height of one hour row. */
  hourHeight?: number;
  weekStartsOn?: WeekStart;
  onEventClick?: (event: SchedulerEvent) => void;
}

function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

/** Day/week timeline that positions events on an hourly axis. */
export const Scheduler = React.forwardRef<HTMLDivElement, SchedulerProps>(function Scheduler(
  {
    events = [],
    view = "week",
    date,
    startHour = 7,
    endHour = 21,
    hourHeight = 48,
    weekStartsOn = 0,
    onEventClick,
    className,
    ...rest
  },
  ref,
) {
  const ref0 = date ?? new Date();
  const today = startOfDay(new Date());

  const days = React.useMemo(() => {
    if (view === "day") return [startOfDay(ref0)];
    const start = startOfWeek(ref0, weekStartsOn);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, ref0.getTime(), weekStartsOn]);

  const hours = React.useMemo(() => {
    const out: number[] = [];
    for (let h = startHour; h < endHour; h++) out.push(h);
    return out;
  }, [startHour, endHour]);

  const axisStart = startHour * 60;
  const totalMinutes = (endHour - startHour) * 60;
  const bodyHeight = (endHour - startHour) * hourHeight;

  const eventsForDay = (day: Date) =>
    events.filter((e) => sameDay(e.start, day));

  const positionOf = (e: SchedulerEvent) => {
    const start = Math.max(minutesOfDay(e.start), axisStart);
    const rawEnd = sameDay(e.start, e.end) ? minutesOfDay(e.end) : startHour * 60 + totalMinutes;
    const end = Math.min(rawEnd, axisStart + totalMinutes);
    const top = ((start - axisStart) / totalMinutes) * bodyHeight;
    const height = Math.max(((end - start) / totalMinutes) * bodyHeight, 14);
    return { top, height };
  };

  return (
    <div ref={ref} className={cx("msr-Scheduler", className)} data-view={view} {...rest}>
      <div className="msr-Scheduler__head">
        <div className="msr-Scheduler__gutterHead" />
        {days.map((d) => (
          <div
            key={d.toISOString()}
            className="msr-Scheduler__dayHead"
            data-today={sameDay(d, today) || undefined}
          >
            <span className="msr-Scheduler__dayDow">{DOW_LABELS[d.getDay()]}</span>
            <span className="msr-Scheduler__dayNum">
              {MONTH_NAMES_SHORT[d.getMonth()]} {d.getDate()}
            </span>
          </div>
        ))}
      </div>

      <div className="msr-Scheduler__body" style={{ height: bodyHeight }}>
        <div className="msr-Scheduler__gutter">
          {hours.map((h) => (
            <div key={h} className="msr-Scheduler__hourLabel" style={{ height: hourHeight }}>
              <span>{formatTime(h, 0)}</span>
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day.toISOString()} className="msr-Scheduler__col">
            {hours.map((h) => (
              <div key={h} className="msr-Scheduler__slot" style={{ height: hourHeight }} />
            ))}
            {eventsForDay(day).map((e) => {
              const { top, height } = positionOf(e);
              return (
                <button
                  key={e.id}
                  type="button"
                  className="msr-Scheduler__event"
                  data-tone={e.tone ?? "primary"}
                  style={{ top, height }}
                  title={e.title}
                  onClick={() => onEventClick?.(e)}
                >
                  <span className="msr-Scheduler__eventTitle">{e.title}</span>
                  <span className="msr-Scheduler__eventTime">
                    {formatTime(e.start.getHours(), e.start.getMinutes())}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});
