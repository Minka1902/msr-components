import * as React from "react";
import { cx } from "../../lib/cx";
import { arc } from "../_lib/scale";

export interface RadialBarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface RadialBarProps extends React.HTMLAttributes<HTMLDivElement> {
  data: RadialBarDatum[];
  /** Scale maximum. Defaults to the largest value. */
  max?: number;
  size?: number;
  thickness?: number;
  gap?: number;
  /** Sweep angle of a full bar, degrees (e.g. 270 for a gauge look). */
  sweep?: number;
  trackColor?: string;
  showLabels?: boolean;
}

const PALETTE = ["#0284c7", "#059669", "#ca8a04", "#dc2626", "#9333ea", "#0891b2"];

/** Concentric radial bar chart (one ring per series). */
export const RadialBar = React.forwardRef<HTMLDivElement, RadialBarProps>(function RadialBar(
  { data, max, size = 220, thickness = 16, gap = 6, sweep = 270, trackColor = "var(--msr-color-surface-2)", showLabels = true, className, ...rest },
  ref,
) {
  const top = max ?? Math.max(1, ...data.map((d) => d.value));
  const cx0 = size / 2;
  const cy0 = size / 2;
  // 0deg = top; the sweep is centered at the top and runs clockwise.
  const from = 360 - sweep / 2;

  return (
    <div ref={ref} className={cx("msr-RadialBar", className)} {...rest}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radial bar chart">
        {data.map((d, i) => {
          const r = cx0 - thickness / 2 - i * (thickness + gap);
          if (r < thickness) return null;
          const valueAngle = Math.min(1, d.value / top) * sweep;
          const color = d.color ?? PALETTE[i % PALETTE.length];
          return (
            <g key={i}>
              <path
                d={arc(cx0, cy0, r, from, from + sweep)}
                stroke={trackColor}
                strokeWidth={thickness}
                fill="none"
                strokeLinecap="round"
              />
              {valueAngle > 0.5 && (
                <path
                  d={arc(cx0, cy0, r, from, from + valueAngle)}
                  stroke={color}
                  strokeWidth={thickness}
                  fill="none"
                  strokeLinecap="round"
                >
                  <title>{`${d.label}: ${d.value}`}</title>
                </path>
              )}
            </g>
          );
        })}
      </svg>
      {showLabels && (
        <ul className="msr-RadialBar__legend">
          {data.map((d, i) => (
            <li key={i} className="msr-RadialBar__legendItem">
              <span className="msr-RadialBar__swatch" style={{ backgroundColor: d.color ?? PALETTE[i % PALETTE.length] }} />
              <span className="msr-RadialBar__legendLabel">{d.label}</span>
              <span className="msr-RadialBar__legendValue">{d.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
