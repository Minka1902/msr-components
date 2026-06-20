import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface LearnedFact {
  /** e.g. "capitals", "currencies", "neighbors". */
  label: string;
  count: number;
  icon?: IconName | React.ReactNode;
}

export interface ResultSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  learned: LearnedFact[];
  /** Optional closing line. */
  footer?: React.ReactNode;
}

function renderIcon(icon: IconName | React.ReactNode | undefined, fallback: IconName) {
  if (!icon) return <Icon name={fallback} size={18} />;
  return typeof icon === "string" ? <Icon name={icon as IconName} size={18} /> : icon;
}

/** "You learned: 3 capitals, 2 currencies…" post-game recap. */
export const ResultSummary = React.forwardRef<HTMLDivElement, ResultSummaryProps>(
  function ResultSummary({ title = "What you learned", learned, footer, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("msr-EduSummary", className)} {...rest}>
        <div className="msr-EduSummary__title">
          <Icon name="sparkles" size={16} /> {title}
        </div>
        <div className="msr-EduSummary__grid">
          {learned.map((f) => (
            <div key={f.label} className="msr-EduSummary__item">
              <span className="msr-EduSummary__icon">{renderIcon(f.icon, "star")}</span>
              <span className="msr-EduSummary__count">{f.count}</span>
              <span className="msr-EduSummary__label">{f.label}</span>
            </div>
          ))}
        </div>
        {footer && <div className="msr-EduSummary__footer">{footer}</div>}
      </div>
    );
  },
);
