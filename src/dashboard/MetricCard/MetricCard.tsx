import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface MetricTrend {
  /** Signed percentage or absolute delta to display. */
  value: number;
  /** Override the auto direction (positive = up). */
  direction?: "up" | "down";
  /** When true, "up" is rendered as danger and "down" as success (e.g. error rate). */
  invertColor?: boolean;
  /** Suffix appended to the value, e.g. "%". */
  suffix?: string;
}

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: IconName | React.ReactNode;
  trend?: MetricTrend;
  /** Small caption under the value. */
  caption?: React.ReactNode;
  /** Optional sparkline values (rendered as a tiny inline area chart). */
  sparkline?: number[];
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const w = 96;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((d, i) => [i * step, h - ((d - min) / span) * h] as const);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg className="msr-MetricCard__spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polygon points={area} className="msr-MetricCard__spark-area" />
      <polyline points={line} className="msr-MetricCard__spark-line" />
    </svg>
  );
}

/** Dashboard stat card: label, big value, icon, trend, sparkline. */
export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  function MetricCard(
    { label, value, icon, trend, caption, sparkline, className, ...rest },
    ref,
  ) {
    const dir = trend ? (trend.direction ?? (trend.value >= 0 ? "up" : "down")) : undefined;
    const good = dir === "up" ? !trend?.invertColor : trend?.invertColor;

    return (
      <div ref={ref} className={cx("msr-MetricCard", className)} {...rest}>
        <div className="msr-MetricCard__top">
          <span className="msr-MetricCard__label">{label}</span>
          {icon && (
            <span className="msr-MetricCard__icon">
              {typeof icon === "string" ? <Icon name={icon as IconName} size={18} /> : icon}
            </span>
          )}
        </div>
        <div className="msr-MetricCard__value">{value}</div>
        <div className="msr-MetricCard__bottom">
          {trend && (
            <span
              className="msr-MetricCard__trend"
              data-direction={dir}
              data-good={good || undefined}
            >
              <Icon name={dir === "up" ? "trendingUp" : "trendingDown"} size={14} />
              {Math.abs(trend.value)}
              {trend.suffix ?? "%"}
            </span>
          )}
          {caption && <span className="msr-MetricCard__caption">{caption}</span>}
          {sparkline && <Sparkline data={sparkline} />}
        </div>
      </div>
    );
  },
);
