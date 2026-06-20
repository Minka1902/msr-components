import * as React from "react";
import { cx } from "../../lib/cx";

export interface SplitFlapDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text to display. Padded/truncated to `length`. */
  value: string;
  /** Fixed number of character cells. Defaults to the value length. */
  length?: number;
  /** Characters cycled through while flipping. */
  charset?: string;
  /** Ms per flip step. */
  speed?: number;
  size?: "sm" | "md" | "lg";
}

const DEFAULT_CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:-/";

function Cell({ target, charset, speed }: { target: string; charset: string; speed: number }) {
  const [display, setDisplay] = React.useState(" ");
  const idxRef = React.useRef(0);

  React.useEffect(() => {
    const upper = target.toUpperCase();
    const targetIdx = Math.max(0, charset.indexOf(upper === "" ? " " : upper));
    let cur = idxRef.current;
    if (cur === targetIdx) {
      setDisplay(charset[targetIdx]);
      return;
    }
    const timer = setInterval(() => {
      cur = (cur + 1) % charset.length;
      idxRef.current = cur;
      setDisplay(charset[cur]);
      if (cur === targetIdx) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [target, charset, speed]);

  return (
    <span className="msr-SplitFlapDisplay__cell">
      <span className="msr-SplitFlapDisplay__char" key={display} data-flip="true">
        {display}
      </span>
    </span>
  );
}

/** Solari "split-flap" board that flips each character to its target. */
export const SplitFlapDisplay = React.forwardRef<HTMLDivElement, SplitFlapDisplayProps>(function SplitFlapDisplay(
  { value, length, charset = DEFAULT_CHARSET, speed = 45, size = "md", className, ...rest },
  ref,
) {
  const len = length ?? value.length;
  const chars = value.toUpperCase().slice(0, len).padEnd(len, " ").split("");

  return (
    <div
      ref={ref}
      className={cx("msr-SplitFlapDisplay", className)}
      data-size={size}
      role="img"
      aria-label={value}
      {...rest}
    >
      {chars.map((ch, i) => (
        <Cell key={i} target={ch} charset={charset} speed={speed} />
      ))}
    </div>
  );
});
