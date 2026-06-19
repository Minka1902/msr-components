import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { RelativeTime } from "../../components/Text/Text";

export interface RecentItem {
  id: string;
  label: React.ReactNode;
  /** Secondary text (path, type…). */
  meta?: React.ReactNode;
  icon?: IconName | React.ReactNode;
  /** Last-accessed time (Date/ms/ISO). */
  at?: Date | number | string;
  onClick?: () => void;
}

export interface RecentItemsPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  items: RecentItem[];
  title?: React.ReactNode;
  emptyMessage?: React.ReactNode;
}

function renderIcon(icon: IconName | React.ReactNode, size: number) {
  return typeof icon === "string" ? <Icon name={icon as IconName} size={size} /> : icon;
}

/** List of recently opened items with relative timestamps. */
export const RecentItemsPanel = React.forwardRef<HTMLDivElement, RecentItemsPanelProps>(
  function RecentItemsPanel({ items, title = "Recent", emptyMessage = "Nothing recent", className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("msr-Recent", className)} {...rest}>
        {title && <div className="msr-Recent__title">{title}</div>}
        {items.length === 0 ? (
          <div className="msr-Recent__empty">{emptyMessage}</div>
        ) : (
          <ul className="msr-Recent__list">
            {items.map((item) => (
              <li key={item.id}>
                <button type="button" className="msr-Recent__item" onClick={item.onClick}>
                  <span className="msr-Recent__icon">{renderIcon(item.icon ?? "file", 16)}</span>
                  <span className="msr-Recent__body">
                    <span className="msr-Recent__label">{item.label}</span>
                    {item.meta && <span className="msr-Recent__meta">{item.meta}</span>}
                  </span>
                  {item.at != null && <RelativeTime className="msr-Recent__time" date={item.at} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
