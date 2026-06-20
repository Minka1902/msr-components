import * as React from "react";
import { cx } from "../../lib/cx";
import { Avatar } from "../Avatar";

export interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
  status?: "online" | "away" | "offline";
  /** Ring/cursor color associated with the user. */
  color?: string;
}

export interface PresenceAvatarsProps extends React.HTMLAttributes<HTMLDivElement> {
  users: PresenceUser[];
  /** Maximum avatars before collapsing into "+N". */
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Show a "N online" count label. */
  showCount?: boolean;
  onUserClick?: (user: PresenceUser) => void;
}

/** Overlapping avatar stack showing who is present, with status rings. */
export const PresenceAvatars = React.forwardRef<HTMLDivElement, PresenceAvatarsProps>(function PresenceAvatars(
  { users, max = 5, size = "md", showCount = false, onUserClick, className, ...rest },
  ref,
) {
  const shown = users.slice(0, max);
  const overflow = users.length - shown.length;
  const online = users.filter((u) => (u.status ?? "online") === "online").length;

  return (
    <div ref={ref} className={cx("msr-PresenceAvatars", className)} data-size={size} {...rest}>
      <div className="msr-PresenceAvatars__stack">
        {shown.map((u) => (
          <span
            key={u.id}
            className="msr-PresenceAvatars__item"
            data-status={u.status ?? "online"}
            style={u.color ? ({ "--msr-presence-ring": u.color } as React.CSSProperties) : undefined}
            onClick={onUserClick ? () => onUserClick(u) : undefined}
            role={onUserClick ? "button" : undefined}
            tabIndex={onUserClick ? 0 : undefined}
            onKeyDown={
              onUserClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onUserClick(u);
                    }
                  }
                : undefined
            }
            title={u.name}
          >
            <Avatar src={u.avatarUrl} name={u.name} size={size} />
            <span className="msr-PresenceAvatars__dot" aria-hidden="true" />
          </span>
        ))}
        {overflow > 0 && (
          <span className="msr-PresenceAvatars__item msr-PresenceAvatars__overflow" title={`${overflow} more`}>
            +{overflow}
          </span>
        )}
      </div>
      {showCount && (
        <span className="msr-PresenceAvatars__count">{online} online</span>
      )}
    </div>
  );
});
