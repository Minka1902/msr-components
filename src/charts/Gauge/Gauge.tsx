import * as React from "react";
import { cx } from "../../lib/cx";
import { arc } from "../_lib/scale";

export interface GaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value. */
  value: number;
  min?: number;
  max?: number;
  size?: number;
  thickness?: number;
  label?: React.ReactNode;
  /** Optional colored thresholds [{ upTo, color }] along the arc. */
  segments?: Array<{ upTo: number; color: string }>;
}

/** Semicircular gauge (180°). */
export const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(function Gauge(
  { value, min = 0, max = 100, size = 160, thickness = 14, label, segments, className, ...rest },
  ref,
) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  const cx0 = size / 2;
  const cy0 = size / 2;
  const r = (size - thickness) / 2;
  const height = size / 2 + thickness;

  // Map 0..1 to -90..90 degrees (left to right across the top semicircle).
  const angleFor = (f: number) => -90 + f * 180;

  return (
    <div
      ref={ref}
      className={cx("msr-Gauge", className)}
      style={{ width: size, height }}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      {...rest}
    >
      <svg viewBox={`0 0 ${size} ${height}`}>
        <path
          className="msr-Gauge__track"
          d={arc(cx0, cy0, r, -90, 90)}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        {segments
          ? segments.map((seg, i) => {
              const start = i === 0 ? 0 : (segments[i - 1].upTo - min) / (max - min);
              const end = (seg.upTo - min) / (max - min);
              return (
                <path
                  key={i}
                  d={arc(cx0, cy0, r, angleFor(start), angleFor(end))}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={thickness}
                />
              );
            })
          : (
            <path
              className="msr-Gauge__value"
              d={arc(cx0, cy0, r, -90, angleFor(pct))}
              fill="none"
              strokeWidth={thickness}
              strokeLinecap="round"
            />
          )}
      </svg>
      <div className="msr-Gauge__label">{label ?? value}</div>
    </div>
  );
});
