import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey, useLockBodyScroll } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useFocusTrap } from "../../lib/useFocusTrap";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  /** Clicking the backdrop closes the modal (default true). */
  closeOnOverlayClick?: boolean;
  /** Show the header close button (default true). */
  showCloseButton?: boolean;
  className?: string;
  /** Accessible label when no visible `title` is provided. */
  ariaLabel?: string;
}

/** Accessible modal dialog: portal, focus trap, Escape & scroll-lock. */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
  ariaLabel,
}: ModalProps) {
  const portal = usePortal("msr-modal-root");
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  useEscapeKey(() => {
    if (open) onClose();
  });
  useLockBodyScroll(open);
  useFocusTrap(dialogRef, open);

  if (!open || !portal) return null;

  return createPortal(
    <div
      className="msr-Modal__overlay"
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
        className={cx("msr-Modal", className)}
        data-size={size}
      >
        {(title || showCloseButton) && (
          <div className="msr-Modal__header">
            {title && (
              <h2 id={titleId} className="msr-Modal__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="msr-Modal__close"
                aria-label="Close"
                onClick={onClose}
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
        )}
        <div className="msr-Modal__body">{children}</div>
        {footer && <div className="msr-Modal__footer">{footer}</div>}
      </div>
    </div>,
    portal,
  );
}
