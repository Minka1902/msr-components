import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { Popover } from "../../components/Popover/Popover";
import { RelativeTime } from "../../components/Text/Text";

export interface NotificationItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  at?: Date | number | string;
  read?: boolean;
  tone?: "info" | "success" | "warning" | "danger";
  icon?: IconName | React.ReactNode;
  /** Optional group/section label. */
  group?: string;
  onClick?: () => void;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAllRead?: () => void;
  onItemClick?: (item: NotificationItem) => void;
  emptyMessage?: React.ReactNode;
  className?: string;
}

const TONE_ICON: Record<string, IconName> = {
  info: "info",
  success: "checkCircle",
  warning: "warning",
  danger: "alert",
};

function renderIcon(item: NotificationItem) {
  if (item.icon) return typeof item.icon === "string" ? <Icon name={item.icon as IconName} size={16} /> : item.icon;
  return <Icon name={TONE_ICON[item.tone ?? "info"]} size={16} />;
}

/** Bell trigger with a popover of grouped, unread-aware notifications. */
export function NotificationCenter({
  notifications,
  onMarkAllRead,
  onItemClick,
  emptyMessage = "You're all caught up",
  className,
}: NotificationCenterProps) {
  const unread = notifications.filter((n) => !n.read).length;

  // Preserve order of first appearance for groups.
  const groups: Array<{ name: string | undefined; items: NotificationItem[] }> = [];
  notifications.forEach((n) => {
    let g = groups.find((x) => x.name === n.group);
    if (!g) { g = { name: n.group, items: [] }; groups.push(g); }
    g.items.push(n);
  });

  return (
    <Popover
      placement="bottom"
      unstyled
      className={cx("msr-Notif__popover", className)}
      trigger={
        <button type="button" className="msr-Notif__bell" aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}>
          <Icon name="bell" size={18} />
          {unread > 0 && <span className="msr-Notif__dot">{unread > 9 ? "9+" : unread}</span>}
        </button>
      }
    >
      <div className="msr-Notif">
        <div className="msr-Notif__header">
          <span className="msr-Notif__title">Notifications</span>
          {unread > 0 && onMarkAllRead && (
            <button type="button" className="msr-Notif__markall" onClick={onMarkAllRead}>
              Mark all read
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="msr-Notif__empty">{emptyMessage}</div>
        ) : (
          <div className="msr-Notif__scroll">
            {groups.map((group) => (
              <div key={group.name ?? "_"} className="msr-Notif__group">
                {group.name && <div className="msr-Notif__group-label">{group.name}</div>}
                {group.items.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    className="msr-Notif__item"
                    data-unread={!n.read || undefined}
                    onClick={() => { n.onClick?.(); onItemClick?.(n); }}
                  >
                    <span className="msr-Notif__icon" data-tone={n.tone ?? "info"}>{renderIcon(n)}</span>
                    <span className="msr-Notif__body">
                      <span className="msr-Notif__item-title">{n.title}</span>
                      {n.description && <span className="msr-Notif__desc">{n.description}</span>}
                      {n.at != null && <RelativeTime className="msr-Notif__time" date={n.at} />}
                    </span>
                    {!n.read && <span className="msr-Notif__unread-dot" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Popover>
  );
}
