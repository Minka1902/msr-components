import * as React from "react";
import { cx } from "../../lib/cx";
import { useMousePosition } from "../../lib/useMousePosition";

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pull factor toward the cursor (0–1). */
  strength?: number;
  /** Max pixels the element can travel. */
  maxOffset?: number;
  /** Also shift the inner content slightly further for parallax. */
  contentStrength?: number;
}

/** A button that's magnetically drawn toward the cursor and springs back. */
export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    { strength = 0.4, maxOffset = 18, contentStrength = 0.25, className, style, children, ...rest },
    forwardedRef,
  ) {
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const setRefs = (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };
    const pos = useMousePosition(innerRef);

    const clamp = (n: number) => Math.max(-maxOffset, Math.min(maxOffset, n));
    const tx = pos.isInside ? clamp(pos.centerX * strength) : 0;
    const ty = pos.isInside ? clamp(pos.centerY * strength) : 0;

    return (
      <button
        ref={setRefs}
        className={cx("msr-MagneticButton", className)}
        data-active={pos.isInside || undefined}
        style={{ transform: `translate(${tx}px, ${ty}px)`, ...style }}
        {...rest}
      >
        <span
          className="msr-MagneticButton__content"
          style={{ transform: `translate(${tx * contentStrength}px, ${ty * contentStrength}px)` }}
        >
          {children}
        </span>
      </button>
    );
  },
);
