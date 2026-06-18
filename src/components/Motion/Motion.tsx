import * as React from "react";
import { useElementScrollProgress, useIntersectionObserver } from "msr-hooks";
import { cx } from "../../lib/cx";

/* ---------------- ScrollProgressBar ---------------- */

export interface ScrollProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Element whose scroll progress to track; defaults to the whole page. */
  target?: React.RefObject<HTMLElement>;
  /** Bar position. */
  position?: "top" | "bottom";
  height?: number;
}

/** Thin reading-progress bar driven by scroll position. */
export const ScrollProgressBar = React.forwardRef<HTMLDivElement, ScrollProgressBarProps>(
  function ScrollProgressBar({ target, position = "top", height = 3, className, style, ...rest }, ref) {
    const [docRef, setDocRef] = React.useState<React.RefObject<HTMLElement>>(
      target ?? { current: null },
    );

    React.useEffect(() => {
      if (!target) {
        // Track the document scrolling element for page-level progress.
        setDocRef({ current: document.documentElement });
      } else {
        setDocRef(target);
      }
    }, [target]);

    const progress = useElementScrollProgress(docRef);

    return (
      <div
        ref={ref}
        className={cx("msr-ScrollProgress", className)}
        data-position={position}
        style={{ height, ...style }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
      >
        <span className="msr-ScrollProgress__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
    );
  },
);

/* ---------------- ScrollReveal ---------------- */

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Animation style. */
  animation?: "fade" | "slide-up" | "slide-left" | "zoom";
  /** Delay in ms before animating once in view. */
  delay?: number;
  /** Re-trigger every time it enters the viewport. */
  once?: boolean;
}

/** Reveals its children with an animation when scrolled into view. */
export const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  function ScrollReveal({ animation = "fade", delay = 0, once = true, className, style, children, ...rest }, ref) {
    const [observerRef, inView] = useIntersectionObserver({ threshold: 0.15 });
    const [revealed, setRevealed] = React.useState(false);

    React.useEffect(() => {
      if (inView) setRevealed(true);
      else if (!once) setRevealed(false);
    }, [inView, once]);

    return (
      <div
        ref={(node) => {
          (observerRef as React.MutableRefObject<HTMLElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx("msr-ScrollReveal", className)}
        data-animation={animation}
        data-visible={revealed || undefined}
        style={{ transitionDelay: `${delay}ms`, ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
