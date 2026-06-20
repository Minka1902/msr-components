import * as React from "react";
import { cx } from "../../lib/cx";

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Border (beam) thickness in px. */
  borderWidth?: number;
  /** Full revolution duration in seconds. */
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  /** Corner radius in px. */
  radius?: number;
}

/** Wraps content with a gradient beam that travels around its border. */
export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(function BorderBeam(
  {
    children,
    borderWidth = 2,
    duration = 4,
    colorFrom = "var(--msr-color-primary)",
    colorTo = "color-mix(in srgb, var(--msr-color-primary) 30%, transparent)",
    radius = 12,
    className,
    style,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-BorderBeam", className)}
      style={{
        ["--msr-bb-w" as string]: `${borderWidth}px`,
        ["--msr-bb-dur" as string]: `${duration}s`,
        ["--msr-bb-c1" as string]: colorFrom,
        ["--msr-bb-c2" as string]: colorTo,
        ["--msr-bb-radius" as string]: `${radius}px`,
        ...style,
      }}
      {...rest}
    >
      <span className="msr-BorderBeam__beam" aria-hidden="true" />
      <div className="msr-BorderBeam__content">{children}</div>
    </div>
  );
});
