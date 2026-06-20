import * as React from "react";
import { cx } from "../../lib/cx";

export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: "primary" | "neutral";
  rippleColor?: string;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/** Button that emits a Material-style ripple from the click point. */
export const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(function RippleButton(
  { tone = "primary", rippleColor, className, children, onPointerDown, style, ...rest },
  ref,
) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const idRef = React.useRef(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const ripple: Ripple = {
      id: idRef.current++,
      x: e.clientX - r.left - size / 2,
      y: e.clientY - r.top - size / 2,
      size,
    };
    setRipples((prev) => [...prev, ripple]);
    window.setTimeout(() => setRipples((prev) => prev.filter((p) => p.id !== ripple.id)), 600);
    onPointerDown?.(e);
  };

  return (
    <button
      ref={ref}
      className={cx("msr-RippleButton", className)}
      data-tone={tone}
      style={{ ...(rippleColor ? { ["--msr-ripple" as string]: rippleColor } : null), ...style }}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      <span className="msr-RippleButton__label">{children}</span>
      {ripples.map((rp) => (
        <span
          key={rp.id}
          className="msr-RippleButton__ripple"
          style={{ left: rp.x, top: rp.y, width: rp.size, height: rp.size }}
        />
      ))}
    </button>
  );
});
