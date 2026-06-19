import * as React from "react";
import { cx } from "../../lib/cx";

export interface FunnelStage {
  label: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps extends React.HTMLAttributes<HTMLDivElement> {
  stages: FunnelStage[];
  /** Show conversion % vs. previous stage. */
  showConversion?: boolean;
}

/** Funnel chart showing drop-off across ordered stages. */
export const FunnelChart = React.forwardRef<HTMLDivElement, FunnelChartProps>(function FunnelChart(
  { stages, showConversion = true, className, ...rest },
  ref,
) {
  const max = Math.max(...stages.map((s) => s.value), 1);
  return (
    <div ref={ref} className={cx("msr-Funnel", className)} {...rest}>
      {stages.map((s, i) => {
        const widthPct = (s.value / max) * 100;
        const prev = i > 0 ? stages[i - 1].value : s.value;
        const conv = prev ? Math.round((s.value / prev) * 100) : 100;
        return (
          <div key={s.label} className="msr-Funnel__stage">
            <div className="msr-Funnel__bar-wrap">
              <div
                className="msr-Funnel__bar"
                style={{ width: `${widthPct}%`, backgroundColor: s.color }}
              >
                <span className="msr-Funnel__value">{s.value.toLocaleString()}</span>
              </div>
            </div>
            <div className="msr-Funnel__meta">
              <span className="msr-Funnel__label">{s.label}</span>
              {showConversion && i > 0 && <span className="msr-Funnel__conv">{conv}%</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
});
