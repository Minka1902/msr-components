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

export interface DogProfileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
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
export const DogProfileHeader = React.forwardRef<HTMLDivElement, DogProfileHeaderProps>(
  function DogProfileHeader(
    { name, breed, age, avatar, status, humans, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-DogHeader", className)} {...rest}>
        <div className="msr-DogHeader__avatar">
          {avatar ? (
            <img src={avatar} alt="" />
          ) : (
            <Icon name="paw" size={32} />
          )}
        </div>
        <div className="msr-DogHeader__info">
          <div className="msr-DogHeader__name-row">
            <h2 className="msr-DogHeader__name">{name}</h2>
            {status && (
              <StatusBadge tone={status.tone ?? "success"} variant="soft" dot>
                {status.label}
              </StatusBadge>
            )}
          </div>
          <div className="msr-DogHeader__meta">
            {breed && <span>{breed}</span>}
            {breed && age && <span className="msr-DogHeader__sep">·</span>}
            {age && <span>{age}</span>}
          </div>
          {humans && humans.length > 0 && (
            <div className="msr-DogHeader__humans">
              <span className="msr-DogHeader__humans-label">Caregivers</span>
              <div className="msr-DogHeader__avatars">
                {humans.map((h) => (
                  <span
                    key={h.id}
                    className="msr-DogHeader__human"
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
