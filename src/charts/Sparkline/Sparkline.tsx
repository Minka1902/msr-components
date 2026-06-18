import * as React from "react";
import { cx } from "../../lib/cx";
import { mapSeries, linePath, areaPath } from "../_lib/scale";

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  /** Fill the area under the line. */
  area?: boolean;
  /** Mark the last point with a dot. */
  showLast?: boolean;
  strokeWidth?: number;
}

/** Tiny inline trend line (no axes). */
export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  { data, width = 96, height = 28, area = true, showLast = false, strokeWidth = 1.5, className, ...rest },
  ref,
) {
  if (data.length < 2) return null;
  const pts = mapSeries(data, width, height);
  const last = pts[pts.length - 1];
  return (
    <svg
      ref={ref}
      className={cx("msr-Sparkline", className)}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      {...rest}
    >
      {area && <path className="msr-Sparkline__area" d={areaPath(pts, width, height)} />}
      <path className="msr-Sparkline__line" d={linePath(pts)} fill="none" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke" />
      {showLast && <circle className="msr-Sparkline__dot" cx={last.x} cy={last.y} r={2.5} />}
    </svg>
  );
});
