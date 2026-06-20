import * as React from "react";
import { cx } from "../../lib/cx";
import { addDays, startOfDay, startOfWeek, MONTH_NAMES_SHORT, type WeekStart } from "../../lib/date";

export interface HeatmapValue {
  date: Date | string;
  count: number;
}

export interface CalendarHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  values: HeatmapValue[];
  /** Full calendar year to render. Defaults to spanning the values. */
  year?: number;
  startDate?: Date;
  endDate?: Date;
  weekStartsOn?: WeekStart;
  /** Number of shading levels above zero. */
  levels?: number;
  cellSize?: number;
  gap?: number;
  showMonthLabels?: boolean;
  showWeekdayLabels?: boolean;
  /** Format a day's tooltip. */
  tooltip?: (date: Date, count: number) => string;
}

const WD = ["S", "M", "T", "W", "T", "F", "S"];

/** GitHub-style calendar heatmap of daily counts. */
export const CalendarHeatmap = React.forwardRef<HTMLDivElement, CalendarHeatmapProps>(function CalendarHeatmap(
  {
    values,
    year,
    startDate,
    endDate,
    weekStartsOn = 0,
    levels = 4,
    cellSize = 12,
    gap = 3,
    showMonthLabels = true,
    showWeekdayLabels = true,
    tooltip,
    className,
    ...rest
  },
  ref,
) {
  const counts = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const v of values) {
      const d = typeof v.date === "string" ? new Date(v.date) : v.date;
      m.set(startOfDay(d).toDateString(), (m.get(startOfDay(d).toDateString()) ?? 0) + v.count);
    }
    return m;
  }, [values]);

  const { start, end } = React.useMemo(() => {
    if (year != null) return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
    if (startDate && endDate) return { start: startOfDay(startDate), end: startOfDay(endDate) };
    const dates = values.map((v) => (typeof v.date === "string" ? new Date(v.date) : v.date));
    if (dates.length === 0) {
      const today = startOfDay(new Date());
      return { start: addDays(today, -364), end: today };
    }
    const times = dates.map((d) => startOfDay(d).getTime());
    return { start: startOfDay(new Date(Math.min(...times))), end: startOfDay(new Date(Math.max(...times))) };
  }, [year, startDate, endDate, values]);

  const gridStart = startOfWeek(start, weekStartsOn);
  const totalDays = Math.round((startOfDay(end).getTime() - gridStart.getTime()) / 86400000) + 1;
  const weeks = Math.ceil(totalDays / 7);

  const max = React.useMemo(() => Math.max(1, ...[...counts.values()]), [counts]);
  const step = cellSize + gap;
  const padTop = showMonthLabels ? 16 : 0;
  const padLeft = showWeekdayLabels ? 24 : 0;
  const width = padLeft + weeks * step;
  const height = padTop + 7 * step;

  const levelOf = (count: number): number => {
    if (count <= 0) return 0;
    return Math.min(levels, Math.ceil((count / max) * levels));
  };

  // Month label positions: column of the first cell of each month.
  const monthLabels: Array<{ x: number; label: string }> = [];
  if (showMonthLabels) {
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const d = addDays(gridStart, w * 7);
      if (d.getMonth() !== lastMonth && d <= end) {
        lastMonth = d.getMonth();
        monthLabels.push({ x: padLeft + w * step, label: MONTH_NAMES_SHORT[d.getMonth()] });
      }
    }
  }

  const cells: React.ReactNode[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = addDays(gridStart, i);
    if (d < start || d > end) continue;
    const col = Math.floor(i / 7);
    const row = i % 7;
    const count = counts.get(d.toDateString()) ?? 0;
    cells.push(
      <rect
        key={i}
        className="msr-CalendarHeatmap__cell"
        data-level={levelOf(count)}
        x={padLeft + col * step}
        y={padTop + row * step}
        width={cellSize}
        height={cellSize}
        rx={2}
      >
        <title>{tooltip ? tooltip(d, count) : `${d.toDateString()}: ${count}`}</title>
      </rect>,
    );
  }

  return (
    <div ref={ref} className={cx("msr-CalendarHeatmap", className)} {...rest}>
      <svg className="msr-CalendarHeatmap__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Calendar heatmap">
        {monthLabels.map((m, i) => (
          <text key={i} className="msr-CalendarHeatmap__label" x={m.x} y={11}>
            {m.label}
          </text>
        ))}
        {showWeekdayLabels &&
          [1, 3, 5].map((r) => (
            <text key={r} className="msr-CalendarHeatmap__label" x={0} y={padTop + r * step + cellSize - 2}>
              {WD[(r + weekStartsOn) % 7]}
            </text>
          ))}
        {cells}
      </svg>
    </div>
  );
});
