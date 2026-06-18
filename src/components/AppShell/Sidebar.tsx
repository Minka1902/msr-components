import * as React from "react";
import { cx } from "../../lib/cx";

export interface SidebarItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
  active?: boolean;
}

export interface SidebarGroup {
  /** Section heading (hidden when collapsed). */
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  groups: SidebarGroup[];
  /** Slim icon-only rail. */
  collapsed?: boolean;
  /** Content pinned to the bottom (e.g. user menu). */
  footer?: React.ReactNode;
}

/** Navigation list for use inside AppShell's sidebar slot. */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { groups, collapsed = false, footer, className, ...rest },
  ref,
) {
  return (
    <nav ref={ref} className={cx("msr-Sidebar", className)} data-collapsed={collapsed || undefined} {...rest}>
      <div className="msr-Sidebar__scroll">
        {groups.map((group, gi) => (
          <div key={gi} className="msr-Sidebar__group">
            {group.label && !collapsed && <div className="msr-Sidebar__group-label">{group.label}</div>}
            {group.items.map((item) => {
              const Tag: React.ElementType = item.href ? "a" : "button";
              return (
                <Tag
                  key={item.id}
                  className="msr-Sidebar__item"
                  data-active={item.active || undefined}
                  href={item.href}
                  type={item.href ? undefined : "button"}
                  title={collapsed && typeof item.label === "string" ? item.label : undefined}
                  aria-current={item.active ? "page" : undefined}
                  onClick={item.onClick}
                >
                  {item.icon && <span className="msr-Sidebar__icon">{item.icon}</span>}
                  {!collapsed && <span className="msr-Sidebar__label">{item.label}</span>}
                  {!collapsed && item.badge != null && <span className="msr-Sidebar__badge">{item.badge}</span>}
                </Tag>
              );
            })}
          </div>
        ))}
      </div>
      {footer && <div className="msr-Sidebar__footer">{footer}</div>}
    </nav>
  );
});
