import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey } from "msr-hooks";
import { cx } from "../../lib/cx";

export interface ContextMenuItem {
  /** Unique key/id. */
  id: string;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  danger?: boolean;
  /** Render a separator instead of an item. */
  separator?: boolean;
  /** Optional trailing shortcut hint, e.g. "⌘C". */
  shortcut?: string;
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}

/** Wraps content and opens a custom menu at the cursor on right-click. */
export function ContextMenu({ items, children, className }: ContextMenuProps) {
  const [state, setState] = React.useState<{ x: number; y: number } | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const portal = usePortal("msr-portal-root");

  useEscapeKey(() => setState(null));

  React.useEffect(() => {
    if (!state) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setState(null);
    };
    const onScroll = () => setState(null);
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [state]);

  // Keep the menu inside the viewport.
  React.useLayoutEffect(() => {
    if (!state || !menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let { x, y } = state;
    if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 8;
    if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 8;
    if (x !== state.x || y !== state.y) setState({ x, y });
  }, [state]);

  return (
    <>
      <div
        className={cx("msr-ContextMenu__trigger", className)}
        onContextMenu={(e) => {
          e.preventDefault();
          setState({ x: e.clientX, y: e.clientY });
        }}
      >
        {children}
      </div>
      {state &&
        portal &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="msr-ContextMenu"
            style={{ position: "fixed", left: state.x, top: state.y }}
          >
            {items.map((item) =>
              item.separator ? (
                <div key={item.id} className="msr-ContextMenu__separator" role="separator" />
              ) : (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className="msr-ContextMenu__item"
                  data-danger={item.danger || undefined}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    setState(null);
                  }}
                >
                  {item.icon && <span className="msr-ContextMenu__icon">{item.icon}</span>}
                  <span className="msr-ContextMenu__label">{item.label}</span>
                  {item.shortcut && (
                    <span className="msr-ContextMenu__shortcut">{item.shortcut}</span>
                  )}
                </button>
              ),
            )}
          </div>,
          portal,
        )}
    </>
  );
}
