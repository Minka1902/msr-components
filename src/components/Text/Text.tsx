import * as React from "react";
import { cx } from "../../lib/cx";

/* ---------------- Highlight ---------------- */

export interface HighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The full text. */
  children: string;
  /** Term(s) to highlight (case-insensitive). */
  query: string | string[];
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps occurrences of `query` within text in <mark>. */
export const Highlight = React.forwardRef<HTMLSpanElement, HighlightProps>(function Highlight(
  { children, query, className, ...rest },
  ref,
) {
  const terms = (Array.isArray(query) ? query : [query]).filter(Boolean).map(escapeRegExp);
  if (terms.length === 0) {
    return (
      <span ref={ref} className={className} {...rest}>
        {children}
      </span>
    );
  }
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = children.split(re);
  return (
    <span ref={ref} className={className} {...rest}>
      {parts.map((part, i) =>
        re.test(part) ? (
          <mark key={i} className="msr-Highlight">{part}</mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </span>
  );
});

/* ---------------- ClampText ---------------- */

export interface ClampTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max lines before truncating. */
  lines?: number;
  /** Show a toggle to expand/collapse. */
  expandable?: boolean;
  moreLabel?: string;
  lessLabel?: string;
}

/** Truncates text to N lines with an optional show-more toggle. */
export const ClampText = React.forwardRef<HTMLDivElement, ClampTextProps>(function ClampText(
  { lines = 3, expandable = false, moreLabel = "Show more", lessLabel = "Show less", className, style, children, ...rest },
  ref,
) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div ref={ref} className={cx("msr-ClampText", className)} {...rest}>
      <div
        className="msr-ClampText__content"
        data-clamped={!expanded || undefined}
        style={{ ["--clamp-lines" as string]: lines, ...style }}
      >
        {children}
      </div>
      {expandable && (
        <button type="button" className="msr-ClampText__toggle" onClick={() => setExpanded((e) => !e)}>
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
});

/* ---------------- RelativeTime ---------------- */

export interface RelativeTimeProps extends React.TimeHTMLAttributes<HTMLTimeElement> {
  /** Date, timestamp (ms), or ISO string. */
  date: Date | number | string;
  /** Re-render interval in ms to keep it fresh (default 60000; 0 disables). */
  updateInterval?: number;
}

const DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function formatRelative(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  let duration = (date.getTime() - Date.now()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), "year");
}

/** Auto-updating "x minutes ago" timestamp with an absolute title. */
export const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(
  function RelativeTime({ date, updateInterval = 60000, className, ...rest }, ref) {
    const target = React.useMemo(() => new Date(date), [date]);
    const [, force] = React.useReducer((x) => x + 1, 0);

    React.useEffect(() => {
      if (!updateInterval) return;
      const id = setInterval(force, updateInterval);
      return () => clearInterval(id);
    }, [updateInterval]);

    return (
      <time
        ref={ref}
        className={cx("msr-RelativeTime", className)}
        dateTime={target.toISOString()}
        title={target.toLocaleString()}
        {...rest}
      >
        {formatRelative(target)}
      </time>
    );
  },
);
