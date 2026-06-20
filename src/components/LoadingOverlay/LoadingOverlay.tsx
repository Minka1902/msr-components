import * as React from "react";
import { cx } from "../../lib/cx";
import { Spinner } from "../Spinner";

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the overlay is shown. */
  active: boolean;
  label?: React.ReactNode;
  /** Cover the whole viewport instead of the wrapped content. */
  fullscreen?: boolean;
  /** Blur the content behind the overlay. */
  blur?: boolean;
  spinnerSize?: number;
  children?: React.ReactNode;
}

/** Dims and locks content (or the viewport) while an async task runs. */
export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(function LoadingOverlay(
  { active, label, fullscreen = false, blur = false, spinnerSize = 28, children, className, ...rest },
  ref,
) {
  const overlay = active && (
    <div className="msr-LoadingOverlay__veil" data-blur={blur || undefined} role="status" aria-live="polite">
      <Spinner size={spinnerSize} />
      {label && <span className="msr-LoadingOverlay__label">{label}</span>}
    </div>
  );

  if (fullscreen) {
    return active ? (
      <div ref={ref} className={cx("msr-LoadingOverlay", "msr-LoadingOverlay--fullscreen", className)} {...rest}>
        {overlay}
      </div>
    ) : null;
  }

  return (
    <div ref={ref} className={cx("msr-LoadingOverlay", className)} data-active={active || undefined} {...rest}>
      {children}
      {overlay}
    </div>
  );
});
