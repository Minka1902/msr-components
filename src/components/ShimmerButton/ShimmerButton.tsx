import * as React from "react";
import { cx } from "../../lib/cx";

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Color of the traveling shimmer. */
  shimmerColor?: string;
  /** Shimmer travel duration in seconds. */
  duration?: number;
  background?: string;
}

/** Dark pill button with a shimmer light sweeping around its edge. */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(function ShimmerButton(
  { shimmerColor = "#ffffff", duration = 3, background = "var(--msr-color-fg)", className, children, style, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cx("msr-ShimmerButton", className)}
      style={{
        ["--msr-shimmer" as string]: shimmerColor,
        ["--msr-shimmer-dur" as string]: `${duration}s`,
        ["--msr-shimmer-bg" as string]: background,
        ...style,
      }}
      {...rest}
    >
      <span className="msr-ShimmerButton__spark" aria-hidden="true">
        <span className="msr-ShimmerButton__sparkInner" />
      </span>
      <span className="msr-ShimmerButton__label">{children}</span>
      <span className="msr-ShimmerButton__highlight" aria-hidden="true" />
    </button>
  );
});
