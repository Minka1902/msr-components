import * as React from "react";
import { cx } from "../../lib/cx";

/* Shared header used by all resource pages. */
interface ResourceTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

function ResourceTitle({ title, subtitle, actions }: ResourceTitleProps) {
  return (
    <div className="msr-Resource__header">
      <div>
        <h1 className="msr-Resource__title">{title}</h1>
        {subtitle && <p className="msr-Resource__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="msr-Resource__headerActions">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ResourceListPage                                                    */
/* ------------------------------------------------------------------ */

export interface ResourceListPageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Create button / primary action. */
  primaryAction?: React.ReactNode;
  /** Search field node. */
  search?: React.ReactNode;
  /** Filter controls. */
  filters?: React.ReactNode;
  /** The table or card grid. */
  children?: React.ReactNode;
  pagination?: React.ReactNode;
  loading?: boolean;
  /** Shown when there are no items (and not loading). */
  empty?: boolean;
  emptyState?: React.ReactNode;
}

/** Standard CRUD list page: title, search, filters, content, pagination. */
export const ResourceListPage = React.forwardRef<
  HTMLDivElement,
  ResourceListPageProps
>(function ResourceListPage(
  {
    title,
    subtitle,
    primaryAction,
    search,
    filters,
    children,
    pagination,
    loading,
    empty,
    emptyState,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Resource", "msr-ResourceList", className)} {...rest}>
      <ResourceTitle title={title} subtitle={subtitle} actions={primaryAction} />
      {(search || filters) && (
        <div className="msr-ResourceList__toolbar">
          {search && <div className="msr-ResourceList__search">{search}</div>}
          {filters && (
            <div className="msr-ResourceList__filters">{filters}</div>
          )}
        </div>
      )}
      <div className="msr-ResourceList__content">
        {loading ? (
          <div className="msr-Resource__loading" aria-busy="true">
            Loading…
          </div>
        ) : empty ? (
          emptyState ?? (
            <div className="msr-Resource__empty">No items found.</div>
          )
        ) : (
          children
        )}
      </div>
      {pagination && (
        <div className="msr-ResourceList__pagination">{pagination}</div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ResourceDetailsPage                                                 */
/* ------------------------------------------------------------------ */

export interface ResourceDetailsPageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  /** Tabs node (e.g. EntityTabs). */
  tabs?: React.ReactNode;
  /** Sidebar with metadata/related items. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

/** Standard details page for one entity (header, tabs, content, aside). */
export const ResourceDetailsPage = React.forwardRef<
  HTMLDivElement,
  ResourceDetailsPageProps
>(function ResourceDetailsPage(
  { title, subtitle, actions, tabs, aside, children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Resource", "msr-ResourceDetails", className)}
      {...rest}
    >
      <ResourceTitle title={title} subtitle={subtitle} actions={actions} />
      {tabs && <div className="msr-ResourceDetails__tabs">{tabs}</div>}
      <div className="msr-ResourceDetails__layout" data-has-aside={!!aside}>
        <div className="msr-ResourceDetails__main">{children}</div>
        {aside && <aside className="msr-ResourceDetails__aside">{aside}</aside>}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ResourceFormPage (shared by Create & Edit)                          */
/* ------------------------------------------------------------------ */

interface ResourceFormPageBaseProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "title" | "onSubmit"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitting?: boolean;
  /** Disable submit (e.g. invalid form). */
  submitDisabled?: boolean;
  /** Error banner above the actions. */
  error?: React.ReactNode;
  /** Step indicator node for multi-step create flows. */
  steps?: React.ReactNode;
}

const ResourceFormPage = React.forwardRef<
  HTMLFormElement,
  ResourceFormPageBaseProps & { variant: "create" | "edit"; dirty?: boolean }
>(function ResourceFormPage(
  {
    title,
    subtitle,
    children,
    onSubmit,
    onCancel,
    submitLabel,
    cancelLabel = "Cancel",
    submitting,
    submitDisabled,
    error,
    steps,
    variant,
    dirty,
    className,
    ...rest
  },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cx("msr-Resource", "msr-ResourceForm", className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      {...rest}
    >
      <ResourceTitle title={title} subtitle={subtitle} />
      {steps && <div className="msr-ResourceForm__steps">{steps}</div>}
      <div className="msr-ResourceForm__body">{children}</div>
      {error && (
        <div className="msr-ResourceForm__error" role="alert">
          {error}
        </div>
      )}
      <div className="msr-ResourceForm__actions">
        <button
          type="button"
          className="msr-ResourceForm__cancel"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          className="msr-ResourceForm__submit"
          disabled={submitting || submitDisabled}
        >
          {submitting
            ? "Saving…"
            : (submitLabel ?? (variant === "create" ? "Create" : "Save changes"))}
        </button>
      </div>
      {variant === "edit" && dirty && (
        <span className="msr-ResourceForm__dirty">Unsaved changes</span>
      )}
    </form>
  );
});

/* ------------------------------------------------------------------ */
/* ResourceCreatePage                                                  */
/* ------------------------------------------------------------------ */

export interface ResourceCreatePageProps extends ResourceFormPageBaseProps {}

/** Standard create screen with form, validation and save/cancel. */
export const ResourceCreatePage = React.forwardRef<
  HTMLFormElement,
  ResourceCreatePageProps
>(function ResourceCreatePage(props, ref) {
  return <ResourceFormPage ref={ref} variant="create" {...props} />;
});

/* ------------------------------------------------------------------ */
/* ResourceEditPage                                                    */
/* ------------------------------------------------------------------ */

export interface ResourceEditPageProps extends ResourceFormPageBaseProps {
  /** Marks the form dirty (shows the unsaved-changes hint). */
  dirty?: boolean;
}

/** Standard edit screen with existing data, dirty-state and save/cancel. */
export const ResourceEditPage = React.forwardRef<
  HTMLFormElement,
  ResourceEditPageProps
>(function ResourceEditPage({ dirty, ...props }, ref) {
  return <ResourceFormPage ref={ref} variant="edit" dirty={dirty} {...props} />;
});
