import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  /** Show a tooltip with the value while interacting. */
  showValue?: boolean;
  /** aria-label for the thumb. */
  label?: string;
}

function clampStep(v: number, min: number, max: number, step: number) {
  const stepped = Math.round((v - min) / step) * step + min;
  return Math.max(min, Math.min(max, stepped));
}

/** Single-value slider with pointer + keyboard control. */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { min = 0, max = 100, step = 1, value, defaultValue, onValueChange, disabled, showValue, label, className, ...rest },
  ref,
) {
  const [val, setVal] = useControllableState<number>({
    value,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const pct = ((val - min) / (max - min || 1)) * 100;

  const setFromClientX = React.useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setVal(clampStep(min + ratio * (max - min), min, max, step));
    },
    [min, max, step, setVal],
  );

  React.useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = val;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = val + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = val - step;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else return;
    e.preventDefault();
    setVal(clampStep(next, min, max, step));
  };

  return (
    <div
      ref={ref}
      className={cx("msr-Slider", className)}
      data-disabled={disabled || undefined}
      data-dragging={dragging || undefined}
      {...rest}
    >
      <div
        ref={trackRef}
        className="msr-Slider__track"
        onPointerDown={(e) => {
          if (disabled) return;
          e.preventDefault();
          setDragging(true);
          setFromClientX(e.clientX);
        }}
      >
        <span className="msr-Slider__range" style={{ width: `${pct}%` }} />
        <span
          className="msr-Slider__thumb"
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-valuenow={val}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
        >
          {showValue && <span className="msr-Slider__value">{val}</span>}
        </span>
      </div>
    </div>
  );
});
