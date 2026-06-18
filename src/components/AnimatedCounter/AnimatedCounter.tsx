import * as React from "react";
import { useSpringValue } from "msr-hooks";
import { cx } from "../../lib/cx";

export interface AnimatedCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Decimal places to show. */
  decimals?: number;
  /** Prefix/suffix, e.g. "$" / "%". */
  prefix?: string;
  suffix?: string;
  /** Use locale grouping (1,234). */
  group?: boolean;
  /** Spring config passed to useSpringValue. */
  spring?: { stiffness?: number; damping?: number; mass?: number };
}

/** Smoothly animates a number toward `value` using a spring. */
export const AnimatedCounter = React.forwardRef<HTMLSpanElement, AnimatedCounterProps>(
  function AnimatedCounter(
    { value, decimals = 0, prefix = "", suffix = "", group = true, spring, className, ...rest },
    ref,
  ) {
    const animated = useSpringValue(value, spring);
    const factor = 10 ** decimals;
    const rounded = Math.round(animated * factor) / factor;
    const formatted = group
      ? rounded.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : rounded.toFixed(decimals);

    return (
      <span ref={ref} className={cx("msr-AnimatedCounter", className)} {...rest}>
        {prefix}
        {formatted}
        {suffix}
      </span>
    );
  },
);
