import * as React from "react";
import { cx } from "../../lib/cx";

type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

interface BaseLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gap between children, mapped to --msr-space-* tokens. */
  gap?: Space;
  as?: React.ElementType;
}

function spaceVar(n: Space | undefined): string | undefined {
  return n === undefined ? undefined : `var(--msr-space-${n})`;
}

/** Vertical flex stack with token-based gap. */
export const Stack = React.forwardRef<HTMLDivElement, BaseLayoutProps & {
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
}>(function Stack({ gap = 4, align, justify, as: As = "div", className, style, ...rest }, ref) {
  return (
    <As
      ref={ref}
      className={cx("msr-Stack", className)}
      style={{ gap: spaceVar(gap), alignItems: align, justifyContent: justify, ...style }}
      {...rest}
    />
  );
});

/** Horizontal flex row with token gap and wrapping control. */
export const Inline = React.forwardRef<HTMLDivElement, BaseLayoutProps & {
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: boolean;
}>(function Inline(
  { gap = 2, align = "center", justify, wrap = true, as: As = "div", className, style, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx("msr-Inline", className)}
      style={{
        gap: spaceVar(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
      {...rest}
    />
  );
});

/** CSS grid with a column count or explicit template + token gap. */
export const Grid = React.forwardRef<HTMLDivElement, BaseLayoutProps & {
  columns?: number | string;
  /** Auto-fit responsive columns with this min track width (px). */
  minColumnWidth?: number;
}>(function Grid({ gap = 4, columns, minColumnWidth, as: As = "div", className, style, ...rest }, ref) {
  const template = minColumnWidth
    ? `repeat(auto-fill, minmax(${minColumnWidth}px, 1fr))`
    : typeof columns === "number"
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;
  return (
    <As
      ref={ref}
      className={cx("msr-Grid", className)}
      style={{ gap: spaceVar(gap), gridTemplateColumns: template, ...style }}
      {...rest}
    />
  );
});

/** Max-width centered content container. */
export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}>(function Container({ size = "lg", className, ...rest }, ref) {
  return <div ref={ref} className={cx("msr-Container", className)} data-size={size} {...rest} />;
});

/** Centers its child both axes. */
export const Center = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Center({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("msr-Center", className)} {...rest} />;
  },
);

/** Maintains a fixed width/height ratio for its child (e.g. media). */
export const AspectRatio = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  ratio?: number;
}>(function AspectRatio({ ratio = 16 / 9, className, style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={cx("msr-AspectRatio", className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...rest}
    />
  );
});

/** Flexible spacer that pushes siblings apart (grows to fill). */
export function Spacer({ size }: { size?: Space }) {
  return <div className="msr-Spacer" style={{ flexBasis: size !== undefined ? spaceVar(size) : undefined }} aria-hidden="true" />;
}
