import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export type VoteValue = 1 | 0 | -1;

export interface VoteButtonsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Base score (excluding the current user's vote). */
  score: number;
  /** Current user's vote. */
  value?: VoteValue;
  defaultValue?: VoteValue;
  onChange?: (value: VoteValue) => void;
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md";
  disabled?: boolean;
}

/** Up/down voting control with a running score (Reddit/SO style). */
export const VoteButtons = React.forwardRef<HTMLDivElement, VoteButtonsProps>(function VoteButtons(
  { score, value, defaultValue = 0, onChange, orientation = "vertical", size = "md", disabled, className, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<VoteValue>(defaultValue);
  const vote = controlled ? (value as VoteValue) : internal;

  const set = (next: VoteValue) => {
    const v = vote === next ? 0 : next;
    if (!controlled) setInternal(v);
    onChange?.(v);
  };

  const displayed = score + vote;

  return (
    <div
      ref={ref}
      className={cx("msr-VoteButtons", className)}
      data-orientation={orientation}
      data-size={size}
      {...rest}
    >
      <button
        type="button"
        className="msr-VoteButtons__btn"
        data-active={vote === 1 || undefined}
        data-dir="up"
        aria-label="Upvote"
        aria-pressed={vote === 1}
        disabled={disabled}
        onClick={() => set(1)}
      >
        <Icon name="arrowUp" size={size === "sm" ? 14 : 18} />
      </button>
      <span className="msr-VoteButtons__score" data-sign={displayed > 0 ? "pos" : displayed < 0 ? "neg" : "zero"}>
        {displayed}
      </span>
      <button
        type="button"
        className="msr-VoteButtons__btn"
        data-active={vote === -1 || undefined}
        data-dir="down"
        aria-label="Downvote"
        aria-pressed={vote === -1}
        disabled={disabled}
        onClick={() => set(-1)}
      >
        <Icon name="arrowDown" size={size === "sm" ? 14 : 18} />
      </button>
    </div>
  );
});
