import * as React from "react";
import { cx } from "../../lib/cx";

export interface Reaction {
  /** Emoji character, e.g. "👍". */
  emoji: string;
  count: number;
  /** Whether the current user reacted with this emoji. */
  reacted?: boolean;
  label?: string;
}

export interface ReactionBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  reactions: Reaction[];
  /** Fired when a reaction chip is toggled. */
  onToggle?: (emoji: string) => void;
  /** Emoji shown in the "add reaction" picker. */
  pickerEmojis?: string[];
  /** Fired when an emoji is chosen from the picker. */
  onAdd?: (emoji: string) => void;
  size?: "sm" | "md";
}

const DEFAULT_PICKER = ["👍", "❤️", "😂", "🎉", "😮", "😢", "🙏", "🔥"];

/** Row of emoji reaction chips with counts and an add-reaction picker. */
export const ReactionBar = React.forwardRef<HTMLDivElement, ReactionBarProps>(function ReactionBar(
  { reactions, onToggle, pickerEmojis = DEFAULT_PICKER, onAdd, size = "md", className, ...rest },
  ref,
) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pickerOpen]);

  return (
    <div ref={ref} className={cx("msr-ReactionBar", className)} data-size={size} {...rest}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          className="msr-ReactionBar__chip"
          data-reacted={r.reacted || undefined}
          aria-pressed={!!r.reacted}
          aria-label={r.label ?? `React with ${r.emoji}`}
          onClick={() => onToggle?.(r.emoji)}
        >
          <span className="msr-ReactionBar__emoji">{r.emoji}</span>
          <span className="msr-ReactionBar__count">{r.count}</span>
        </button>
      ))}

      {onAdd && (
        <div ref={wrapRef} className="msr-ReactionBar__add">
          <button
            type="button"
            className="msr-ReactionBar__addBtn"
            aria-label="Add reaction"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((o) => !o)}
          >
            +
          </button>
          {pickerOpen && (
            <div className="msr-ReactionBar__picker" role="menu">
              {pickerEmojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  role="menuitem"
                  className="msr-ReactionBar__pick"
                  onClick={() => {
                    onAdd(e);
                    setPickerOpen(false);
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
