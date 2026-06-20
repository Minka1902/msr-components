import * as React from "react";

/**
 * Runs `callback` on every animation frame while `active` is true, passing the
 * delta (ms since last frame) and elapsed (ms since start).
 *
 * Not available in msr-hooks@1.1.0 — see MISSING_HOOKS.md.
 */
export function useAnimationFrame(
  callback: (deltaMs: number, elapsedMs: number) => void,
  active = true,
): void {
  const cbRef = React.useRef(callback);
  cbRef.current = callback;

  React.useEffect(() => {
    if (!active) return;
    if (typeof requestAnimationFrame === "undefined") return;
    let raf = 0;
    const start = performance.now();
    let last = start;
    const loop = (now: number) => {
      cbRef.current(now - last, now - start);
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
