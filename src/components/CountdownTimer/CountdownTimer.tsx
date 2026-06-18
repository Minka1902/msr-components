import * as React from "react";
import { useCountdown } from "msr-hooks";
import { cx } from "../../lib/cx";

export interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Total seconds to count down from. */
  seconds: number;
  /** Start immediately (default true). */
  autoStart?: boolean;
  onComplete?: () => void;
  /** Render as boxed digit segments. */
  boxed?: boolean;
  /** Show the days segment. */
  showDays?: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Countdown timer (days/hours/minutes/seconds) via useCountdown. */
export const CountdownTimer = React.forwardRef<HTMLDivElement, CountdownTimerProps>(
  function CountdownTimer(
    { seconds, autoStart = true, onComplete, boxed = true, showDays = false, className, ...rest },
    ref,
  ) {
    const { count, start } = useCountdown(seconds, { onComplete });
    const started = React.useRef(false);

    React.useEffect(() => {
      if (autoStart && !started.current) {
        started.current = true;
        start();
      }
    }, [autoStart, start]);

    const d = Math.floor(count / 86400);
    const h = Math.floor((count % 86400) / 3600);
    const m = Math.floor((count % 3600) / 60);
    const s = count % 60;

    const segments: Array<[string, number]> = showDays
      ? [["days", d], ["hrs", h], ["min", m], ["sec", s]]
      : [["hrs", h + d * 24], ["min", m], ["sec", s]];

    return (
      <div ref={ref} className={cx("msr-Countdown", className)} data-boxed={boxed || undefined} role="timer" {...rest}>
        {segments.map(([label, val], i) => (
          <React.Fragment key={label}>
            <div className="msr-Countdown__seg">
              <span className="msr-Countdown__num">{pad(val)}</span>
              <span className="msr-Countdown__label">{label}</span>
            </div>
            {i < segments.length - 1 && !boxed && <span className="msr-Countdown__colon">:</span>}
          </React.Fragment>
        ))}
      </div>
    );
  },
);
