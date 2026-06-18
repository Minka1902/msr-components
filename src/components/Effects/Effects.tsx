import * as React from "react";
import { cx } from "../../lib/cx";

/* ---------------- TiltCard ---------------- */

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max tilt in degrees. */
  max?: number;
  /** Lift (scale) on hover. */
  scale?: number;
}

/** Card that tilts in 3D toward the pointer. */
export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(function TiltCard(
  { max = 10, scale = 1.02, className, style, children, onMouseMove, onMouseLeave, ...rest },
  ref,
) {
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-py * max).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(px * max).toFixed(2)}deg`);
      el.style.setProperty("--tilt-scale", String(scale));
    }
    onMouseMove?.(e);
  };
  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (el) {
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--tilt-scale", "1");
    }
    onMouseLeave?.(e);
  };

  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cx("msr-TiltCard", className)}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {children}
    </div>
  );
});

/* ---------------- SpotlightCard ---------------- */

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spotlight radius in px. */
  size?: number;
}

/** Card with a soft glow that follows the pointer. */
export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  function SpotlightCard({ size = 200, className, style, onMouseMove, children, ...rest }, ref) {
    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
      onMouseMove?.(e);
    };
    return (
      <div
        ref={ref}
        className={cx("msr-Spotlight", className)}
        style={{ ["--spot-size" as string]: `${size}px`, ...style }}
        onMouseMove={handleMove}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/* ---------------- Marquee ---------------- */

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds for one full loop. */
  duration?: number;
  direction?: "left" | "right";
  /** Pause when hovered. */
  pauseOnHover?: boolean;
}

/** Seamless horizontally scrolling content. */
export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(function Marquee(
  { duration = 20, direction = "left", pauseOnHover = true, className, style, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Marquee", className)}
      data-direction={direction}
      data-pause={pauseOnHover || undefined}
      style={{ ["--marquee-duration" as string]: `${duration}s`, ...style }}
      {...rest}
    >
      <div className="msr-Marquee__track">
        <div className="msr-Marquee__group">{children}</div>
        <div className="msr-Marquee__group" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
});

/* ---------------- ShimmerText ---------------- */

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  duration?: number;
}

/** Text with an animated metallic shimmer sweep. */
export const ShimmerText = React.forwardRef<HTMLSpanElement, ShimmerTextProps>(
  function ShimmerText({ duration = 2.5, className, style, ...rest }, ref) {
    return (
      <span
        ref={ref}
        className={cx("msr-Shimmer", className)}
        style={{ ["--shimmer-duration" as string]: `${duration}s`, ...style }}
        {...rest}
      />
    );
  },
);
