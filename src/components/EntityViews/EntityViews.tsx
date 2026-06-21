import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* EntityTabs                                                          */
/* ------------------------------------------------------------------ */

export interface EntityTab {
  id: string;
  label: React.ReactNode;
  /** Optional count badge (e.g. number of files). */
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface EntityTabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: EntityTab[];
  activeId: string;
  onChange: (id: string) => void;
}

/** Standard tab set for entity pages (Overview, History, Files…). */
export const EntityTabs = React.forwardRef<HTMLDivElement, EntityTabsProps>(
  function EntityTabs({ tabs, activeId, onChange, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx("msr-EntityTabs", className)}
        role="tablist"
        {...rest}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activeId}
            disabled={t.disabled}
            className="msr-EntityTabs__tab"
            data-active={t.id === activeId || undefined}
            onClick={() => onChange(t.id)}
          >
            {t.icon && <span className="msr-EntityTabs__icon">{t.icon}</span>}
            {t.label}
            {t.count != null && (
              <span className="msr-EntityTabs__count">{t.count}</span>
            )}
          </button>
        ))}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* MetadataGrid                                                        */
/* ------------------------------------------------------------------ */

export interface MetadataItem {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Span this item across the full row. */
  full?: boolean;
}

export interface MetadataGridProps
  extends React.HTMLAttributes<HTMLDListElement> {
  items: MetadataItem[];
  columns?: number;
}

/** Clean key-value grid for IDs, status, dates, owners, counts. */
export const MetadataGrid = React.forwardRef<HTMLDListElement, MetadataGridProps>(
  function MetadataGrid({ items, columns = 2, className, ...rest }, ref) {
    return (
      <dl
        ref={ref}
        className={cx("msr-MetaGrid", className)}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
        {...rest}
      >
        {items.map((it, i) => (
          <div
            key={i}
            className="msr-MetaGrid__item"
            data-full={it.full || undefined}
            style={it.full ? { gridColumn: "1 / -1" } : undefined}
          >
            <dt className="msr-MetaGrid__label">{it.label}</dt>
            <dd className="msr-MetaGrid__value">{it.value}</dd>
          </div>
        ))}
      </dl>
    );
  },
);

/* ------------------------------------------------------------------ */
/* DangerZone                                                          */
/* ------------------------------------------------------------------ */

export interface DangerAction {
  title: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel: string;
  onAction: () => void;
  /** Require a confirmation click before firing. */
  confirm?: boolean;
}

export interface DangerZoneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  actions: DangerAction[];
}

function DangerRow({ action }: { action: DangerAction }) {
  const [armed, setArmed] = React.useState(false);
  return (
    <div className="msr-DangerZone__row">
      <div className="msr-DangerZone__text">
        <div className="msr-DangerZone__rowTitle">{action.title}</div>
        {action.description && (
          <div className="msr-DangerZone__rowDesc">{action.description}</div>
        )}
      </div>
      {action.confirm ? (
        armed ? (
          <div className="msr-DangerZone__confirm">
            <button
              type="button"
              className="msr-DangerZone__cancel"
              onClick={() => setArmed(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="msr-DangerZone__btn"
              onClick={() => {
                action.onAction();
                setArmed(false);
              }}
            >
              Confirm
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="msr-DangerZone__btn"
            onClick={() => setArmed(true)}
          >
            {action.buttonLabel}
          </button>
        )
      ) : (
        <button
          type="button"
          className="msr-DangerZone__btn"
          onClick={action.onAction}
        >
          {action.buttonLabel}
        </button>
      )}
    </div>
  );
}

/** Standardized destructive-action section (delete, disable, revoke…). */
export const DangerZone = React.forwardRef<HTMLDivElement, DangerZoneProps>(
  function DangerZone(
    { title = "Danger zone", actions, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-DangerZone", className)} {...rest}>
        <div className="msr-DangerZone__head">{title}</div>
        <div className="msr-DangerZone__rows">
          {actions.map((a, i) => (
            <DangerRow key={i} action={a} />
          ))}
        </div>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* ReviewBeforeSubmit                                                  */
/* ------------------------------------------------------------------ */

export interface ReviewSection {
  title: React.ReactNode;
  items: Array<{ label: React.ReactNode; value: React.ReactNode }>;
  /** Jump back to edit this section. */
  onEdit?: () => void;
}

export interface ReviewBeforeSubmitProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  sections: ReviewSection[];
  onSubmit?: () => void;
  submitLabel?: string;
  submitting?: boolean;
}

/** Final review screen before saving/publishing/sending data. */
export const ReviewBeforeSubmit = React.forwardRef<
  HTMLDivElement,
  ReviewBeforeSubmitProps
>(function ReviewBeforeSubmit(
  {
    title = "Review",
    sections,
    onSubmit,
    submitLabel = "Submit",
    submitting,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Review", className)} {...rest}>
      <h2 className="msr-Review__title">{title}</h2>
      {sections.map((s, i) => (
        <div key={i} className="msr-Review__section">
          <div className="msr-Review__sectionHead">
            <span className="msr-Review__sectionTitle">{s.title}</span>
            {s.onEdit && (
              <button
                type="button"
                className="msr-Review__edit"
                onClick={s.onEdit}
              >
                Edit
              </button>
            )}
          </div>
          <dl className="msr-Review__items">
            {s.items.map((it, j) => (
              <div key={j} className="msr-Review__item">
                <dt>{it.label}</dt>
                <dd>{it.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      {onSubmit && (
        <div className="msr-Review__actions">
          <button
            type="button"
            className="msr-Review__submit"
            disabled={submitting}
            onClick={onSubmit}
          >
            {submitting ? "Submitting…" : submitLabel}
          </button>
        </div>
      )}
    </div>
  );
});
