import * as React from "react";
import { cx } from "../../lib/cx";

export interface TypewriterProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Phrases to type through in order. */
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  /** Pause (ms) once a word is fully typed. */
  pauseMs?: number;
  loop?: boolean;
  /** Show the blinking caret. */
  cursor?: boolean;
  cursorChar?: string;
}

/** Types and deletes through a list of phrases with a blinking caret. */
export const Typewriter = React.forwardRef<HTMLSpanElement, TypewriterProps>(function Typewriter(
  { words, typeSpeed = 70, deleteSpeed = 40, pauseMs = 1400, loop = true, cursor = true, cursorChar = "|", className, ...rest },
  ref,
) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (done || words.length === 0) return;
    const current = words[index % words.length];
    const delay = deleting ? deleteSpeed : typeSpeed;

    if (!deleting && text === current) {
      const isLast = index === words.length - 1;
      if (!loop && isLast) {
        setDone(true);
        return;
      }
      const t = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
      );
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pauseMs, loop, done]);

  return (
    <span ref={ref} className={cx("msr-Typewriter", className)} {...rest}>
      <span className="msr-Typewriter__text">{text}</span>
      {cursor && (
        <span className="msr-Typewriter__cursor" data-done={done || undefined} aria-hidden="true">
          {cursorChar}
        </span>
      )}
    </span>
  );
});
