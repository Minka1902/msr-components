import * as React from "react";

export type Placement = "top" | "bottom" | "left" | "right";

export interface UsePositionOptions {
  anchor: React.RefObject<HTMLElement>;
  floating: React.RefObject<HTMLElement>;
  placement?: Placement;
  /** Gap between anchor and floating element, in px. */
  offset?: number;
  open: boolean;
}

export interface PositionResult {
  x: number;
  y: number;
  placement: Placement;
}

/**
 * Lightweight anchored positioning with viewport flipping. Computes fixed
 * coordinates for a floating element relative to an anchor.
 *
 * Not available in msr-hooks@1.1.0 — see MISSING_HOOKS.md.
 */
export function usePosition({
  anchor,
  floating,
  placement = "bottom",
  offset = 8,
  open,
}: UsePositionOptions): PositionResult {
  const [pos, setPos] = React.useState<PositionResult>({ x: 0, y: 0, placement });

  const compute = React.useCallback(() => {
    const a = anchor.current;
    const f = floating.current;
    if (!a || !f) return;

    const ar = a.getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let place = placement;

    // Flip if not enough room.
    if (place === "bottom" && ar.bottom + offset + fr.height > vh && ar.top - offset - fr.height > 0)
      place = "top";
    else if (place === "top" && ar.top - offset - fr.height < 0 && ar.bottom + offset + fr.height < vh)
      place = "bottom";
    else if (place === "right" && ar.right + offset + fr.width > vw && ar.left - offset - fr.width > 0)
      place = "left";
    else if (place === "left" && ar.left - offset - fr.width < 0 && ar.right + offset + fr.width < vw)
      place = "right";

    let x = 0;
    let y = 0;
    switch (place) {
      case "bottom":
        x = ar.left + ar.width / 2 - fr.width / 2;
        y = ar.bottom + offset;
        break;
      case "top":
        x = ar.left + ar.width / 2 - fr.width / 2;
        y = ar.top - offset - fr.height;
        break;
      case "right":
        x = ar.right + offset;
        y = ar.top + ar.height / 2 - fr.height / 2;
        break;
      case "left":
        x = ar.left - offset - fr.width;
        y = ar.top + ar.height / 2 - fr.height / 2;
        break;
    }

    // Clamp horizontally into the viewport.
    x = Math.max(8, Math.min(x, vw - fr.width - 8));
    y = Math.max(8, Math.min(y, vh - fr.height - 8));

    setPos({ x, y, placement: place });
  }, [anchor, floating, placement, offset]);

  React.useLayoutEffect(() => {
    if (!open) return;
    compute();
    window.addEventListener("scroll", compute, true);
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute, true);
      window.removeEventListener("resize", compute);
    };
  }, [open, compute]);

  return pos;
}
