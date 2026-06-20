import * as React from "react";
import { cx } from "../../lib/cx";

export interface LiquidProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fill percentage 0–100. */
  value: number;
  size?: number;
  variant?: "circle" | "square";
  color?: string;
  /** Amplitude of the surface wave (viewBox units). */
  amplitude?: number;
  showLabel?: boolean;
  /** Custom label renderer. */
  formatLabel?: (value: number) => React.ReactNode;
}

function wavePath(width: number, waveLen: number, amp: number, baseY: number): string {
  let d = `M 0 ${baseY}`;
  for (let x = 0; x < width; x += waveLen) {
    d += ` q ${waveLen / 4} ${-amp} ${waveLen / 2} 0 q ${waveLen / 4} ${amp} ${waveLen / 2} 0`;
  }
  return `${d} L ${width} 100 L 0 100 Z`;
}

/** Animated "liquid fill" progress with a rippling surface (SVG). */
export const LiquidProgress = React.forwardRef<HTMLDivElement, LiquidProgressProps>(function LiquidProgress(
  { value, size = 120, variant = "circle", color = "var(--msr-color-primary)", amplitude = 4, showLabel = true, formatLabel, className, style, ...rest },
  ref,
) {
  const v = Math.max(0, Math.min(100, value));
  const baseY = 100 - v;
  const clipId = React.useId().replace(/:/g, "");
  const path = wavePath(200, 25, amplitude, baseY);

  return (
    <div
      ref={ref}
      className={cx("msr-LiquidProgress", className)}
      data-variant={variant}
      style={{ width: size, height: size, ["--msr-liquid-color" as string]: color, ...style }}
      role="progressbar"
      aria-label="Progress"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <svg className="msr-LiquidProgress__svg" viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <clipPath id={clipId}>
            {variant === "circle" ? (
              <circle cx="50" cy="50" r="48" />
            ) : (
              <rect x="2" y="2" width="96" height="96" rx="14" />
            )}
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="0" y="0" width="100" height="100" className="msr-LiquidProgress__bg" />
          <path d={path} className="msr-LiquidProgress__wave msr-LiquidProgress__wave--back" />
          <path d={path} className="msr-LiquidProgress__wave msr-LiquidProgress__wave--front" />
        </g>
        {variant === "circle" ? (
          <circle cx="50" cy="50" r="48" className="msr-LiquidProgress__outline" />
        ) : (
          <rect x="2" y="2" width="96" height="96" rx="14" className="msr-LiquidProgress__outline" />
        )}
      </svg>
      {showLabel && (
        <span className="msr-LiquidProgress__label" data-filled={v > 52 || undefined}>
          {formatLabel ? formatLabel(v) : `${Math.round(v)}%`}
        </span>
      )}
    </div>
  );
});
