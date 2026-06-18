import * as React from "react";
import { cx } from "../../lib/cx";

export type SkeletonShape = "line" | "circle" | "rect";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  width?: number | string;
  height?: number | string;
  /** Disable the shimmer animation. */
  static?: boolean;
}

/** Single skeleton primitive. Compose with the presets below for layouts. */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { shape = "line", width, height, static: isStatic, className, style, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-Skeleton", className)}
        data-shape={shape}
        data-static={isStatic || undefined}
        style={{ width, height, ...style }}
        aria-hidden="true"
        {...rest}
      />
    );
  },
);

export interface SkeletonPresetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of repeated rows where applicable. */
  rows?: number;
}

/** Text block skeleton with N lines (last line shortened). */
export function SkeletonText({ rows = 3, className, ...rest }: SkeletonPresetProps) {
  return (
    <div className={cx("msr-Skeleton-text", className)} {...rest}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} shape="line" width={i === rows - 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}

/** Card skeleton: media block, title and text lines. */
export function SkeletonCard({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx("msr-Skeleton-card", className)} {...rest}>
      <Skeleton shape="rect" height={120} />
      <Skeleton shape="line" width="50%" height={16} />
      <SkeletonText rows={2} />
    </div>
  );
}

/** Table skeleton with header + body rows. */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
  ...rest
}: SkeletonPresetProps & { columns?: number }) {
  return (
    <div className={cx("msr-Skeleton-table", className)} {...rest}>
      <div className="msr-Skeleton-table__row" data-header>
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton key={c} shape="line" height={12} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div className="msr-Skeleton-table__row" key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton key={c} shape="line" height={12} />
          ))}
        </div>
      ))}
    </div>
  );
}
