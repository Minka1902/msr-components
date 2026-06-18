import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal } from "msr-hooks";
import { cx } from "../../lib/cx";
import { usePosition, type Placement } from "../../lib/usePosition";

export interface PopoverHelpProps {
  /** The trigger element (wrapped in an inline anchor). */
  children: React.ReactNode;
  /** Tooltip/popover content. */
  content: React.ReactNode;
  placement?: Placement;
  /** Delay before showing, in ms. */
  delay?: number;
  /** Larger padded "help popover" styling vs. compact tooltip. */
  variant?: "tooltip" | "help";
  className?: string;
}

/** Accessible hover/focus tooltip rendered in a portal with auto-flipping. */
export function PopoverHelp({
  children,
  content,
  placement = "top",
  delay = 120,
  variant = "tooltip",
  className,
}: PopoverHelpProps) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const floatingRef = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const id = React.useId();
  const portal = usePortal("msr-portal-root");

  const pos = usePosition({
    anchor: anchorRef,
    floating: floatingRef,
    placement,
    open,
  });

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <span
        ref={anchorRef}
        className="msr-PopoverHelp__anchor"
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === "Escape") hide();
        }}
      >
        {children}
      </span>
      {open &&
        portal &&
        createPortal(
          <div
            ref={floatingRef}
            id={id}
            role="tooltip"
            className={cx("msr-PopoverHelp", className)}
            data-variant={variant}
            data-placement={pos.placement}
            style={{ position: "fixed", left: pos.x, top: pos.y }}
          >
            {content}
          </div>,
          portal,
        )}
    </>
  );
}
