import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal } from "msr-hooks";
import { cx } from "../../lib/cx";
import { usePosition, type Placement } from "../../lib/usePosition";

export interface TooltipProps {
  /** Tooltip body. */
  content: React.ReactNode;
  /** The element the tooltip describes (wrapped in a focusable span). */
  children: React.ReactNode;
  placement?: Placement;
  openDelay?: number;
  closeDelay?: number;
  /** Disable showing (e.g. on touch). */
  disabled?: boolean;
  /** Max width of the bubble, px. */
  maxWidth?: number;
  className?: string;
}

/** Lightweight hover/focus tooltip (portal + anchored positioning). */
export function Tooltip({
  content,
  children,
  placement = "top",
  openDelay = 150,
  closeDelay = 80,
  disabled = false,
  maxWidth = 240,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const portal = usePortal("msr-portal-root");
  const id = React.useId();
  const pos = usePosition({ anchor: anchorRef, floating: tipRef, placement, open });

  const show = () => {
    if (disabled) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <span
        ref={anchorRef}
        className="msr-Tooltip__anchor"
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {open &&
        content != null &&
        portal &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            className={cx("msr-Tooltip", className)}
            data-placement={pos.placement}
            style={{ position: "fixed", left: pos.x, top: pos.y, maxWidth }}
          >
            {content}
            <span className="msr-Tooltip__arrow" />
          </div>,
          portal,
        )}
    </>
  );
}
