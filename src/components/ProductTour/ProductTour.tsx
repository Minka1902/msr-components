import * as React from "react";
import { createPortal } from "react-dom";
import { usePortal, useEscapeKey } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import type { Placement } from "../../lib/usePosition";

export interface TourStep {
  /** CSS selector for the element to spotlight. */
  target: string;
  title?: React.ReactNode;
  content: React.ReactNode;
  placement?: Placement;
}

export interface ProductTourProps {
  steps: TourStep[];
  open: boolean;
  /** Controlled current step. */
  stepIndex?: number;
  defaultStepIndex?: number;
  onStepChange?: (index: number) => void;
  onClose?: () => void;
  onFinish?: () => void;
  /** Padding around the spotlight, in px. */
  spotlightPadding?: number;
  className?: string;
}

interface Rect { top: number; left: number; width: number; height: number; }

/** Guided product tour: dims the page and spotlights each target with a popover. */
export function ProductTour({
  steps,
  open,
  stepIndex,
  defaultStepIndex = 0,
  onStepChange,
  onClose,
  onFinish,
  spotlightPadding = 6,
  className,
}: ProductTourProps) {
  const portal = usePortal("msr-tour-root");
  const controlled = stepIndex !== undefined;
  const [internal, setInternal] = React.useState(defaultStepIndex);
  const index = controlled ? (stepIndex as number) : internal;
  const [rect, setRect] = React.useState<Rect | null>(null);
  const popRef = React.useRef<HTMLDivElement>(null);

  const step = steps[index];

  useEscapeKey(() => {
    if (open) onClose?.();
  });

  const goTo = React.useCallback(
    (next: number) => {
      if (!controlled) setInternal(next);
      onStepChange?.(next);
    },
    [controlled, onStepChange],
  );

  // Measure the current target.
  React.useLayoutEffect(() => {
    if (!open || !step) return;
    const measure = () => {
      const el = document.querySelector(step.target);
      if (!el) {
        setRect(null);
        return;
      }
      (el as HTMLElement).scrollIntoView?.({ block: "center", behavior: "smooth" });
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step, index]);

  if (!open || !portal || !step) return null;

  const isLast = index === steps.length - 1;
  const isFirst = index === 0;
  const pad = spotlightPadding;

  // Spotlight box (falls back to centered if the target is missing).
  const spot: Rect = rect
    ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : { top: window.innerHeight / 2 - 40, left: window.innerWidth / 2 - 160, width: 320, height: 80 };

  // Popover placement relative to the spotlight.
  const place: Placement = step.placement ?? "bottom";
  const popStyle: React.CSSProperties = {};
  const gap = 12;
  if (place === "bottom") {
    popStyle.top = spot.top + spot.height + gap;
    popStyle.left = spot.left;
  } else if (place === "top") {
    popStyle.bottom = window.innerHeight - spot.top + gap;
    popStyle.left = spot.left;
  } else if (place === "right") {
    popStyle.top = spot.top;
    popStyle.left = spot.left + spot.width + gap;
  } else {
    popStyle.top = spot.top;
    popStyle.right = window.innerWidth - spot.left + gap;
  }

  return createPortal(
    <div className={cx("msr-ProductTour", className)} role="dialog" aria-modal="true" aria-label="Product tour">
      <div
        className="msr-ProductTour__spotlight"
        style={{ top: spot.top, left: spot.left, width: spot.width, height: spot.height }}
      />
      <div ref={popRef} className="msr-ProductTour__popover" style={popStyle} data-placement={place}>
        <button type="button" className="msr-ProductTour__close" aria-label="End tour" onClick={() => onClose?.()}>
          <Icon name="close" size={16} />
        </button>
        {step.title && <div className="msr-ProductTour__title">{step.title}</div>}
        <div className="msr-ProductTour__content">{step.content}</div>
        <div className="msr-ProductTour__footer">
          <span className="msr-ProductTour__count">{index + 1} / {steps.length}</span>
          <div className="msr-ProductTour__actions">
            {!isFirst && (
              <button type="button" className="msr-ProductTour__btn" onClick={() => goTo(index - 1)}>
                Back
              </button>
            )}
            <button
              type="button"
              className="msr-ProductTour__btn"
              data-primary
              onClick={() => {
                if (isLast) onFinish?.();
                else goTo(index + 1);
              }}
            >
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    portal,
  );
}
