import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* DetailsDrawer                                                       */
/* ------------------------------------------------------------------ */

export interface DetailsDrawerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  /** Edge the drawer slides in from. */
  side?: "right" | "left";
  width?: number | string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/** Side drawer for inspecting/editing an item without leaving the list. */
export const DetailsDrawer = React.forwardRef<HTMLDivElement, DetailsDrawerProps>(
  function DetailsDrawer(
    {
      open,
      onClose,
      title,
      side = "right",
      width = 420,
      footer,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    React.useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose?.();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;
    return (
      <div className="msr-DetailsDrawer__root" data-side={side}>
        <div
          className="msr-DetailsDrawer__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          ref={ref}
          className={cx("msr-DetailsDrawer", className)}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === "string" ? title : "Details"}
          style={{ width: typeof width === "number" ? `${width}px` : width }}
          {...rest}
        >
          <div className="msr-DetailsDrawer__head">
            <span className="msr-DetailsDrawer__title">{title}</span>
            {onClose && (
              <button
                type="button"
                className="msr-DetailsDrawer__close"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            )}
          </div>
          <div className="msr-DetailsDrawer__body">{children}</div>
          {footer && (
            <div className="msr-DetailsDrawer__footer">{footer}</div>
          )}
        </div>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* MasterDetailLayout                                                  */
/* ------------------------------------------------------------------ */

export interface MasterDetailLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** The list pane (left). */
  master: React.ReactNode;
  /** The detail pane (right). */
  detail: React.ReactNode;
  /** Width of the master pane. */
  masterWidth?: number | string;
  /** Shown in the detail pane when nothing is selected. */
  placeholder?: React.ReactNode;
  /** When false, render `placeholder` instead of `detail`. */
  hasSelection?: boolean;
}

/** Two-pane layout: a list on the left and selected item on the right. */
export const MasterDetailLayout = React.forwardRef<
  HTMLDivElement,
  MasterDetailLayoutProps
>(function MasterDetailLayout(
  {
    master,
    detail,
    masterWidth = 300,
    placeholder,
    hasSelection = true,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-MasterDetail", className)}
      style={{
        gridTemplateColumns: `${
          typeof masterWidth === "number" ? `${masterWidth}px` : masterWidth
        } 1fr`,
      }}
      {...rest}
    >
      <div className="msr-MasterDetail__master">{master}</div>
      <div className="msr-MasterDetail__detail">
        {hasSelection
          ? detail
          : (placeholder ?? (
              <div className="msr-MasterDetail__placeholder">
                Select an item to view details.
              </div>
            ))}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SettingsLayout                                                      */
/* ------------------------------------------------------------------ */

export interface SettingsNavItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SettingsLayoutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "title"> {
  nav: SettingsNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

/** Settings page layout: left-side navigation, right-side content. */
export const SettingsLayout = React.forwardRef<
  HTMLDivElement,
  SettingsLayoutProps
>(function SettingsLayout(
  { nav, activeId, onSelect, title, children, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-SettingsLayout", className)} {...rest}>
      <nav className="msr-SettingsLayout__nav" aria-label="Settings">
        {title && <div className="msr-SettingsLayout__navTitle">{title}</div>}
        <ul>
          {nav.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className="msr-SettingsLayout__navItem"
                data-active={n.id === activeId || undefined}
                onClick={() => onSelect?.(n.id)}
              >
                {n.icon && (
                  <span className="msr-SettingsLayout__navIcon">{n.icon}</span>
                )}
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="msr-SettingsLayout__content">{children}</div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* AdminLayout                                                         */
/* ------------------------------------------------------------------ */

export interface AdminLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Brand/logo node shown at the top of the sidebar. */
  brand?: React.ReactNode;
  /** Sidebar navigation content. */
  sidebar?: React.ReactNode;
  /** Topbar content (search, etc.). */
  topbar?: React.ReactNode;
  /** User menu / avatar shown on the right of the topbar. */
  userMenu?: React.ReactNode;
  /** Breadcrumbs node. */
  breadcrumbs?: React.ReactNode;
  /** Collapse the sidebar to icons only. */
  collapsed?: boolean;
  children?: React.ReactNode;
}

/** Full admin shell: sidebar, topbar, user menu, content, breadcrumbs. */
export const AdminLayout = React.forwardRef<HTMLDivElement, AdminLayoutProps>(
  function AdminLayout(
    {
      brand,
      sidebar,
      topbar,
      userMenu,
      breadcrumbs,
      collapsed,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-AdminLayout", className)}
        data-collapsed={collapsed || undefined}
        {...rest}
      >
        <aside className="msr-AdminLayout__sidebar">
          {brand && <div className="msr-AdminLayout__brand">{brand}</div>}
          <nav className="msr-AdminLayout__nav">{sidebar}</nav>
        </aside>
        <div className="msr-AdminLayout__main">
          <header className="msr-AdminLayout__topbar">
            <div className="msr-AdminLayout__topbarStart">{topbar}</div>
            {userMenu && (
              <div className="msr-AdminLayout__userMenu">{userMenu}</div>
            )}
          </header>
          {breadcrumbs && (
            <div className="msr-AdminLayout__breadcrumbs">{breadcrumbs}</div>
          )}
          <main className="msr-AdminLayout__content">{children}</main>
        </div>
      </div>
    );
  },
);
