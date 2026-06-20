import * as React from "react";
import { cx } from "../../lib/cx";
import { startOfDay, startOfMonth, addMonths, MONTH_NAMES_SHORT } from "../../lib/date";

export interface GanttTask {
  id: string;
  label: React.ReactNode;
  start: Date;
  end: Date;
  color?: string;
  /** Completion 0–1, drawn as an inner fill. */
  progress?: number;
}

export interface GanttProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  tasks: GanttTask[];
  rangeStart?: Date;
  rangeEnd?: Date;
  /** Width of the task-label column, px. */
  labelWidth?: number;
  rowHeight?: number;
  showToday?: boolean;
  onTaskClick?: (task: GanttTask) => void;
}

const DAY = 86400000;

/** Horizontal project schedule: one bar per task across a date axis. */
export const Gantt = React.forwardRef<HTMLDivElement, GanttProps>(function Gantt(
  { tasks, rangeStart, rangeEnd, labelWidth = 140, rowHeight = 34, showToday = true, onTaskClick, className, ...rest },
  ref,
) {
  const { start, end, totalMs } = React.useMemo(() => {
    const starts = tasks.map((t) => startOfDay(t.start).getTime());
    const ends = tasks.map((t) => startOfDay(t.end).getTime() + DAY);
    const s = rangeStart ? startOfDay(rangeStart).getTime() : Math.min(...starts);
    const e = rangeEnd ? startOfDay(rangeEnd).getTime() + DAY : Math.max(...ends);
    return { start: s, end: e, totalMs: Math.max(e - s, DAY) };
  }, [tasks, rangeStart, rangeEnd]);

  const pct = (ms: number) => ((ms - start) / totalMs) * 100;

  // Month gridlines/labels across the range.
  const months: Array<{ left: number; label: string }> = [];
  let cursor = startOfMonth(new Date(start));
  while (cursor.getTime() < end) {
    const left = pct(Math.max(cursor.getTime(), start));
    if (left >= 0 && left < 100) months.push({ left, label: `${MONTH_NAMES_SHORT[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(2)}` });
    cursor = addMonths(cursor, 1);
  }

  const todayPct = pct(startOfDay(new Date()).getTime());
  const showTodayLine = showToday && todayPct >= 0 && todayPct <= 100;

  return (
    <div
      ref={ref}
      className={cx("msr-Gantt", className)}
      style={{ ["--msr-gantt-label" as string]: `${labelWidth}px`, ["--msr-gantt-row" as string]: `${rowHeight}px` }}
      {...rest}
    >
      <div className="msr-Gantt__header">
        <div className="msr-Gantt__corner" />
        <div className="msr-Gantt__axis">
          {months.map((m, i) => (
            <span key={i} className="msr-Gantt__month" style={{ left: `${m.left}%` }}>
              {m.label}
            </span>
          ))}
        </div>
      </div>

      <div className="msr-Gantt__body">
        <div className="msr-Gantt__overlay" aria-hidden="true">
          {months.map((m, i) => (
            <span key={i} className="msr-Gantt__gridline" style={{ left: `${m.left}%` }} />
          ))}
          {showTodayLine && <span className="msr-Gantt__today" style={{ left: `${todayPct}%` }} />}
        </div>
        {tasks.map((task) => {
          const left = pct(startOfDay(task.start).getTime());
          const right = pct(startOfDay(task.end).getTime() + DAY);
          const width = Math.max(right - left, 1);
          return (
            <div key={task.id} className="msr-Gantt__row">
              <div className="msr-Gantt__label" title={typeof task.label === "string" ? task.label : undefined}>
                {task.label}
              </div>
              <div className="msr-Gantt__track">
                <button
                  type="button"
                  className="msr-Gantt__bar"
                  style={{ left: `${left}%`, width: `${width}%`, backgroundColor: task.color }}
                  onClick={onTaskClick ? () => onTaskClick(task) : undefined}
                  disabled={!onTaskClick}
                  title={`${task.start.toLocaleDateString()} → ${task.end.toLocaleDateString()}`}
                >
                  {task.progress != null && (
                    <span className="msr-Gantt__progress" style={{ width: `${Math.max(0, Math.min(1, task.progress)) * 100}%` }} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
