import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface DistanceFeedbackCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The guessed place name. */
  guess: React.ReactNode;
  /** Distance from guess to target. */
  distance: number;
  unit?: string;
  /** Bearing in degrees (0 = north, 90 = east) from guess toward target. */
  bearing?: number;
  /** Proximity 0–100 (drives the percentage chip). */
  proximity?: number;
  /** Educational fact shown below. */
  fact?: React.ReactNode;
  correct?: boolean;
}

function bearingToArrow(deg: number): string {
  const dirs = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
  return dirs[Math.round(((deg % 360) / 45)) % 8];
}

/** Feedback after a guess: distance, direction arrow, proximity, and a fact. */
export const DistanceFeedbackCard = React.forwardRef<
  HTMLDivElement,
  DistanceFeedbackCardProps
>(function DistanceFeedbackCard(
  { guess, distance, unit = "km", bearing, proximity, fact, correct, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-DistanceFeedback", className)}
      data-correct={correct || undefined}
      {...rest}
    >
      <div className="msr-DistanceFeedback__top">
        <span className="msr-DistanceFeedback__guess">{guess}</span>
        {correct ? (
          <span className="msr-DistanceFeedback__correct">
            <Icon name="checkCircle" size={16} /> Correct!
          </span>
        ) : (
          proximity !== undefined && (
            <span className="msr-DistanceFeedback__proximity">{Math.round(proximity)}%</span>
          )
        )}
      </div>
      {!correct && (
        <div className="msr-DistanceFeedback__metrics">
          <span className="msr-DistanceFeedback__distance">
            {Math.round(distance).toLocaleString()} {unit}
          </span>
          {bearing !== undefined && (
            <span className="msr-DistanceFeedback__bearing" title={`${Math.round(bearing)}°`}>
              {bearingToArrow(bearing)}
            </span>
          )}
        </div>
      )}
      {fact && (
        <div className="msr-DistanceFeedback__fact">
          <Icon name="info" size={14} />
          <span>{fact}</span>
        </div>
      )}
    </div>
  );
});
