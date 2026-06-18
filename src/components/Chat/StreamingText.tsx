import * as React from "react";
import { cx } from "../../lib/cx";

export interface StreamingTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full text to reveal. */
  text: string;
  /** Characters revealed per second. */
  speed?: number;
  /** Show a blinking caret while revealing. */
  caret?: boolean;
  /** Called once the full text has been revealed. */
  onDone?: () => void;
}

/** Typewriter-style progressive text reveal (for LLM-style output). */
export const StreamingText = React.forwardRef<HTMLSpanElement, StreamingTextProps>(
  function StreamingText({ text, speed = 60, caret = true, onDone, className, ...rest }, ref) {
    const [count, setCount] = React.useState(0);
    const doneRef = React.useRef(false);

    React.useEffect(() => {
      // If text shrinks/changes shorter, clamp.
      setCount((c) => Math.min(c, text.length));
      doneRef.current = false;
    }, [text]);

    React.useEffect(() => {
      if (count >= text.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          onDone?.();
        }
        return;
      }
      const interval = 1000 / speed;
      const id = setTimeout(() => setCount((c) => c + 1), interval);
      return () => clearTimeout(id);
    }, [count, text, speed, onDone]);

    const revealing = count < text.length;

    return (
      <span ref={ref} className={cx("msr-Streaming", className)} {...rest}>
        {text.slice(0, count)}
        {caret && revealing && <span className="msr-Streaming__caret" aria-hidden="true" />}
      </span>
    );
  },
);
