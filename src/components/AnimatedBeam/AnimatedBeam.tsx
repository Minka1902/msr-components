import * as React from "react";
import { cx } from "../../lib/cx";

export interface AnimatedBeamProps extends React.HTMLAttributes<SVGSVGElement> {
  /** The positioned (relative) element both endpoints live inside. */
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  /** Perpendicular bow of the curve, px (can be negative). */
  curvature?: number;
  /** Sweep duration, seconds. */
  duration?: number;
  /** Reverse the sweep direction. */
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  beamColor?: string;
}

/** Animated SVG connector that sweeps a beam between two element refs. */
export const AnimatedBeam = React.forwardRef<SVGSVGElement, AnimatedBeamProps>(function AnimatedBeam(
  {
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    duration = 3,
    reverse = false,
    pathColor = "var(--msr-color-border-strong)",
    pathWidth = 2,
    beamColor = "var(--msr-color-primary)",
    className,
    ...rest
  },
  ref,
) {
  const id = React.useId().replace(/:/g, "");
  const [box, setBox] = React.useState({ w: 0, h: 0, d: "" });

  React.useLayoutEffect(() => {
    const compute = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;
      const cr = container.getBoundingClientRect();
      const fr = from.getBoundingClientRect();
      const tr = to.getBoundingClientRect();
      const sx = fr.left - cr.left + fr.width / 2;
      const sy = fr.top - cr.top + fr.height / 2;
      const ex = tr.left - cr.left + tr.width / 2;
      const ey = tr.top - cr.top + tr.height / 2;
      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2 - curvature;
      setBox({ w: cr.width, h: cr.height, d: `M ${sx},${sy} Q ${mx},${my} ${ex},${ey}` });
    };
    compute();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(compute) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg
      ref={ref}
      className={cx("msr-AnimatedBeam", className)}
      width={box.w}
      height={box.h}
      viewBox={`0 0 ${box.w} ${box.h}`}
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <path d={box.d} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={0.4} strokeLinecap="round" />
      <path d={box.d} stroke={`url(#${id})`} strokeWidth={pathWidth + 0.5} strokeLinecap="round" />
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={box.w || 1} y2="0">
          <stop offset="0" stopColor={beamColor} stopOpacity="0" />
          <stop offset="0.45" stopColor={beamColor} stopOpacity="0" />
          <stop offset="0.5" stopColor={beamColor} stopOpacity="1" />
          <stop offset="0.55" stopColor={beamColor} stopOpacity="0" />
          <stop offset="1" stopColor={beamColor} stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            from={`${reverse ? box.w : -box.w} 0`}
            to={`${reverse ? -box.w : box.w} 0`}
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </svg>
  );
});
