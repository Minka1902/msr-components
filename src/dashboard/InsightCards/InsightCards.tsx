import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface Insight {
  id: string;
  title: React.ReactNode;
  /** The headline value/answer, e.g. "firmware_v2.bin". */
  value: React.ReactNode;
  description?: React.ReactNode;
  icon?: IconName | React.ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
}

export interface InsightCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  insights: Insight[];
  columns?: number;
}

function renderIcon(icon: IconName | React.ReactNode, size: number) {
  return typeof icon === "string" ? <Icon name={icon as IconName} size={size} /> : icon;
}

/** Grid of auto-generated insight tiles ("Most reused file", etc.). */
export const InsightCards = React.forwardRef<HTMLDivElement, InsightCardsProps>(
  function InsightCards({ insights, columns = 3, className, style, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx("msr-Insights", className)}
        style={{ ["--ins-cols" as string]: columns, ...style }}
        {...rest}
      >
        {insights.map((ins) => {
          const Tag: React.ElementType = ins.onClick ? "button" : "div";
          return (
            <Tag
              key={ins.id}
              type={ins.onClick ? "button" : undefined}
              className="msr-Insights__card"
              data-tone={ins.tone ?? "primary"}
              data-clickable={ins.onClick ? true : undefined}
              onClick={ins.onClick}
            >
              {ins.icon && <span className="msr-Insights__icon">{renderIcon(ins.icon, 18)}</span>}
              <span className="msr-Insights__title">{ins.title}</span>
              <span className="msr-Insights__value">{ins.value}</span>
              {ins.description && <span className="msr-Insights__desc">{ins.description}</span>}
            </Tag>
          );
        })}
      </div>
    );
  },
);
