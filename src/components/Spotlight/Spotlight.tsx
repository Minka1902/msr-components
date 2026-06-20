import * as React from "react";
import { cx } from "../../lib/cx";
import { useMousePosition } from "../../lib/useMousePosition";

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Radius of the light, px. */
  size?: number;
  /** Spotlight color. */
  color?: string;
  /** Keep a dim base layer visible outside the light. */
  dim?: number;
}

/** A section that reveals a radial "spotlight" following the cursor. */
export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(function Spotlight(
  { children, size = 320, color = "color-mix(in srgb, var(--msr-color-primary) 22%, transparent)", dim = 0, className, style, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const pos = useMousePosition(innerRef);

  const setRefs = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  const background = pos.isInside
    ? `radial-gradient(${size}px circle at ${pos.elementX}px ${pos.elementY}px, ${color}, transparent 70%)`
    : "transparent";

  return (
    <div ref={setRefs} className={cx("msr-Spotlight", className)} style={style} {...rest}>
      <div
        className="msr-Spotlight__light"
        data-active={pos.isInside || undefined}
        style={{ background, opacity: pos.isInside ? 1 : dim }}
        aria-hidden="true"
      />
      <div className="msr-Spotlight__content">{children}</div>
    </div>
  );
});
