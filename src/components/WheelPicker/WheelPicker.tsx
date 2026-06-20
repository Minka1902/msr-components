import * as React from "react";
import { cx } from "../../lib/cx";

export interface WheelOption {
  label: React.ReactNode;
  value: string;
}

export interface WheelPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: WheelOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Odd number of rows visible (centered selection). */
  visibleCount?: number;
  itemHeight?: number;
  /** Static suffix shown beside the wheel (e.g. a unit). */
  suffix?: React.ReactNode;
}

/** iOS-style scrolling wheel selector with snap and 3D curvature. */
export const WheelPicker = React.forwardRef<HTMLDivElement, WheelPickerProps>(function WheelPicker(
  { options, value, defaultValue, onChange, visibleCount = 5, itemHeight = 36, suffix, className, style, ...rest },
  ref,
) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const controlled = value !== undefined;
  const initialIndex = Math.max(
    0,
    options.findIndex((o) => o.value === (controlled ? value : defaultValue)),
  );
  const [internalIndex, setInternalIndex] = React.useState(initialIndex < 0 ? 0 : initialIndex);
  const [scrollY, setScrollY] = React.useState(0);
  const settleTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const rafId = React.useRef(0);

  const selectedIndex = controlled
    ? Math.max(0, options.findIndex((o) => o.value === value))
    : internalIndex;

  const rows = Math.max(3, visibleCount % 2 === 0 ? visibleCount + 1 : visibleCount);
  const pad = ((rows - 1) / 2) * itemHeight;

  // Sync scroll position to the selected index.
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = selectedIndex * itemHeight;
    if (Math.abs(el.scrollTop - target) > 1) el.scrollTop = target;
    setScrollY(target);
  }, [selectedIndex, itemHeight]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => setScrollY(el.scrollTop));
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const idx = Math.max(0, Math.min(options.length - 1, Math.round(el.scrollTop / itemHeight)));
      if (!controlled) setInternalIndex(idx);
      if (options[idx]) onChange?.(options[idx].value);
    }, 120);
  };

  return (
    <div
      ref={ref}
      className={cx("msr-WheelPicker", className)}
      style={{ ["--msr-wheel-h" as string]: `${itemHeight}px`, height: rows * itemHeight, ...style }}
      {...rest}
    >
      <div className="msr-WheelPicker__selection" aria-hidden="true" />
      <div ref={scrollRef} className="msr-WheelPicker__scroll" onScroll={onScroll} role="listbox" tabIndex={0}>
        <div style={{ height: pad }} aria-hidden="true" />
        {options.map((opt, i) => {
          const dist = (i * itemHeight - scrollY) / itemHeight;
          const rot = Math.max(-60, Math.min(60, dist * 20));
          const opacity = Math.max(0.15, 1 - Math.abs(dist) * 0.28);
          return (
            <div
              key={opt.value}
              role="option"
              aria-selected={i === selectedIndex}
              className="msr-WheelPicker__item"
              style={{ height: itemHeight, transform: `rotateX(${rot}deg)`, opacity }}
            >
              {opt.label}
            </div>
          );
        })}
        <div style={{ height: pad }} aria-hidden="true" />
      </div>
      {suffix && <span className="msr-WheelPicker__suffix">{suffix}</span>}
    </div>
  );
});
