import * as React from "react";
import { cx } from "../../lib/cx";
import { useControllableState } from "../../lib/useControllableState";

export interface ResizableSplitPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  start: React.ReactNode;
  end: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  /** Size of the start pane as a percentage (0–100). */
  size?: number;
  defaultSize?: number;
  onSizeChange?: (size: number) => void;
  minSize?: number;
  maxSize?: number;
  /** Keyboard step in percent. */
  step?: number;
}

/** Two resizable panes with a draggable, keyboard-accessible divider. */
export const ResizableSplitPanel = React.forwardRef<HTMLDivElement, ResizableSplitPanelProps>(
  function ResizableSplitPanel(
    {
      start,
      end,
      orientation = "horizontal",
      size,
      defaultSize = 40,
      onSizeChange,
      minSize = 10,
      maxSize = 90,
      step = 2,
      className,
      ...rest
    },
    ref,
  ) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [pct, setPct] = useControllableState<number>({
      value: size,
      defaultValue: defaultSize,
      onChange: onSizeChange,
    });
    const [dragging, setDragging] = React.useState(false);
    const horizontal = orientation === "horizontal";

    const clamp = React.useCallback(
      (v: number) => Math.max(minSize, Math.min(maxSize, v)),
      [minSize, maxSize],
    );

    const onPointerMove = React.useCallback(
      (e: PointerEvent) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const raw = horizontal
          ? ((e.clientX - rect.left) / rect.width) * 100
          : ((e.clientY - rect.top) / rect.height) * 100;
        setPct(clamp(raw));
      },
      [horizontal, clamp, setPct],
    );

    React.useEffect(() => {
      if (!dragging) return;
      const stop = () => setDragging(false);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stop);
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", stop);
      };
    }, [dragging, onPointerMove]);

    const onKeyDown = (e: React.KeyboardEvent) => {
      const dec = horizontal ? "ArrowLeft" : "ArrowUp";
      const inc = horizontal ? "ArrowRight" : "ArrowDown";
      if (e.key === dec) {
        e.preventDefault();
        setPct(clamp(pct - step));
      } else if (e.key === inc) {
        e.preventDefault();
        setPct(clamp(pct + step));
      } else if (e.key === "Home") {
        e.preventDefault();
        setPct(minSize);
      } else if (e.key === "End") {
        e.preventDefault();
        setPct(maxSize);
      }
    };

    const setRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    return (
      <div
        ref={setRef}
        className={cx("msr-Split", className)}
        data-orientation={orientation}
        data-dragging={dragging || undefined}
        {...rest}
      >
        <div className="msr-Split__pane" style={{ flexBasis: `${pct}%` }}>
          {start}
        </div>
        <div
          role="separator"
          aria-orientation={horizontal ? "vertical" : "horizontal"}
          aria-valuenow={Math.round(pct)}
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          tabIndex={0}
          className="msr-Split__divider"
          onPointerDown={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onKeyDown={onKeyDown}
        >
          <span className="msr-Split__grip" aria-hidden="true" />
        </div>
        <div className="msr-Split__pane" style={{ flexBasis: `${100 - pct}%` }}>
          {end}
        </div>
      </div>
    );
  },
);
