import * as React from "react";
import { cx } from "../../lib/cx";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll direction(s). */
  orientation?: "vertical" | "horizontal" | "both";
  /** Max height (CSS value) for vertical scrolling. */
  maxHeight?: number | string;
}

/** Container with themed, thin custom scrollbars. */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = "vertical", maxHeight, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-ScrollArea", className)}
      data-orientation={orientation}
      style={{ maxHeight, ...style }}
      {...rest}
    />
  );
});
