import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { usePosition, type Placement } from "../../lib/usePosition";

export interface PopconfirmProps {
  /** Trigger element (wrapped in a focusable span). */
  children: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Tone of the confirm button. */
  tone?: "danger" | "primary";
  placement?: Placement;
  className?: string;
}

/** Inline confirmation popover anchored to its trigger (lighter than a modal). */
export function Popconfirm({
  children,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  tone = "danger",
  placement = "top",
  className,
}: PopconfirmProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);
  const portal = usePortal("msr-portal-root");
  const pos = usePosition({ anchor: anchorRef, floating: popRef, placement, open });

  useEscapeKey(() => open && setOpen(false));

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !popRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const confirm = () => {
    onConfirm?.();
    setOpen(false);
  };
  const cancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <>
      <span
        ref={anchorRef}
        className="msr-Popconfirm__anchor"
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </span>
      {open &&
        portal &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label={typeof title === "string" ? title : "Confirm"}
            className={cx("msr-Popconfirm", className)}
            data-placement={pos.placement}
            style={{ position: "fixed", left: pos.x, top: pos.y }}
          >
            <div className="msr-Popconfirm__body">
              <span className="msr-Popconfirm__icon" data-tone={tone} aria-hidden="true">
                <Icon name={tone === "danger" ? "warning" : "infoCircle"} size={18} />
              </span>
              <div className="msr-Popconfirm__text">
                <div className="msr-Popconfirm__title">{title}</div>
                {description && <div className="msr-Popconfirm__desc">{description}</div>}
              </div>
            </div>
            <div className="msr-Popconfirm__actions">
              <button type="button" className="msr-Popconfirm__btn" onClick={cancel}>
                {cancelLabel}
              </button>
              <button type="button" className="msr-Popconfirm__btn" data-tone={tone} onClick={confirm}>
                {confirmLabel}
              </button>
            </div>
            <span className="msr-Popconfirm__arrow" />
          </div>,
          portal,
        )}
    </>
  );
}
