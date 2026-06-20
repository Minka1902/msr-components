import * as React from "react";
import { cx } from "../../lib/cx";

export interface MapHintProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bearing in degrees from the guess toward the target (0 = N, 90 = E). */
  bearing: number;
  /** Distance to show alongside the direction. */
  distance?: number;
  unit?: string;
  /** Proximity 0–100 to tint the compass. */
  proximity?: number;
  label?: React.ReactNode;
}

function compassLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(((deg % 360) / 45)) % 8];
}

/** Compass-style directional hint pointing from a guess toward the target. */
export const MapHint = React.forwardRef<HTMLDivElement, MapHintProps>(
  function MapHint({ bearing, distance, unit = "km", proximity, label, className, ...rest }, ref) {
    const tone = proximity == null ? "cold" : proximity >= 80 ? "hot" : proximity >= 40 ? "warm" : "cold";
    return (
      <div ref={ref} className={cx("msr-MapHint", className)} data-tone={tone} {...rest}>
        <div className="msr-MapHint__compass" style={{ ["--bearing" as string]: `${bearing}deg` }}>
          <span className="msr-MapHint__needle" aria-hidden="true" />
          <span className="msr-MapHint__center" aria-hidden="true" />
        </div>
        <div className="msr-MapHint__info">
          <span className="msr-MapHint__dir">{label ?? compassLabel(bearing)}</span>
          {distance != null && (
            <span className="msr-MapHint__dist">{Math.round(distance).toLocaleString()} {unit}</span>
          )}
        </div>
      </div>
    );
  },
);
