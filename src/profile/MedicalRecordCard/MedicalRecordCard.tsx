import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";

export type MedicalKind = "vaccination" | "medication" | "vet-visit" | "checkup";

export interface MedicalRecordCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  kind: MedicalKind;
  title: React.ReactNode;
  date?: React.ReactNode;
  /** Next due date; if it reads as overdue, pass `overdue`. */
  nextDue?: React.ReactNode;
  overdue?: boolean;
  notes?: React.ReactNode;
}

const KIND_META: Record<MedicalKind, { icon: IconName; label: string }> = {
  vaccination: { icon: "shield", label: "Vaccination" },
  medication: { icon: "pill", label: "Medication" },
  "vet-visit": { icon: "stethoscope", label: "Vet visit" },
  checkup: { icon: "heart", label: "Checkup" },
};

/** Medical record entry: shots, medications, vet visits with due dates. */
export const MedicalRecordCard = React.forwardRef<HTMLDivElement, MedicalRecordCardProps>(
  function MedicalRecordCard(
    { kind, title, date, nextDue, overdue, notes, className, ...rest },
    ref,
  ) {
    const meta = KIND_META[kind];
    return (
      <div ref={ref} className={cx("msr-MedRecord", className)} {...rest}>
        <span className="msr-MedRecord__icon" data-kind={kind}>
          <Icon name={meta.icon} size={18} />
        </span>
        <div className="msr-MedRecord__body">
          <div className="msr-MedRecord__head">
            <span className="msr-MedRecord__kind">{meta.label}</span>
            {date && <span className="msr-MedRecord__date">{date}</span>}
          </div>
          <div className="msr-MedRecord__title">{title}</div>
          {notes && <div className="msr-MedRecord__notes">{notes}</div>}
          {nextDue && (
            <div className="msr-MedRecord__due">
              <span>Next due: {nextDue}</span>
              {overdue && (
                <StatusBadge tone="danger" variant="soft" size="sm">
                  Overdue
                </StatusBadge>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
