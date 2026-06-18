import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey, useClickOutsideObject } from "msr-hooks";
import { cx } from "../../lib/cx";
import { usePosition, type Placement } from "../../lib/usePosition";

export interface PopoverProps {
  /** Clickable trigger; wrapped in an inline anchor. */
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** Gap between trigger and panel, px. */
  offset?: number;
  className?: string;
  /** Render the panel without the default surface styling. */
  unstyled?: boolean;
}

/** Click-triggered floating panel: portal + auto-flip positioning + dismiss. */
export function Popover({
  trigger,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  offset = 8,
  className,
  unstyled = false,
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = controlledOpen ?? uncontrolled;
  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  const anchorRef = React.useRef<HTMLSpanElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const portal = usePortal("msr-portal-root");
  const id = React.useId();

  const pos = usePosition({ anchor: anchorRef, floating: panelRef, placement, offset, open });

  useEscapeKey(() => open && setOpen(false));
  useClickOutsideObject(panelRef, () => open && setOpen(false), undefined, anchorRef);

  return (
    <>
      <span
        ref={anchorRef}
        className="msr-Popover__anchor"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </span>
      {open &&
        portal &&
        createPortal(
          <div
            ref={panelRef}
            id={id}
            role="dialog"
            className={cx("msr-Popover", !unstyled && "msr-Popover--surface", className)}
            data-placement={pos.placement}
            style={{ position: "fixed", left: pos.x, top: pos.y }}
          >
            {children}
          </div>,
          portal,
        )}
    </>
  );
}
