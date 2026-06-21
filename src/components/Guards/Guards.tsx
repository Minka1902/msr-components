import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* UnsavedChangesGuard                                                 */
/* ------------------------------------------------------------------ */

export interface UnsavedChangesGuardProps {
  /** When true, leaving the page is guarded. */
  when: boolean;
  /** Message shown in the native beforeunload prompt / inline banner. */
  message?: string;
  /** Render an inline warning banner while `when` is true. */
  showBanner?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Warns users before leaving a page with unsaved changes. Hooks into the
 * browser `beforeunload` event and optionally renders an inline banner.
 */
export function UnsavedChangesGuard({
  when,
  message = "You have unsaved changes. Are you sure you want to leave?",
  showBanner = false,
  className,
  children,
}: UnsavedChangesGuardProps) {
  React.useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when, message]);

  if (!showBanner) return <>{children}</>;
  return (
    <>
      {when && (
        <div className={cx("msr-UnsavedGuard", className)} role="status">
          <span className="msr-UnsavedGuard__dot" aria-hidden="true" />
          {message}
        </div>
      )}
      {children}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* PermissionGuard                                                     */
/* ------------------------------------------------------------------ */

export interface PermissionGuardProps {
  /** Permission(s) required. The user must have all of them. */
  required?: string | string[];
  /** Permissions/roles/flags the current user has. */
  granted: string[];
  /** Require any one (true) vs. all (false, default) of `required`. */
  any?: boolean;
  /** What to do when access is denied. */
  mode?: "hide" | "disable" | "fallback";
  /** Rendered when denied and `mode="fallback"`. */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/** Shows, hides, disables or replaces UI based on permissions/roles/flags. */
export function PermissionGuard({
  required,
  granted,
  any = false,
  mode = "hide",
  fallback = null,
  children,
}: PermissionGuardProps) {
  const reqs =
    required == null ? [] : Array.isArray(required) ? required : [required];
  const ok =
    reqs.length === 0
      ? true
      : any
        ? reqs.some((r) => granted.includes(r))
        : reqs.every((r) => granted.includes(r));

  if (ok) return <>{children}</>;
  if (mode === "hide") return null;
  if (mode === "fallback") return <>{fallback}</>;
  // disable
  return (
    <div className="msr-PermissionGuard--disabled" aria-disabled="true">
      {children}
    </div>
  );
}
