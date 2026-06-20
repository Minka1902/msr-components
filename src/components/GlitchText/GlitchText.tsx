import * as React from "react";
import { cx } from "../../lib/cx";

export interface GlitchTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  /** Run continuously, or only on hover. */
  trigger?: "always" | "hover";
  /** RGB-split offset color A. */
  colorA?: string;
  /** RGB-split offset color B. */
  colorB?: string;
}

/** RGB-split "glitch" text effect. */
export const GlitchText = React.forwardRef<HTMLSpanElement, GlitchTextProps>(function GlitchText(
  { text, trigger = "always", colorA = "#ff3b3b", colorB = "#3bdfff", className, style, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx("msr-GlitchText", className)}
      data-trigger={trigger}
      data-text={text}
      style={{ ["--msr-glitch-a" as string]: colorA, ["--msr-glitch-b" as string]: colorB, ...style }}
      {...rest}
    >
      {text}
    </span>
  );
});
