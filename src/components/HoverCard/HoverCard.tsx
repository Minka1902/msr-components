import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal } from "msr-hooks";
import { cx } from "../../lib/cx";
import { usePosition, type Placement } from "../../lib/usePosition";

export interface HoverCardProps {
  /** The hover target. */
  trigger: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

/** Rich content card shown on hover/focus (e.g. user/preview cards). */
export function HoverCard({
  trigger,
  children,
  placement = "bottom",
  openDelay = 200,
  closeDelay = 120,
  className,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const portal = usePortal("msr-portal-root");
  const pos = usePosition({ anchor: anchorRef, floating: cardRef, placement, open });

  const show = () => {
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
        className="msr-HoverCard__anchor"
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {trigger}
      </span>
      {open &&
        portal &&
        createPortal(
          <div
            ref={cardRef}
            className={cx("msr-HoverCard", className)}
            role="dialog"
            style={{ position: "fixed", left: pos.x, top: pos.y }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {children}
          </div>,
          portal,
        )}
    </>
  );
}
