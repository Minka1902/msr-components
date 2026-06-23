import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* NotificationItem                                                    */
/* ------------------------------------------------------------------ */

export type NotificationTone = "info" | "success" | "warning" | "danger";

export interface NotificationItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  body?: React.ReactNode;
  timestamp?: Date | string;
  tone?: NotificationTone;
  icon?: React.ReactNode;
  read?: boolean;
  /** Inline action buttons. */
  actions?: React.ReactNode;
  onMarkRead?: () => void;
  onDismiss?: () => void;
}

function relTime(d: Date): string {
  const diff = Date.now() - d.getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

/** A single notification row (icon, title, body, time, actions). */
export const NotificationItem = React.forwardRef<
  HTMLDivElement,
  NotificationItemProps
>(function NotificationItem(
  {
    title,
    body,
    timestamp,
    tone = "info",
    icon,
    read,
    actions,
    onMarkRead,
    onDismiss,
    className,
    ...rest
  },
  ref,
) {
  const time =
    timestamp && (typeof timestamp === "string" ? new Date(timestamp) : timestamp);
  return (
    <div
      ref={ref}
      className={cx("msr-Notif", className)}
      data-tone={tone}
      data-read={read || undefined}
      {...rest}
    >
      {!read && <span className="msr-Notif__unread" aria-label="Unread" />}
      <span className="msr-Notif__icon" data-tone={tone} aria-hidden="true">
        {icon ??
          (tone === "success"
            ? "✓"
            : tone === "warning"
              ? "!"
              : tone === "danger"
                ? "✕"
                : "i")}
      </span>
      <div className="msr-Notif__body">
        <div className="msr-Notif__title">{title}</div>
        {body && <div className="msr-Notif__text">{body}</div>}
        {time && <div className="msr-Notif__time">{relTime(time)}</div>}
        {actions && <div className="msr-Notif__actions">{actions}</div>}
      </div>
      <div className="msr-Notif__controls">
        {!read && onMarkRead && (
          <button
            type="button"
            className="msr-Notif__ctrl"
            aria-label="Mark as read"
            onClick={onMarkRead}
          >
            ●
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="msr-Notif__ctrl"
            aria-label="Dismiss"
            onClick={onDismiss}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* NotificationCenter                                                  */
/* ------------------------------------------------------------------ */

export interface NotificationEntry {
  id: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  timestamp?: Date | string;
  tone?: NotificationTone;
  read?: boolean;
}

export interface NotificationCenterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  notifications: NotificationEntry[];
  title?: React.ReactNode;
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  emptyText?: React.ReactNode;
}

/** Panel listing notifications with unread count and mark-all-read. */
export const NotificationCenter = React.forwardRef<
  HTMLDivElement,
  NotificationCenterProps
>(function NotificationCenter(
  {
    notifications,
    title = "Notifications",
    onMarkRead,
    onMarkAllRead,
    onDismiss,
    emptyText = "You're all caught up.",
    className,
    ...rest
  },
  ref,
) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div ref={ref} className={cx("msr-NotifCenter", className)} {...rest}>
      <div className="msr-NotifCenter__head">
        <span className="msr-NotifCenter__title">
          {title}
          {unread > 0 && (
            <span className="msr-NotifCenter__count">{unread}</span>
          )}
        </span>
        {unread > 0 && onMarkAllRead && (
          <button
            type="button"
            className="msr-NotifCenter__allRead"
            onClick={onMarkAllRead}
          >
            Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="msr-NotifCenter__empty">{emptyText}</div>
      ) : (
        <div className="msr-NotifCenter__list">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              title={n.title}
              body={n.body}
              timestamp={n.timestamp}
              tone={n.tone}
              read={n.read}
              onMarkRead={onMarkRead ? () => onMarkRead(n.id) : undefined}
              onDismiss={onDismiss ? () => onDismiss(n.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* AnnouncementBanner                                                  */
/* ------------------------------------------------------------------ */

export type AnnouncementTone = "info" | "success" | "warning" | "promo";

export interface AnnouncementBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AnnouncementTone;
  icon?: React.ReactNode;
  /** Call-to-action node (e.g. a link/button). */
  action?: React.ReactNode;
  onDismiss?: () => void;
  /** Center the content (common for promo bars). */
  center?: boolean;
  children?: React.ReactNode;
}

/** Dismissible top-of-page announcement / promo bar. */
export const AnnouncementBanner = React.forwardRef<
  HTMLDivElement,
  AnnouncementBannerProps
>(function AnnouncementBanner(
  { tone = "info", icon, action, onDismiss, center, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Announce", className)}
      data-tone={tone}
      data-center={center || undefined}
      role="status"
      {...rest}
    >
      {icon && <span className="msr-Announce__icon">{icon}</span>}
      <span className="msr-Announce__text">{children}</span>
      {action && <span className="msr-Announce__action">{action}</span>}
      {onDismiss && (
        <button
          type="button"
          className="msr-Announce__dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
});
