import * as React from "react";
import { cx } from "../../lib/cx";

export interface MeteorsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of meteors. */
  count?: number;
  /** Meteor color. */
  color?: string;
  /** Min/max fall duration in seconds. */
  minDuration?: number;
  maxDuration?: number;
}

/** Ambient meteor-shower layer to drop behind hero content. */
export const Meteors = React.forwardRef<HTMLDivElement, MeteorsProps>(function Meteors(
  { count = 20, color = "var(--msr-color-primary)", minDuration = 3, maxDuration = 9, className, style, ...rest },
  ref,
) {
  const meteors = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * -20,
        delay: Math.random() * 5,
        duration: minDuration + Math.random() * (maxDuration - minDuration),
      })),
    [count, minDuration, maxDuration],
  );

  return (
    <div
      ref={ref}
      className={cx("msr-Meteors", className)}
      style={{ ["--msr-meteor-color" as string]: color, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {meteors.map((m, i) => (
        <span
          key={i}
          className="msr-Meteors__meteor"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}
    </div>
  );
});
