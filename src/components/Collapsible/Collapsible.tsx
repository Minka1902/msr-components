import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger element; clicking it toggles. Omit to control externally. */
  trigger?: React.ReactNode;
}

/** Animated show/hide region (height transition), controllable. */
export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible({ open, defaultOpen = false, onOpenChange, trigger, className, children, ...rest }, ref) {
    const [isOpen, setOpen] = useControllableState<boolean>({
      value: open,
      defaultValue: defaultOpen,
      onChange: onOpenChange,
    });
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState<number | undefined>(defaultOpen ? undefined : 0);

    React.useLayoutEffect(() => {
      const el = contentRef.current;
      if (!el) return;
      if (isOpen) {
        setHeight(el.scrollHeight);
        const t = setTimeout(() => setHeight(undefined), 200);
        return () => clearTimeout(t);
      } else {
        setHeight(el.scrollHeight);
        requestAnimationFrame(() => setHeight(0));
      }
    }, [isOpen]);

    return (
      <div ref={ref} className={cx("msr-Collapsible", className)} data-open={isOpen || undefined} {...rest}>
        {trigger && (
          <div className="msr-Collapsible__trigger" onClick={() => setOpen(!isOpen)}>
            {trigger}
          </div>
        )}
        <div
          className="msr-Collapsible__region"
          style={{ height: height === undefined ? undefined : `${height}px` }}
          aria-hidden={!isOpen}
        >
          <div ref={contentRef} className="msr-Collapsible__content">
            {children}
          </div>
        </div>
      </div>
    );
  },
);
