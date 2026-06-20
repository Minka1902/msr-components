import * as React from "react";
import { cx } from "../../lib/cx";
import { DEFAULT_SCALE, legendSteps } from "../_lib/scale";

export interface MapLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number;
  /** Hex color stops, low → high. */
  scale?: string[];
  /** Optional legend title. */
  label?: string;
  /** Continuous gradient bar vs. discrete swatches. */
  variant?: "gradient" | "steps";
  /** Number of swatches/ticks for the `steps` variant. */
  steps?: number;
  /** Format a numeric tick. */
  format?: (value: number) => string;
}

function defaultFormat(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

/** Color-scale legend for choropleths and tile-grid maps. */
export const MapLegend = React.forwardRef<HTMLDivElement, MapLegendProps>(function MapLegend(
  { min, max, scale = DEFAULT_SCALE, label, variant = "gradient", steps = 5, format = defaultFormat, className, ...rest },
  ref,
) {
  const gradient = `linear-gradient(to right, ${scale.join(", ")})`;
  const swatches = legendSteps(min, max, scale, steps);

  return (
    <div ref={ref} className={cx("msr-MapLegend", className)} data-variant={variant} {...rest}>
      {label && <span className="msr-MapLegend__label">{label}</span>}
      {variant === "gradient" ? (
        <>
          <span className="msr-MapLegend__bar" style={{ background: gradient }} aria-hidden="true" />
          <div className="msr-MapLegend__ticks">
            <span>{format(min)}</span>
            <span>{format(min + (max - min) / 2)}</span>
            <span>{format(max)}</span>
          </div>
        </>
      ) : (
        <div className="msr-MapLegend__steps">
          {swatches.map((s, i) => (
            <div key={i} className="msr-MapLegend__step">
              <span className="msr-MapLegend__swatch" style={{ backgroundColor: s.color }} aria-hidden="true" />
              <span className="msr-MapLegend__stepLabel">{format(s.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
