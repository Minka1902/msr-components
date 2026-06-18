import * as React from "react";
import { cx } from "../../lib/cx";

export interface ImageComparisonProps extends React.HTMLAttributes<HTMLDivElement> {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  /** Initial divider position (0–100). */
  defaultPosition?: number;
  beforeLabel?: string;
  afterLabel?: string;
}

/** Before/after image slider with a draggable divider. */
export const ImageComparison = React.forwardRef<HTMLDivElement, ImageComparisonProps>(
  function ImageComparison(
    { beforeSrc, afterSrc, beforeAlt = "Before", afterAlt = "After", defaultPosition = 50, beforeLabel, afterLabel, className, ...rest },
    ref,
  ) {
    const [pos, setPos] = React.useState(defaultPosition);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = React.useState(false);

    const setFromClientX = React.useCallback((clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    }, []);

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

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx("msr-ImageCompare", className)}
        onPointerDown={(e) => { setDragging(true); setFromClientX(e.clientX); }}
        {...rest}
      >
        <img className="msr-ImageCompare__img" src={afterSrc} alt={afterAlt} draggable={false} />
        {afterLabel && <span className="msr-ImageCompare__label" data-side="after">{afterLabel}</span>}
        <div className="msr-ImageCompare__before" style={{ width: `${pos}%` }}>
          <img className="msr-ImageCompare__img" src={beforeSrc} alt={beforeAlt} draggable={false} style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }} />
          {beforeLabel && <span className="msr-ImageCompare__label" data-side="before">{beforeLabel}</span>}
        </div>
        <div
          className="msr-ImageCompare__divider"
          style={{ left: `${pos}%` }}
          role="slider"
          aria-label="Comparison position"
          aria-valuenow={Math.round(pos)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); setPos((p) => Math.max(0, p - 2)); }
            else if (e.key === "ArrowRight") { e.preventDefault(); setPos((p) => Math.min(100, p + 2)); }
          }}
        >
          <span className="msr-ImageCompare__handle" />
        </div>
      </div>
    );
  },
);
