import * as React from "react";

export interface MousePosition {
  /** Viewport coordinates. */
  x: number;
  y: number;
  /** Coordinates relative to the tracked element's top-left. */
  elementX: number;
  elementY: number;
  /** Offset from the element's center (handy for magnetic/parallax effects). */
  centerX: number;
  centerY: number;
  isInside: boolean;
}

const INITIAL: MousePosition = {
  x: 0, y: 0, elementX: 0, elementY: 0, centerX: 0, centerY: 0, isInside: false,
};

/**
 * Tracks the pointer position relative to a target element. Listeners attach to
 * the element so it only updates while hovered.
 *
 * Not available in msr-hooks@1.1.0 — see MISSING_HOOKS.md.
 */
export function useMousePosition(ref: React.RefObject<HTMLElement>): MousePosition {
  const [pos, setPos] = React.useState<MousePosition>(INITIAL);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const elementX = e.clientX - r.left;
      const elementY = e.clientY - r.top;
      setPos({
        x: e.clientX,
        y: e.clientY,
        elementX,
        elementY,
        centerX: elementX - r.width / 2,
        centerY: elementY - r.height / 2,
        isInside: true,
      });
    };
    const onLeave = () => setPos((p) => ({ ...p, isInside: false }));
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);

  return pos;
}
