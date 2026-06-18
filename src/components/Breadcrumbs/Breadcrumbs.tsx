import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Separator between crumbs. */
  separator?: React.ReactNode;
  /** Collapse the middle when more than this many items. */
  maxItems?: number;
}

/** Breadcrumb navigation with optional middle collapsing. */
export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  function Breadcrumbs({ items, separator, maxItems = 0, className, ...rest }, ref) {
    const sep = separator ?? <Icon name="chevronRight" size={14} />;
    const display: Array<BreadcrumbItem | null> =
      maxItems > 0 && items.length > maxItems
        ? [items[0], null, ...items.slice(items.length - (maxItems - 1))]
        : items;

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cx("msr-Breadcrumbs", className)} {...rest}>
        <ol className="msr-Breadcrumbs__list">
          {display.map((item, i) => {
            const last = i === display.length - 1;
            return (
              <li key={i} className="msr-Breadcrumbs__item">
                {item === null ? (
                  <span className="msr-Breadcrumbs__ellipsis">…</span>
                ) : item.href || item.onClick ? (
                  <a
                    className="msr-Breadcrumbs__link"
                    href={item.href}
                    aria-current={last ? "page" : undefined}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                  >
                    {item.icon && <span className="msr-Breadcrumbs__icon">{item.icon}</span>}
                    {item.label}
                  </a>
                ) : (
                  <span className="msr-Breadcrumbs__current" aria-current={last ? "page" : undefined}>
                    {item.icon && <span className="msr-Breadcrumbs__icon">{item.icon}</span>}
                    {item.label}
                  </span>
                )}
                {!last && <span className="msr-Breadcrumbs__sep" aria-hidden="true">{sep}</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);
