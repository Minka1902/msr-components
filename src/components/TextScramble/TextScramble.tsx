import * as React from "react";
import { cx } from "../../lib/cx";
import { useAnimationFrame } from "../../lib/useAnimationFrame";

export interface TextScrambleProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string;
  /** Characters used while scrambling. */
  charset?: string;
  /** Frames spent per character before it resolves (lower = faster). */
  speed?: number;
  /** When the effect runs. */
  trigger?: "mount" | "hover" | "view";
}

const DEFAULT_CHARSET = "!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";

/** Scrambles characters and resolves them into the target text ("decrypt"). */
export const TextScramble = React.forwardRef<HTMLSpanElement, TextScrambleProps>(function TextScramble(
  { text, charset = DEFAULT_CHARSET, speed = 3, trigger = "mount", className, ...rest },
  ref,
) {
  const [display, setDisplay] = React.useState(trigger === "mount" ? "" : text);
  const [running, setRunning] = React.useState(trigger === "mount");
  const frame = React.useRef(0);
  const started = React.useRef(trigger === "mount");
  const localRef = React.useRef<HTMLSpanElement | null>(null);

  const total = text.length * speed;

  const start = () => {
    frame.current = 0;
    started.current = true;
    setRunning(true);
  };

  // "view" trigger via IntersectionObserver.
  React.useEffect(() => {
    if (trigger !== "view") return;
    const el = localRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) start();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  useAnimationFrame(() => {
    frame.current += 1;
    const f = frame.current;
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === " ") out += " ";
      else if (f >= i * speed) out += ch;
      else out += charset[Math.floor(Math.random() * charset.length)];
    }
    setDisplay(out);
    if (f >= total) setRunning(false);
  }, running);

  const setRefs = (node: HTMLSpanElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
  };

  return (
    <span
      ref={setRefs}
      className={cx("msr-TextScramble", className)}
      data-running={running || undefined}
      onMouseEnter={trigger === "hover" ? start : undefined}
      {...rest}
    >
      {display || " "}
    </span>
  );
});
