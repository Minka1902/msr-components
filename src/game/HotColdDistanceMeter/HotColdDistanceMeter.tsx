import * as React from "react";
import { cx } from "../../lib/cx";

export interface HotColdDistanceMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Distance from guess to target (same unit as `max`). */
  distance: number;
  /** Distance considered "freezing/very far". Defaults to 20000 (km, half Earth). */
  max?: number;
  unit?: string;
  showLabel?: boolean;
}

function proximityLabel(ratio: number): string {
  if (ratio >= 0.95) return "Boiling hot!";
  if (ratio >= 0.8) return "Very close";
  if (ratio >= 0.6) return "Warm";
  if (ratio >= 0.4) return "Lukewarm";
  if (ratio >= 0.2) return "Cold";
  return "Freezing";
}

/** Visual "hot/cold" proximity meter for distance-guessing games. */
export const HotColdDistanceMeter = React.forwardRef<
  HTMLDivElement,
  HotColdDistanceMeterProps
>(function HotColdDistanceMeter(
  { distance, max = 20000, unit = "km", showLabel = true, className, ...rest },
  ref,
) {
  const clamped = Math.max(0, Math.min(distance, max));
  const proximity = 1 - clamped / max; // 1 = at target, 0 = far
  const pct = Math.round(proximity * 100);

  return (
    <div ref={ref} className={cx("msr-HotCold", className)} {...rest}>
      {showLabel && (
        <div className="msr-HotCold__head">
          <span className="msr-HotCold__label">{proximityLabel(proximity)}</span>
          <span className="msr-HotCold__distance">
            {Math.round(distance).toLocaleString()} {unit}
          </span>
        </div>
      )}
      <div
        className="msr-HotCold__track"
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Proximity to target"
      >
        <span
          className="msr-HotCold__marker"
          style={{ left: `${pct}%` }}
          data-proximity={pct >= 80 ? "hot" : pct >= 40 ? "warm" : "cold"}
        />
      </div>
      <div className="msr-HotCold__scale">
        <span>Far</span>
        <span>Close</span>
      </div>
    </div>
  );
});
