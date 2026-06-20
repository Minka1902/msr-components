import * as React from "react";
import { cx } from "../../lib/cx";
import { Avatar } from "../Avatar";

export interface UserCardStat {
  label: string;
  value: React.ReactNode;
}

export interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  avatarUrl?: string;
  /** Handle/subtitle, e.g. "@jane". */
  handle?: string;
  bio?: React.ReactNode;
  status?: "online" | "away" | "offline";
  stats?: UserCardStat[];
  /** Action buttons rendered in the footer. */
  actions?: React.ReactNode;
  /** Optional banner/cover area. */
  cover?: React.ReactNode;
}

/** Compact profile card for hovercards, mentions and directories. */
export const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(function UserCard(
  { name, avatarUrl, handle, bio, status, stats, actions, cover, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-UserCard", className)} {...rest}>
      {cover && <div className="msr-UserCard__cover">{cover}</div>}
      <div className="msr-UserCard__head">
        <span className="msr-UserCard__avatar" data-status={status ?? undefined}>
          <Avatar src={avatarUrl} name={name} size="lg" />
          {status && <span className="msr-UserCard__dot" aria-hidden="true" />}
        </span>
        <div className="msr-UserCard__identity">
          <span className="msr-UserCard__name">{name}</span>
          {handle && <span className="msr-UserCard__handle">{handle}</span>}
        </div>
      </div>
      {bio && <p className="msr-UserCard__bio">{bio}</p>}
      {stats && stats.length > 0 && (
        <div className="msr-UserCard__stats">
          {stats.map((s) => (
            <div key={s.label} className="msr-UserCard__stat">
              <span className="msr-UserCard__statValue">{s.value}</span>
              <span className="msr-UserCard__statLabel">{s.label}</span>
            </div>
          ))}
        </div>
      )}
      {actions && <div className="msr-UserCard__actions">{actions}</div>}
    </div>
  );
});
