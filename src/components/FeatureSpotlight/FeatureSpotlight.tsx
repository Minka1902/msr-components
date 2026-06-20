import * as React from "react";
import { cx } from "../../lib/cx";

export interface FeatureSpotlightProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "title"> {
  /** Element to draw attention to. */
  children: React.ReactNode;
  /** Show the pulsing indicator (e.g. while the feature is new). */
  active?: boolean;
  /** Corner to anchor the pulse dot. */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  tone?: "primary" | "success" | "danger" | "info";
  /** Optional "New" style label shown next to the dot. */
  label?: React.ReactNode;
}

/** Wraps any element with a pulsing dot to spotlight a new/updated feature. */
export const FeatureSpotlight = React.forwardRef<HTMLSpanElement, FeatureSpotlightProps>(function FeatureSpotlight(
  { children, active = true, position = "top-right", tone = "primary", label, className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx("msr-FeatureSpotlight", className)} data-position={position} data-tone={tone} {...rest}>
      {children}
      {active && (
        <span className="msr-FeatureSpotlight__marker" aria-hidden="true">
          <span className="msr-FeatureSpotlight__pulse" />
          <span className="msr-FeatureSpotlight__dot" />
          {label && <span className="msr-FeatureSpotlight__label">{label}</span>}
        </span>
      )}
    </span>
  );
});
