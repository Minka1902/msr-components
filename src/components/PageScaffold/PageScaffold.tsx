import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* PageHeader                                                          */
/* ------------------------------------------------------------------ */

export interface Breadcrumb {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  /** Small metadata items rendered under the title (status, dates, ids). */
  meta?: React.ReactNode;
  /** Action buttons rendered on the trailing edge. */
  actions?: React.ReactNode;
  /** Optional leading node such as an icon or avatar. */
  icon?: React.ReactNode;
}

/** Standard page header with title, subtitle, breadcrumbs, metadata and actions. */
export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(
    { title, subtitle, breadcrumbs, meta, actions, icon, className, ...rest },
    ref,
  ) {
    return (
      <header ref={ref} className={cx("msr-PageHeader", className)} {...rest}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="msr-PageHeader__breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((b, i) => {
                const last = i === breadcrumbs.length - 1;
                return (
                  <li key={i} aria-current={last ? "page" : undefined}>
                    {b.href || b.onClick ? (
                      <a
                        href={b.href}
                        onClick={(e) => {
                          if (b.onClick) {
                            e.preventDefault();
                            b.onClick();
                          }
                        }}
                      >
                        {b.label}
                      </a>
                    ) : (
                      <span>{b.label}</span>
                    )}
                    {!last && (
                      <span className="msr-PageHeader__sep" aria-hidden="true">
                        /
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <div className="msr-PageHeader__row">
          <div className="msr-PageHeader__lead">
            {icon && <div className="msr-PageHeader__icon">{icon}</div>}
            <div className="msr-PageHeader__titles">
              <h1 className="msr-PageHeader__title">{title}</h1>
              {subtitle && (
                <p className="msr-PageHeader__subtitle">{subtitle}</p>
              )}
              {meta && <div className="msr-PageHeader__meta">{meta}</div>}
            </div>
          </div>
          {actions && <div className="msr-PageHeader__actions">{actions}</div>}
        </div>
      </header>
    );
  },
);

/* ------------------------------------------------------------------ */
/* PageSection                                                         */
/* ------------------------------------------------------------------ */

export interface PageSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Show a loading skeleton instead of children. */
  loading?: boolean;
  /** Rendered when `empty` is true and not loading. */
  empty?: boolean;
  emptyContent?: React.ReactNode;
  /** Rendered when `error` is set. */
  error?: React.ReactNode;
  /** Visual treatment of the section container. */
  bordered?: boolean;
}

/** Reusable section wrapper with title, actions, loading/empty/error states. */
export const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(
  function PageSection(
    {
      title,
      description,
      actions,
      loading,
      empty,
      emptyContent,
      error,
      bordered = true,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    let body: React.ReactNode;
    if (error) {
      body = (
        <div className="msr-PageSection__error" role="alert">
          {error}
        </div>
      );
    } else if (loading) {
      body = (
        <div className="msr-PageSection__loading" aria-busy="true">
          <span className="msr-PageSection__bar" />
          <span className="msr-PageSection__bar" />
          <span className="msr-PageSection__bar" />
        </div>
      );
    } else if (empty) {
      body = (
        <div className="msr-PageSection__empty">
          {emptyContent ?? "Nothing here yet."}
        </div>
      );
    } else {
      body = children;
    }

    return (
      <section
        ref={ref}
        className={cx("msr-PageSection", className)}
        data-bordered={bordered || undefined}
        {...rest}
      >
        {(title || actions || description) && (
          <div className="msr-PageSection__head">
            <div>
              {title && <h2 className="msr-PageSection__title">{title}</h2>}
              {description && (
                <p className="msr-PageSection__desc">{description}</p>
              )}
            </div>
            {actions && (
              <div className="msr-PageSection__actions">{actions}</div>
            )}
          </div>
        )}
        <div className="msr-PageSection__body">{body}</div>
      </section>
    );
  },
);

/* ------------------------------------------------------------------ */
/* PageActionsBar                                                      */
/* ------------------------------------------------------------------ */

export interface PageActionsBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Items aligned to the leading edge. */
  start?: React.ReactNode;
  /** Items aligned to the trailing edge (primary actions). */
  end?: React.ReactNode;
  /** Stick to the bottom of the viewport. */
  sticky?: boolean;
}

/** Consistent action area for page-level actions (save, cancel, export…). */
export const PageActionsBar = React.forwardRef<
  HTMLDivElement,
  PageActionsBarProps
>(function PageActionsBar(
  { start, end, sticky, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-PageActionsBar", className)}
      data-sticky={sticky || undefined}
      {...rest}
    >
      <div className="msr-PageActionsBar__start">{start}</div>
      <div className="msr-PageActionsBar__end">{end ?? children}</div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* BulkActionBar                                                       */
/* ------------------------------------------------------------------ */

export interface BulkActionBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Number of selected rows/cards. The bar hides itself when 0. */
  count: number;
  /** Noun for the selected items, e.g. "row" → "3 rows selected". */
  itemNoun?: string;
  /** Action buttons (delete, export, assign…). */
  actions?: React.ReactNode;
  /** Clears the current selection. */
  onClear?: () => void;
}

/** Floating bar shown when multiple rows/cards are selected. */
export const BulkActionBar = React.forwardRef<HTMLDivElement, BulkActionBarProps>(
  function BulkActionBar(
    { count, itemNoun = "item", actions, onClear, className, ...rest },
    ref,
  ) {
    if (count <= 0) return null;
    const noun = count === 1 ? itemNoun : `${itemNoun}s`;
    return (
      <div
        ref={ref}
        className={cx("msr-BulkActionBar", className)}
        role="toolbar"
        aria-label="Bulk actions"
        {...rest}
      >
        <span className="msr-BulkActionBar__count">
          {count} {noun} selected
        </span>
        <div className="msr-BulkActionBar__actions">{actions}</div>
        {onClear && (
          <button
            type="button"
            className="msr-BulkActionBar__clear"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
    );
  },
);
