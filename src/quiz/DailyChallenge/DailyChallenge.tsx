import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Button } from "../../components/Button/Button";

export interface DailyChallengeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  /** Today's challenge label/date. */
  dayLabel?: React.ReactNode;
  /** Current streak in days. */
  streak?: number;
  /** Today's score (e.g. guesses used or points). */
  score?: React.ReactNode;
  /** Whether today's challenge is already solved. */
  solved?: boolean;
  onPlay?: () => void;
  onShare?: () => void;
  playLabel?: string;
}

/** Daily challenge header: streak, score, play/share actions. */
export const DailyChallenge = React.forwardRef<HTMLDivElement, DailyChallengeProps>(
  function DailyChallenge(
    { title = "Daily Challenge", dayLabel, streak = 0, score, solved, onPlay, onShare, playLabel = "Play today", className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-DailyChallenge", className)} data-solved={solved || undefined} {...rest}>
        <div className="msr-DailyChallenge__head">
          <div>
            <div className="msr-DailyChallenge__title">{title}</div>
            {dayLabel && <div className="msr-DailyChallenge__day">{dayLabel}</div>}
          </div>
          <div className="msr-DailyChallenge__streak" title="Current streak">
            <Icon name="sparkles" size={16} />
            <span className="msr-DailyChallenge__streak-num">{streak}</span>
            <span className="msr-DailyChallenge__streak-label">day streak</span>
          </div>
        </div>
        <div className="msr-DailyChallenge__body">
          {solved ? (
            <div className="msr-DailyChallenge__solved">
              <Icon name="checkCircle" size={18} /> Solved
              {score != null && <span className="msr-DailyChallenge__score"> · {score}</span>}
            </div>
          ) : (
            <Button onClick={onPlay}>{playLabel}</Button>
          )}
          {onShare && (
            <Button variant="ghost" tone="neutral" leftIcon={<Icon name="export" size={15} />} onClick={onShare}>
              Share
            </Button>
          )}
        </div>
      </div>
    );
  },
);
