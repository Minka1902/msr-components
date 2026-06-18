import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey, useClickOutsideObject } from "msr-hooks";
import { cx } from "../../lib/cx";
import { usePosition, type Placement } from "../../lib/usePosition";
import type { ContextMenuItem } from "../ContextMenu/ContextMenu";

export type MenuItem = ContextMenuItem;

export interface MenuProps {
  /** Trigger element (e.g. a Button). Cloned to wire open/aria. */
  trigger: React.ReactElement;
  items: MenuItem[];
  placement?: Placement;
  className?: string;
}

/** Dropdown menu anchored to a trigger, with roving keyboard navigation. */
export function Menu({ trigger, items, placement = "bottom", className }: MenuProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const triggerRef = React.useRef<HTMLElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const portal = usePortal("msr-portal-root");
  const id = React.useId();

  const pos = usePosition({ anchor: triggerRef, floating: menuRef, placement, open });

  useEscapeKey(() => {
    if (open) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  });
  useClickOutsideObject(menuRef, () => setOpen(false), undefined, triggerRef);

  const selectable = items.filter((i) => !i.separator && !i.disabled);

  React.useEffect(() => {
    if (open) setActiveIndex(0);
  }, [open]);

  React.useEffect(() => {
    if (!open || !menuRef.current) return;
    const buttons = menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])');
    buttons[activeIndex]?.focus();
  }, [open, activeIndex]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % selectable.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + selectable.length) % selectable.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(selectable.length - 1);
    }
  };

  const triggerEl = React.cloneElement(
    trigger as React.ReactElement<Record<string, unknown>>,
    {
      ref: triggerRef,
      "aria-haspopup": "menu",
      "aria-expanded": open,
      onClick: (e: React.MouseEvent) => {
        (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
        setOpen((o) => !o);
      },
    },
  );

  let selectableIndex = -1;

  return (
    <>
      {triggerEl}
      {open &&
        portal &&
        createPortal(
          <div
            ref={menuRef}
            id={id}
            role="menu"
            className={cx("msr-Menu", className)}
            style={{ position: "fixed", left: pos.x, top: pos.y }}
            onKeyDown={onKeyDown}
          >
            {items.map((item) => {
              if (item.separator) {
                return <div key={item.id} className="msr-Menu__separator" role="separator" />;
              }
              if (!item.disabled) selectableIndex++;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className="msr-Menu__item"
                  data-danger={item.danger || undefined}
                  disabled={item.disabled}
                  tabIndex={-1}
                  onClick={() => {
                    item.onSelect?.();
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  {item.icon && <span className="msr-Menu__icon">{item.icon}</span>}
                  <span className="msr-Menu__label">{item.label}</span>
                  {item.shortcut && <span className="msr-Menu__shortcut">{item.shortcut}</span>}
                </button>
              );
            })}
          </div>,
          portal,
        )}
    </>
  );
}
