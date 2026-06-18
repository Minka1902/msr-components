import * as React from "react";
import { cx } from "../../lib/cx";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  /** Sidebar on the right instead of the left. */
  sidebarPosition?: "left" | "right";
  /** Collapse the sidebar to a slim rail / hide it. */
  sidebarCollapsed?: boolean;
  sidebarWidth?: number;
  collapsedWidth?: number;
  /** Make the header sticky (default true). */
  stickyHeader?: boolean;
}

/** Application layout shell: header + (collapsible) sidebar + content. */
export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    header,
    sidebar,
    sidebarPosition = "left",
    sidebarCollapsed = false,
    sidebarWidth = 260,
    collapsedWidth = 64,
    stickyHeader = true,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const width = sidebar ? (sidebarCollapsed ? collapsedWidth : sidebarWidth) : 0;
  return (
    <div
      ref={ref}
      className={cx("msr-AppShell", className)}
      data-sidebar-position={sidebarPosition}
      data-collapsed={sidebarCollapsed || undefined}
      style={{ ["--shell-sidebar-w" as string]: `${width}px`, ...style }}
      {...rest}
    >
      {header && (
        <header className="msr-AppShell__header" data-sticky={stickyHeader || undefined}>
          {header}
        </header>
      )}
      <div className="msr-AppShell__body">
        {sidebar && <aside className="msr-AppShell__sidebar">{sidebar}</aside>}
        <main className="msr-AppShell__content">{children}</main>
      </div>
    </div>
  );
});
