import * as React from "react";
import { cx } from "../../lib/cx";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Optional centered label (horizontal only). */
  label?: React.ReactNode;
}

/** Thin separator line, optionally labeled. */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  function Divider({ orientation = "horizontal", label, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cx("msr-Divider", className)}
        data-orientation={orientation}
        data-labeled={label != null || undefined}
        {...rest}
      >
        {label != null && <span className="msr-Divider__label">{label}</span>}
      </div>
    );
  },
);
