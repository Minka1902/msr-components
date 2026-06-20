import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { StatusBadge, type BadgeTone } from "../../components/StatusBadge/StatusBadge";

export interface CaregiverRef {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

export interface ProfileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  breed?: React.ReactNode;
  age?: React.ReactNode;
  avatar?: string;
  status?: { label: string; tone?: BadgeTone };
  humans?: CaregiverRef[];
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Profile header for a dog: avatar, name, breed/age, status, caregivers. */
export const ProfileHeader = React.forwardRef<HTMLDivElement, ProfileHeaderProps>(
  function ProfileHeader(
    { name, breed, age, avatar, status, humans, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-ProfileHeader", className)} {...rest}>
        <div className="msr-ProfileHeader__avatar">
          {avatar ? (
            <img src={avatar} alt="" />
          ) : (
            <Icon name="paw" size={32} />
          )}
        </div>
        <div className="msr-ProfileHeader__info">
          <div className="msr-ProfileHeader__name-row">
            <h2 className="msr-ProfileHeader__name">{name}</h2>
            {status && (
              <StatusBadge tone={status.tone ?? "success"} variant="soft" dot>
                {status.label}
              </StatusBadge>
            )}
          </div>
          <div className="msr-ProfileHeader__meta">
            {breed && <span>{breed}</span>}
            {breed && age && <span className="msr-ProfileHeader__sep">·</span>}
            {age && <span>{age}</span>}
          </div>
          {humans && humans.length > 0 && (
            <div className="msr-ProfileHeader__humans">
              <span className="msr-ProfileHeader__humans-label">Caregivers</span>
              <div className="msr-ProfileHeader__avatars">
                {humans.map((h) => (
                  <span
                    key={h.id}
                    className="msr-ProfileHeader__human"
                    title={h.role ? `${h.name} — ${h.role}` : h.name}
                  >
                    {h.avatar ? <img src={h.avatar} alt="" /> : initials(h.name)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
