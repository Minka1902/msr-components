import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey, useLockBodyScroll } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useFocusTrap } from "../../lib/useFocusTrap";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  /** Width (left/right) or height (top/bottom). */
  size?: number | string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Slide-in panel anchored to an edge (focus-trapped, scroll-locked). */
export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  footer,
  size = 360,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
  ariaLabel,
}: DrawerProps) {
  const portal = usePortal("msr-drawer-root");
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useEscapeKey(() => open && onClose());
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  if (!open || !portal) return null;

  const horizontal = side === "left" || side === "right";
  const sizeStyle = horizontal ? { width: size } : { height: size };

  return createPortal(
    <div
      className="msr-Drawer__overlay"
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
        className={cx("msr-Drawer", className)}
        data-side={side}
        style={sizeStyle}
      >
        {(title || showCloseButton) && (
          <div className="msr-Drawer__header">
            {title && <h2 id={titleId} className="msr-Drawer__title">{title}</h2>}
            {showCloseButton && (
              <button type="button" className="msr-Drawer__close" aria-label="Close" onClick={onClose}>
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
        )}
        <div className="msr-Drawer__body">{children}</div>
        {footer && <div className="msr-Drawer__footer">{footer}</div>}
      </div>
    </div>,
    portal,
  );
}
