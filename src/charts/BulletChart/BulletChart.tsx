import * as React from "react";
import { cx } from "../../lib/cx";

export interface BulletChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The measured value (the main bar). */
  value: number;
  /** Comparative target (the marker tick). */
  target?: number;
  /** Qualitative range thresholds (ascending), e.g. [40, 70, 100]. */
  ranges?: number[];
  /** Scale max; defaults to the largest of value/target/ranges. */
  max?: number;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Bar tone. */
  color?: string;
  formatValue?: (v: number) => string;
  height?: number;
}

/** Bullet graph: a measure bar over qualitative bands with a target marker. */
export const BulletChart = React.forwardRef<HTMLDivElement, BulletChartProps>(function BulletChart(
  { value, target, ranges = [], max, title, subtitle, color = "var(--msr-color-primary)", formatValue, height = 36, className, ...rest },
  ref,
) {
  const top = max ?? Math.max(value, target ?? 0, ...ranges, 1);
  const pct = (n: number) => `${Math.max(0, Math.min(100, (n / top) * 100))}%`;
  const sorted = [...ranges].sort((a, b) => a - b);

  return (
    <div ref={ref} className={cx("msr-BulletChart", className)} {...rest}>
      {(title || subtitle) && (
        <div className="msr-BulletChart__labels">
          {title && <span className="msr-BulletChart__title">{title}</span>}
          {subtitle && <span className="msr-BulletChart__subtitle">{subtitle}</span>}
        </div>
      )}
      <div className="msr-BulletChart__graph" style={{ height }} role="img" aria-label={typeof title === "string" ? title : "Bullet chart"}>
        {sorted.map((r, i) => (
          <span
            key={i}
            className="msr-BulletChart__band"
            style={{ width: pct(r), opacity: 0.18 + (i / Math.max(sorted.length - 1, 1)) * 0.22 }}
          />
        ))}
        <span className="msr-BulletChart__measure" style={{ width: pct(value), backgroundColor: color }} />
        {typeof target === "number" && (
          <span className="msr-BulletChart__target" style={{ left: pct(target) }} aria-label={`Target ${target}`} />
        )}
        {formatValue && <span className="msr-BulletChart__value">{formatValue(value)}</span>}
      </div>
    </div>
  );
});
