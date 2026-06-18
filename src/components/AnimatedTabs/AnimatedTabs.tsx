import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type TabsSize = "sm" | "md" | "lg";

export interface AnimatedTabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabsSize;
  /** Optional map of panels rendered below the tablist for the active tab. */
  panels?: Record<string, React.ReactNode>;
  /** Visual style of the active indicator. */
  indicator?: "underline" | "pill";
}

/** Tabs with an animated active indicator and full keyboard support. */
export const AnimatedTabs = React.forwardRef<HTMLDivElement, AnimatedTabsProps>(
  function AnimatedTabs(
    {
      items,
      value,
      defaultValue,
      onValueChange,
      size = "md",
      panels,
      indicator = "underline",
      className,
      ...rest
    },
    ref,
  ) {
    const [active, setActive] = useControllableState<string>({
      value,
      defaultValue: defaultValue ?? items[0]?.value ?? "",
      onChange: onValueChange,
    });

    const listRef = React.useRef<HTMLDivElement>(null);
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});

    const activeIndex = items.findIndex((it) => it.value === active);

    React.useLayoutEffect(() => {
      const list = listRef.current;
      if (!list) return;
      const tab = list.querySelector<HTMLElement>(`[data-value="${CSS.escape(active)}"]`);
      if (!tab) return;
      setIndicatorStyle({
        left: tab.offsetLeft,
        top: tab.offsetTop,
        width: tab.offsetWidth,
        height: tab.offsetHeight,
      });
    }, [active, items, size]);

    const focusTab = (index: number) => {
      const list = listRef.current;
      if (!list) return;
      const tabs = list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])');
      tabs[index]?.focus();
    };

    const enabledIndexes = items
      .map((it, i) => (it.disabled ? -1 : i))
      .filter((i) => i >= 0);

    const onKeyDown = (event: React.KeyboardEvent) => {
      const pos = enabledIndexes.indexOf(activeIndex);
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        const nextIdx = enabledIndexes[(pos + 1) % enabledIndexes.length];
        setActive(items[nextIdx].value);
        focusTab(nextIdx === -1 ? 0 : enabledIndexes.indexOf(nextIdx));
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        const prevIdx =
          enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length];
        setActive(items[prevIdx].value);
        focusTab(enabledIndexes.indexOf(prevIdx));
      } else if (event.key === "Home") {
        event.preventDefault();
        setActive(items[enabledIndexes[0]].value);
      } else if (event.key === "End") {
        event.preventDefault();
        setActive(items[enabledIndexes[enabledIndexes.length - 1]].value);
      }
    };

    return (
      <div ref={ref} className={cx("msr-Tabs", className)} data-size={size} {...rest}>
        <div
          ref={listRef}
          role="tablist"
          className="msr-Tabs__list"
          data-indicator={indicator}
          onKeyDown={onKeyDown}
        >
          <span className="msr-Tabs__indicator" style={indicatorStyle} aria-hidden="true" />
          {items.map((item) => {
            const selected = item.value === active;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                data-value={item.value}
                data-selected={selected || undefined}
                className="msr-Tabs__tab"
                onClick={() => setActive(item.value)}
              >
                {item.icon && <span className="msr-Tabs__icon">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
        {panels && (
          <div role="tabpanel" className="msr-Tabs__panel">
            {panels[active]}
          </div>
        )}
      </div>
    );
  },
);
