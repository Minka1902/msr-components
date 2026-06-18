import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface RangeSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  disabled?: boolean;
}

function clampStep(v: number, min: number, max: number, step: number) {
  const stepped = Math.round((v - min) / step) * step + min;
  return Math.max(min, Math.min(max, stepped));
}

/** Dual-thumb range slider. */
export const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(function RangeSlider(
  { min = 0, max = 100, step = 1, value, defaultValue, onValueChange, disabled, className, ...rest },
  ref,
) {
  const [val, setVal] = useControllableState<[number, number]>({
    value,
    defaultValue: defaultValue ?? [min, max],
    onChange: onValueChange,
  });
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const setThumb = React.useCallback(
    (index: number, clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const next = clampStep(min + ratio * (max - min), min, max, step);
      setVal((prev) => {
        const out: [number, number] = [...prev] as [number, number];
        out[index] = next;
        if (out[0] > out[1]) {
          // swap to keep ordering
          return index === 0 ? [out[1], out[1]] : [out[0], out[0]];
        }
        return out;
      });
    },
    [min, max, step, setVal],
  );

  React.useEffect(() => {
    if (dragIndex === null) return;
    const move = (e: PointerEvent) => setThumb(dragIndex, e.clientX);
    const up = () => setDragIndex(null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragIndex, setThumb]);

  const pctOf = (v: number) => ((v - min) / (max - min || 1)) * 100;

  const keyHandler = (index: number) => (e: React.KeyboardEvent) => {
    let delta = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -step;
    else return;
    e.preventDefault();
    setVal((prev) => {
      const out: [number, number] = [...prev] as [number, number];
      out[index] = clampStep(out[index] + delta, min, max, step);
      if (out[0] > out[1]) out.sort((a, b) => a - b);
      return out as [number, number];
    });
  };

  return (
    <div ref={ref} className={cx("msr-Slider msr-RangeSlider", className)} data-disabled={disabled || undefined} {...rest}>
      <div ref={trackRef} className="msr-Slider__track">
        <span
          className="msr-Slider__range"
          style={{ left: `${pctOf(val[0])}%`, width: `${pctOf(val[1]) - pctOf(val[0])}%` }}
        />
        {([0, 1] as const).map((i) => (
          <span
            key={i}
            className="msr-Slider__thumb"
            style={{ left: `${pctOf(val[i])}%` }}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuenow={val[i]}
            aria-valuemin={i === 0 ? min : val[0]}
            aria-valuemax={i === 0 ? val[1] : max}
            onPointerDown={(e) => {
              if (disabled) return;
              e.preventDefault();
              setDragIndex(i);
            }}
            onKeyDown={keyHandler(i)}
          />
        ))}
      </div>
    </div>
  );
});
