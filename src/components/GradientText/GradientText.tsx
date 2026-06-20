import * as React from "react";
import { cx } from "../../lib/cx";

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  /** Gradient color stops. */
  colors?: string[];
  /** Animate the gradient sweep. */
  animate?: boolean;
  /** Sweep duration in seconds. */
  duration?: number;
  angle?: number;
}

/** Text filled with a (optionally animated) gradient. */
export const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(function GradientText(
  {
    children,
    colors = ["var(--msr-color-primary)", "#ec4899", "#8b5cf6", "var(--msr-color-primary)"],
    animate = true,
    duration = 6,
    angle = 90,
    className,
    style,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx("msr-GradientText", className)}
      data-animate={animate || undefined}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
        ["--msr-gt-dur" as string]: `${duration}s`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
});
