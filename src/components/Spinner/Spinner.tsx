import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  /** Accessible label; defaults to "Loading". */
  label?: string;
}

/** Indeterminate loading spinner. */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ size = 18, label = "Loading", className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cx("msr-Spinner", className)}
        role="status"
        aria-label={label}
        {...rest}
      >
        <Icon name="spinner" size={size} />
      </span>
    );
  },
);
