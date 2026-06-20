import * as React from "react";
import { cx } from "../../lib/cx";

export interface WaveformProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSeek"> {
  /** Amplitude peaks, each 0–1. */
  peaks: number[];
  /** Played fraction, 0–1. */
  progress?: number;
  /** Seek when a bar is clicked; receives a 0–1 fraction. */
  onSeek?: (fraction: number) => void;
  height?: number;
  barWidth?: number;
  gap?: number;
}

/** Audio waveform rendered as amplitude bars with a played overlay. */
export const Waveform = React.forwardRef<HTMLDivElement, WaveformProps>(function Waveform(
  { peaks, progress = 0, onSeek, height = 48, barWidth = 3, gap = 2, className, style, ...rest },
  ref,
) {
  const playedIndex = Math.round(progress * peaks.length);

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };

  return (
    <div
      ref={ref}
      className={cx("msr-Waveform", className)}
      style={{ height, gap: `${gap}px`, cursor: onSeek ? "pointer" : undefined, ...style }}
      role={onSeek ? "slider" : undefined}
      aria-valuenow={onSeek ? Math.round(progress * 100) : undefined}
      aria-valuemin={onSeek ? 0 : undefined}
      aria-valuemax={onSeek ? 100 : undefined}
      aria-label={onSeek ? "Seek" : undefined}
      onClick={seekFromEvent}
      {...rest}
    >
      {peaks.map((p, i) => (
        <span
          key={i}
          className="msr-Waveform__bar"
          data-played={i < playedIndex || undefined}
          style={{ width: barWidth, height: `${Math.max(6, p * 100)}%` }}
        />
      ))}
    </div>
  );
});
