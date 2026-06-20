/**
 * Tiny dependency-free date helpers shared by the calendar/scheduling
 * components. All functions operate on native `Date` and never mutate input.
 */

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Sunday-first day-of-week labels. */
export const DOW_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export type WeekStart = 0 | 1;

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Start of the week containing `d`, respecting `weekStartsOn`. */
export function startOfWeek(d: Date, weekStartsOn: WeekStart = 0): Date {
  const day = (d.getDay() - weekStartsOn + 7) % 7;
  return addDays(startOfDay(d), -day);
}

/** Reorder the day-of-week labels for a given week start. */
export function orderedDow(weekStartsOn: WeekStart = 0): string[] {
  return [...DOW_LABELS.slice(weekStartsOn), ...DOW_LABELS.slice(0, weekStartsOn)];
}

/**
 * The 6-week (42 cell) grid of dates that visually represents `month`,
 * including leading/trailing days from adjacent months.
 */
export function monthGrid(year: number, month: number, weekStartsOn: WeekStart = 0): Date[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function clampDate(d: Date, min?: Date, max?: Date): Date {
  if (min && d < min) return min;
  if (max && d > max) return max;
  return d;
}

export function isBetween(d: Date, a: Date, b: Date): boolean {
  const t = startOfDay(d).getTime();
  const lo = Math.min(startOfDay(a).getTime(), startOfDay(b).getTime());
  const hi = Math.max(startOfDay(a).getTime(), startOfDay(b).getTime());
  return t >= lo && t <= hi;
}

/** `"14:30"` ⇄ minutes-since-midnight helpers. */
export function minutesToHM(mins: number): { h: number; m: number } {
  return { h: Math.floor(mins / 60), m: mins % 60 };
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function formatTime(h: number, m: number, hour12 = false): string {
  if (hour12) {
    const period = h >= 12 ? "PM" : "AM";
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${pad2(m)} ${period}`;
  }
  return `${pad2(h)}:${pad2(m)}`;
}
