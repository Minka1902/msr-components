import * as React from "react";
import { cx } from "../../lib/cx";

export interface OrbitItem {
  id: string;
  content: React.ReactNode;
  /** Orbit radius in px (defaults to `defaultRadius`). */
  radius?: number;
  /** Seconds per revolution. */
  duration?: number;
  reverse?: boolean;
}

export interface OrbitingIconsProps extends React.HTMLAttributes<HTMLDivElement> {
  center?: React.ReactNode;
  items: OrbitItem[];
  defaultRadius?: number;
  defaultDuration?: number;
  /** Draw faint ring guides. */
  showOrbits?: boolean;
}

/** Icons/avatars orbiting a center node on one or more rings. */
export const OrbitingIcons = React.forwardRef<HTMLDivElement, OrbitingIconsProps>(function OrbitingIcons(
  { center, items, defaultRadius = 90, defaultDuration = 18, showOrbits = true, className, style, ...rest },
  ref,
) {
  const withRadius = items.map((it) => ({ ...it, r: it.radius ?? defaultRadius }));
  const maxR = Math.max(defaultRadius, ...withRadius.map((it) => it.r));
  const dim = maxR * 2 + 48;

  // Group by radius to auto-distribute starting angles around each ring.
  const groups = new Map<number, number>();
  const indexInRing = withRadius.map((it) => {
    const i = groups.get(it.r) ?? 0;
    groups.set(it.r, i + 1);
    return i;
  });
  const ringCounts = new Map<number, number>();
  withRadius.forEach((it) => ringCounts.set(it.r, (ringCounts.get(it.r) ?? 0) + 1));
  const rings = [...new Set(withRadius.map((it) => it.r))];

  return (
    <div
      ref={ref}
      className={cx("msr-OrbitingIcons", className)}
      style={{ width: dim, height: dim, ...style }}
      {...rest}
    >
      {showOrbits &&
        rings.map((r) => (
          <span key={r} className="msr-OrbitingIcons__ring" style={{ width: r * 2, height: r * 2 }} aria-hidden="true" />
        ))}

      {center && <div className="msr-OrbitingIcons__center">{center}</div>}

      {withRadius.map((it, i) => {
        const count = ringCounts.get(it.r) ?? 1;
        const angle = (360 / count) * indexInRing[i];
        const dur = it.duration ?? defaultDuration;
        const delay = -(angle / 360) * dur;
        return (
          <div
            key={it.id}
            className="msr-OrbitingIcons__orbit"
            style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s`, animationDirection: it.reverse ? "reverse" : "normal" }}
          >
            <div className="msr-OrbitingIcons__arm" style={{ transform: `translateX(${it.r}px)` }}>
              <div
                className="msr-OrbitingIcons__item"
                style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s`, animationDirection: it.reverse ? "normal" : "reverse" }}
              >
                {it.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});
