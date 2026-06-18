import * as React from "react";
import { cx } from "../../lib/cx";

/* ---------------- BentoGrid ---------------- */

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base number of columns. */
  columns?: number;
}

/** Masonry-ish bento grid. Use BentoItem with colSpan/rowSpan for emphasis. */
export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(function BentoGrid(
  { columns = 3, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Bento", className)}
      style={{ ["--bento-cols" as string]: columns, ...style }}
      {...rest}
    />
  );
});

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
}

export const BentoItem = React.forwardRef<HTMLDivElement, BentoItemProps>(function BentoItem(
  { colSpan = 1, rowSpan = 1, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Bento__item", className)}
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, ...style }}
      {...rest}
    />
  );
});

/* ---------------- FlipCard ---------------- */

export interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  front: React.ReactNode;
  back: React.ReactNode;
  /** Flip on hover (default) or controlled via `flipped`. */
  trigger?: "hover" | "click" | "controlled";
  flipped?: boolean;
  axis?: "x" | "y";
  height?: number | string;
}

/** Card that flips to reveal its back face. */
export const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(function FlipCard(
  { front, back, trigger = "hover", flipped, axis = "y", height = 200, className, style, ...rest },
  ref,
) {
  const [clicked, setClicked] = React.useState(false);
  const isFlipped = trigger === "controlled" ? !!flipped : trigger === "click" ? clicked : undefined;

  return (
    <div
      ref={ref}
      className={cx("msr-Flip", className)}
      data-trigger={trigger}
      data-axis={axis}
      data-flipped={isFlipped || undefined}
      style={{ height, ...style }}
      onClick={trigger === "click" ? () => setClicked((c) => !c) : undefined}
      {...rest}
    >
      <div className="msr-Flip__inner">
        <div className="msr-Flip__face msr-Flip__front">{front}</div>
        <div className="msr-Flip__face msr-Flip__back">{back}</div>
      </div>
    </div>
  );
});

/* ---------------- AuroraBackground ---------------- */

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gradient colors for the aurora blobs. */
  colors?: string[];
}

/** Animated aurora/gradient backdrop for hero sections. */
export const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  function AuroraBackground({ colors, className, style, children, ...rest }, ref) {
    const vars = colors
      ? ({ ["--aurora-1" as string]: colors[0], ["--aurora-2" as string]: colors[1] ?? colors[0], ["--aurora-3" as string]: colors[2] ?? colors[0] } as React.CSSProperties)
      : undefined;
    return (
      <div ref={ref} className={cx("msr-Aurora", className)} style={{ ...vars, ...style }} {...rest}>
        <div className="msr-Aurora__layer" aria-hidden="true" />
        <div className="msr-Aurora__content">{children}</div>
      </div>
    );
  },
);
