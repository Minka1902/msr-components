import * as React from "react";
import { cx } from "../../lib/cx";

export interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid line color. */
  color?: string;
  /** Scroll speed in seconds per cycle. */
  speed?: number;
  /** Perspective tilt angle. */
  angle?: number;
  cellSize?: number;
}

/** Animated perspective "retro" grid that scrolls toward the horizon. */
export const RetroGrid = React.forwardRef<HTMLDivElement, RetroGridProps>(function RetroGrid(
  { color = "var(--msr-color-primary)", speed = 12, angle = 65, cellSize = 40, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-RetroGrid", className)}
      style={{
        ["--msr-grid-color" as string]: color,
        ["--msr-grid-speed" as string]: `${speed}s`,
        ["--msr-grid-angle" as string]: `${angle}deg`,
        ["--msr-grid-cell" as string]: `${cellSize}px`,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    >
      <div className="msr-RetroGrid__fade">
        <div className="msr-RetroGrid__plane" />
      </div>
    </div>
  );
});
