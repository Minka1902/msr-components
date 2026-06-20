import * as React from "react";
import { cx } from "../../lib/cx";

export interface MorphingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Phrases to morph between, in order. */
  texts: string[];
  /** Seconds each phrase is held. */
  holdSeconds?: number;
  /** Seconds the morph transition takes. */
  morphSeconds?: number;
}

/** Gooey blur-morph transition between phrases. */
export const MorphingText = React.forwardRef<HTMLDivElement, MorphingTextProps>(function MorphingText(
  { texts, holdSeconds = 1.6, morphSeconds = 0.8, className, style, ...rest },
  ref,
) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (texts.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), (holdSeconds + morphSeconds) * 1000);
    return () => clearInterval(id);
  }, [texts.length, holdSeconds, morphSeconds]);

  const next = (index + 1) % texts.length;

  return (
    <div
      ref={ref}
      className={cx("msr-MorphingText", className)}
      style={{ ["--msr-morph-dur" as string]: `${morphSeconds}s`, ...style }}
      aria-label={texts[index]}
      {...rest}
    >
      <span className="msr-MorphingText__filter" aria-hidden="true">
        <span key={`a${index}`} className="msr-MorphingText__out">{texts[index]}</span>
        <span key={`b${next}`} className="msr-MorphingText__in">{texts[next]}</span>
      </span>
      <svg className="msr-MorphingText__svg" aria-hidden="true">
        <defs>
          <filter id="msr-morph-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </defs>
      </svg>
    </div>
  );
});
