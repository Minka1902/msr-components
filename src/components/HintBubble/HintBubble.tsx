import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import type { Placement } from "../../lib/usePosition";

export interface HintBubbleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "content"> {
  /** The element the hint points at. */
  children: React.ReactNode;
  /** Hint body. */
  content: React.ReactNode;
  title?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  tone?: "primary" | "neutral";
  dismissible?: boolean;
}

/** A small pointer callout anchored to an inline element (CSS-positioned). */
export const HintBubble = React.forwardRef<HTMLDivElement, HintBubbleProps>(function HintBubble(
  {
    children,
    content,
    title,
    open,
    defaultOpen = true,
    onOpenChange,
    placement = "bottom",
    tone = "primary",
    dismissible = true,
    className,
    ...rest
  },
  ref,
) {
  const controlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = controlled ? open : internal;

  const close = () => {
    if (!controlled) setInternal(false);
    onOpenChange?.(false);
  };

  return (
    <div ref={ref} className={cx("msr-HintBubble", className)} data-tone={tone} {...rest}>
      <div className="msr-HintBubble__anchor">{children}</div>
      {isOpen && (
        <div className="msr-HintBubble__bubble" role="note" data-placement={placement}>
          <span className="msr-HintBubble__arrow" aria-hidden="true" />
          {dismissible && (
            <button type="button" className="msr-HintBubble__close" aria-label="Dismiss hint" onClick={close}>
              <Icon name="close" size={12} />
            </button>
          )}
          {title && <div className="msr-HintBubble__title">{title}</div>}
          <div className="msr-HintBubble__content">{content}</div>
        </div>
      )}
    </div>
  );
});
