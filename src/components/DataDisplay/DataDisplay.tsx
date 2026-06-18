import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

/* ---------------- Stat ---------------- */

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** Signed delta; rendered with an up/down arrow and success/danger color. */
  delta?: number;
  deltaSuffix?: string;
  /** Treat "up" as bad (e.g. error rate). */
  invertDelta?: boolean;
}

/** Compact KPI/statistic display. */
export const Stat = React.forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, hint, delta, deltaSuffix = "%", invertDelta, className, ...rest },
  ref,
) {
  const up = delta !== undefined && delta >= 0;
  const good = delta === undefined ? undefined : invertDelta ? !up : up;
  return (
    <div ref={ref} className={cx("msr-Stat", className)} {...rest}>
      <span className="msr-Stat__label">{label}</span>
      <span className="msr-Stat__value">{value}</span>
      <span className="msr-Stat__row">
        {delta !== undefined && (
          <span className="msr-Stat__delta" data-good={good || undefined}>
            <Icon name={up ? "trendingUp" : "trendingDown"} size={14} />
            {Math.abs(delta)}
            {deltaSuffix}
          </span>
        )}
        {hint && <span className="msr-Stat__hint">{hint}</span>}
      </span>
    </div>
  );
});

/* ---------------- DescriptionList ---------------- */

export interface DescriptionItem {
  term: React.ReactNode;
  description: React.ReactNode;
}

export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** Lay term/description side-by-side instead of stacked. */
  inline?: boolean;
  columns?: number;
}

/** Key/value description list (term → description). */
export const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  function DescriptionList({ items, inline, columns = 1, className, style, ...rest }, ref) {
    return (
      <dl
        ref={ref}
        className={cx("msr-DescriptionList", className)}
        data-inline={inline || undefined}
        style={{ ["--dl-cols" as string]: columns, ...style }}
        {...rest}
      >
        {items.map((it, i) => (
          <div className="msr-DescriptionList__row" key={i}>
            <dt className="msr-DescriptionList__term">{it.term}</dt>
            <dd className="msr-DescriptionList__desc">{it.description}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
