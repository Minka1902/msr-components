import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Avatar } from "../../components/Avatar/Avatar";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { Button } from "../../components/Button/Button";

export type CaregiverRole = "owner" | "trainer" | "walker" | "foster" | "caregiver";
export type AccessStatus = "active" | "pending" | "revoked";

export interface Caregiver {
  id: string;
  name: string;
  role: CaregiverRole;
  status?: AccessStatus;
  avatar?: string;
}

export interface AccessManagerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  people: Caregiver[];
  title?: React.ReactNode;
  onApprove?: (id: string) => void;
  onRevoke?: (id: string) => void;
  onAdd?: () => void;
}

const STATUS_TONE = { active: "success", pending: "warning", revoked: "muted" } as const;

/** Manage caregivers/trainers/walkers/fosters and approve their access. */
export const AccessManager = React.forwardRef<HTMLDivElement, AccessManagerProps>(
  function AccessManager(
    { people, title = "People with access", onApprove, onRevoke, onAdd, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-HumanAccess", className)} {...rest}>
        <div className="msr-HumanAccess__header">
          <span className="msr-HumanAccess__title">{title}</span>
          {onAdd && (
            <Button size="sm" variant="soft" tone="primary" leftIcon={<Icon name="plus" size={14} />} onClick={onAdd}>
              Add
            </Button>
          )}
        </div>
        <ul className="msr-HumanAccess__list">
          {people.map((p) => (
            <li key={p.id} className="msr-HumanAccess__row">
              <Avatar size="sm" name={p.name} src={p.avatar} />
              <div className="msr-HumanAccess__info">
                <span className="msr-HumanAccess__name">{p.name}</span>
                <span className="msr-HumanAccess__role">{p.role}</span>
              </div>
              <StatusBadge tone={STATUS_TONE[p.status ?? "active"]} variant="soft" size="sm">
                {p.status ?? "active"}
              </StatusBadge>
              <div className="msr-HumanAccess__actions">
                {p.status === "pending" && onApprove && (
                  <Button size="sm" variant="ghost" tone="success" onClick={() => onApprove(p.id)}>Approve</Button>
                )}
                {p.role !== "owner" && p.status !== "revoked" && onRevoke && (
                  <Button size="sm" variant="ghost" tone="danger" onClick={() => onRevoke(p.id)}>Revoke</Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
