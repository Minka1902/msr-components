import * as React from "react";
import { cx } from "../../lib/cx";

export interface TerminalLine {
  type?: "command" | "output" | "error" | "success" | "comment";
  text: string;
}

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  lines: TerminalLine[];
  title?: string;
  /** Prompt symbol for command lines. */
  prompt?: string;
  /** Show the traffic-light window controls. */
  showControls?: boolean;
}

/** Faux terminal / console output panel. */
export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(function Terminal(
  { lines, title = "bash", prompt = "$", showControls = true, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Terminal", className)} {...rest}>
      <div className="msr-Terminal__bar">
        {showControls && (
          <span className="msr-Terminal__dots" aria-hidden="true">
            <span /><span /><span />
          </span>
        )}
        <span className="msr-Terminal__title">{title}</span>
      </div>
      <pre className="msr-Terminal__body">
        {lines.map((line, i) => (
          <div key={i} className="msr-Terminal__line" data-type={line.type ?? "output"}>
            {line.type === "command" && <span className="msr-Terminal__prompt">{prompt}</span>}
            <span className="msr-Terminal__text">{line.text}</span>
          </div>
        ))}
      </pre>
    </div>
  );
});
