import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* ConditionalFieldGroup                                               */
/* ------------------------------------------------------------------ */

export interface ConditionalFieldGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Render children only when true. */
  when: boolean;
  /** Animate the appearance with a height/opacity transition. */
  animate?: boolean;
  children?: React.ReactNode;
}

/** Shows or hides a group of fields based on another field's value. */
export const ConditionalFieldGroup = React.forwardRef<
  HTMLDivElement,
  ConditionalFieldGroupProps
>(function ConditionalFieldGroup(
  { when, animate = true, children, className, ...rest },
  ref,
) {
  if (!when) return null;
  return (
    <div
      ref={ref}
      className={cx("msr-CondGroup", className)}
      data-animate={animate || undefined}
      {...rest}
    >
      {children}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* RepeatableFieldArray                                                */
/* ------------------------------------------------------------------ */

export interface RepeatableFieldArrayProps<T>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
  items: T[];
  onChange: (items: T[]) => void;
  /** Factory for a new blank item. */
  createItem: () => T;
  /** Renders one row. */
  renderItem: (
    item: T,
    index: number,
    update: (patch: Partial<T>) => void,
  ) => React.ReactNode;
  addLabel?: string;
  /** Allow drag-free reordering with up/down controls. */
  reorderable?: boolean;
  minItems?: number;
  maxItems?: number;
}

/** Add, remove, reorder and edit repeated form groups. */
export function RepeatableFieldArray<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel = "Add item",
  reorderable = true,
  minItems = 0,
  maxItems,
  className,
  ...rest
}: RepeatableFieldArrayProps<T>) {
  const update = (i: number, patch: Partial<T>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) =>
    onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const canAdd = maxItems == null || items.length < maxItems;

  return (
    <div className={cx("msr-Repeatable", className)} {...rest}>
      {items.map((item, i) => (
        <div key={i} className="msr-Repeatable__row">
          <div className="msr-Repeatable__content">
            {renderItem(item, i, (patch) => update(i, patch))}
          </div>
          <div className="msr-Repeatable__controls">
            {reorderable && (
              <>
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                >
                  ↓
                </button>
              </>
            )}
            <button
              type="button"
              className="msr-Repeatable__remove"
              aria-label="Remove"
              onClick={() => remove(i)}
              disabled={items.length <= minItems}
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="msr-Repeatable__add"
        onClick={() => onChange([...items, createItem()])}
        disabled={!canAdd}
      >
        + {addLabel}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FormSectionCard                                                     */
/* ------------------------------------------------------------------ */

export type FormSectionState = "default" | "valid" | "error";

export interface FormSectionCardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  state?: FormSectionState;
  actions?: React.ReactNode;
  /** Make the section collapsible. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  children?: React.ReactNode;
}

/** Card wrapper for long form sections with title, description, state. */
export const FormSectionCard = React.forwardRef<
  HTMLElement,
  FormSectionCardProps
>(function FormSectionCard(
  {
    title,
    description,
    state = "default",
    actions,
    collapsible,
    defaultOpen = true,
    children,
    className,
    ...rest
  },
  ref,
) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section
      ref={ref}
      className={cx("msr-FormSection", className)}
      data-state={state}
      {...rest}
    >
      <div className="msr-FormSection__head">
        <button
          type="button"
          className="msr-FormSection__titleBtn"
          onClick={collapsible ? () => setOpen((o) => !o) : undefined}
          aria-expanded={collapsible ? open : undefined}
          data-collapsible={collapsible || undefined}
        >
          {collapsible && (
            <span className="msr-FormSection__chevron" data-open={open || undefined}>
              ›
            </span>
          )}
          <span>
            <span className="msr-FormSection__title">{title}</span>
            {description && (
              <span className="msr-FormSection__desc">{description}</span>
            )}
          </span>
          {state === "valid" && (
            <span className="msr-FormSection__badge" data-state="valid">
              ✓
            </span>
          )}
          {state === "error" && (
            <span className="msr-FormSection__badge" data-state="error">
              !
            </span>
          )}
        </button>
        {actions && <div className="msr-FormSection__actions">{actions}</div>}
      </div>
      {(!collapsible || open) && (
        <div className="msr-FormSection__body">{children}</div>
      )}
    </section>
  );
});

/* ------------------------------------------------------------------ */
/* FormProgressSidebar                                                 */
/* ------------------------------------------------------------------ */

export type FormSectionStatus =
  | "complete"
  | "incomplete"
  | "error"
  | "optional"
  | "active";

export interface FormProgressItem {
  id: string;
  label: React.ReactNode;
  status: FormSectionStatus;
}

export interface FormProgressSidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  items: FormProgressItem[];
  onSelect?: (id: string) => void;
}

const STATUS_GLYPH: Record<FormSectionStatus, string> = {
  complete: "✓",
  incomplete: "○",
  error: "!",
  optional: "–",
  active: "●",
};

/** Shows progress through long forms by section. */
export const FormProgressSidebar = React.forwardRef<
  HTMLElement,
  FormProgressSidebarProps
>(function FormProgressSidebar({ items, onSelect, className, ...rest }, ref) {
  const complete = items.filter((i) => i.status === "complete").length;
  const required = items.filter((i) => i.status !== "optional").length;
  return (
    <nav
      ref={ref}
      className={cx("msr-FormProgress", className)}
      aria-label="Form progress"
      {...rest}
    >
      <div className="msr-FormProgress__summary">
        {complete}/{required} sections complete
      </div>
      <ol className="msr-FormProgress__list">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              className="msr-FormProgress__item"
              data-status={it.status}
              onClick={() => onSelect?.(it.id)}
            >
              <span
                className="msr-FormProgress__glyph"
                data-status={it.status}
                aria-hidden="true"
              >
                {STATUS_GLYPH[it.status]}
              </span>
              {it.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
});

/* ------------------------------------------------------------------ */
/* RequiredFieldsIndicator                                             */
/* ------------------------------------------------------------------ */

export interface RequiredFieldsIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Names/labels of required fields still missing. */
  missing: Array<{ name: string; label?: React.ReactNode }>;
  /** Total number of required fields, for the count. */
  total?: number;
  onFieldClick?: (name: string) => void;
}

/** Shows which required fields are missing and guides completion. */
export const RequiredFieldsIndicator = React.forwardRef<
  HTMLDivElement,
  RequiredFieldsIndicatorProps
>(function RequiredFieldsIndicator(
  { missing, total, onFieldClick, className, ...rest },
  ref,
) {
  if (missing.length === 0) {
    return (
      <div
        ref={ref}
        className={cx("msr-RequiredFields", "msr-RequiredFields--ok", className)}
        {...rest}
      >
        <span aria-hidden="true">✓</span> All required fields complete.
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={cx("msr-RequiredFields", className)}
      role="status"
      {...rest}
    >
      <div className="msr-RequiredFields__head">
        {missing.length} required field{missing.length === 1 ? "" : "s"}{" "}
        {total != null && `of ${total} `}still missing
      </div>
      <ul className="msr-RequiredFields__list">
        {missing.map((f) => (
          <li key={f.name}>
            <button
              type="button"
              className="msr-RequiredFields__field"
              onClick={() => onFieldClick?.(f.name)}
            >
              {f.label ?? f.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
