import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface QuickAction {
  id: string;
  label: string;
  icon: IconName | React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export interface QuickActionsPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  actions: QuickAction[];
  title?: React.ReactNode;
  columns?: number;
}

function renderIcon(icon: IconName | React.ReactNode, size: number) {
  return typeof icon === "string" ? <Icon name={icon as IconName} size={size} /> : icon;
}

/** Grid of prominent quick-action buttons. */
export const QuickActionsPanel = React.forwardRef<HTMLDivElement, QuickActionsPanelProps>(
  function QuickActionsPanel({ actions, title = "Quick actions", columns = 3, className, style, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("msr-QuickActions", className)} {...rest}>
        {title && <div className="msr-QuickActions__title">{title}</div>}
        <div className="msr-QuickActions__grid" style={{ ["--qa-cols" as string]: columns, ...style }}>
          {actions.map((a) => (
            <button key={a.id} type="button" className="msr-QuickActions__btn" disabled={a.disabled} onClick={a.onClick}>
              {a.badge != null && <span className="msr-QuickActions__badge">{a.badge}</span>}
              <span className="msr-QuickActions__icon">{renderIcon(a.icon, 22)}</span>
              <span className="msr-QuickActions__label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  },
);
