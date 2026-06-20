import * as React from "react";
import { cx } from "../../lib/cx";

export interface HoldToConfirmProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Fires after the button is held for `duration` ms. */
  onConfirm?: () => void;
  /** Hold time required, ms. */
  duration?: number;
  tone?: "primary" | "danger";
  children?: React.ReactNode;
}

/** Press-and-hold button that confirms only after a sustained hold. */
export const HoldToConfirm = React.forwardRef<HTMLButtonElement, HoldToConfirmProps>(function HoldToConfirm(
  { onConfirm, duration = 1200, tone = "danger", className, children, disabled, style, ...rest },
  ref,
) {
  const [holding, setHolding] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const start = () => {
    if (disabled || done) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      setDone(true);
      onConfirm?.();
      setTimeout(() => setDone(false), 900);
    }, duration);
  };
  const cancel = () => {
    clearTimeout(timer.current);
    setHolding(false);
  };
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      ref={ref}
      className={cx("msr-HoldToConfirm", className)}
      data-tone={tone}
      data-holding={holding || undefined}
      data-done={done || undefined}
      disabled={disabled}
      style={{ ["--msr-hold-dur" as string]: `${duration}ms`, ...style }}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      {...rest}
    >
      <span className="msr-HoldToConfirm__fill" aria-hidden="true" />
      <span className="msr-HoldToConfirm__label">{children}</span>
    </button>
  );
});
