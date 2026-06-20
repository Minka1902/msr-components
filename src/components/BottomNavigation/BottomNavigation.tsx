import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface BottomNavItem {
  id: string;
  label: React.ReactNode;
  icon?: IconName;
  /** Numeric badge on the item. */
  badge?: number;
}

export interface BottomNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  items: BottomNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  /** Hide labels, showing icons only. */
  iconsOnly?: boolean;
}

/** Mobile-style bottom tab bar with icons, labels and badges. */
export const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(function BottomNavigation(
  { items, value, defaultValue, onChange, iconsOnly = false, className, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.id);
  const active = controlled ? value : internal;

  const select = (id: string) => {
    if (!controlled) setInternal(id);
    onChange?.(id);
  };

  return (
    <nav ref={ref} className={cx("msr-BottomNavigation", className)} data-icons-only={iconsOnly || undefined} {...rest}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="msr-BottomNavigation__item"
          data-active={item.id === active || undefined}
          aria-current={item.id === active ? "page" : undefined}
          onClick={() => select(item.id)}
        >
          <span className="msr-BottomNavigation__iconWrap">
            {item.icon && <Icon name={item.icon} size={22} />}
            {item.badge != null && item.badge > 0 && (
              <span className="msr-BottomNavigation__badge">{item.badge > 99 ? "99+" : item.badge}</span>
            )}
          </span>
          {!iconsOnly && <span className="msr-BottomNavigation__label">{item.label}</span>}
        </button>
      ))}
    </nav>
  );
});
