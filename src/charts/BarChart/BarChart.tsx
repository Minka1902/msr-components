import * as React from "react";
import { cx } from "../../lib/cx";

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarDatum[];
  /** Render bars horizontally. */
  horizontal?: boolean;
  /** Height (vertical) or bar thickness area, px. */
  height?: number;
  /** Show value labels on bars. */
  showValues?: boolean;
}

/** Simple categorical bar chart (CSS bars, no SVG). */
export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  { data, horizontal = false, height = 160, showValues = true, className, style, ...rest },
  ref,
) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      ref={ref}
      className={cx("msr-BarChart", className)}
      data-orientation={horizontal ? "horizontal" : "vertical"}
      style={{ ["--bar-area" as string]: `${height}px`, ...style }}
      role="img"
      {...rest}
    >
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div className="msr-BarChart__item" key={i}>
            <div className="msr-BarChart__track">
              <div
                className="msr-BarChart__bar"
                style={{ ["--bar-size" as string]: `${pct}%`, backgroundColor: d.color }}
              >
                {showValues && <span className="msr-BarChart__value">{d.value}</span>}
              </div>
            </div>
            <span className="msr-BarChart__label" title={d.label}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
});
