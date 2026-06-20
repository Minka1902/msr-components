import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { EMOJIS, EMOJI_GROUPS, type EmojiDatum } from "./emojiData";

export interface EmojiPickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: (emoji: string) => void;
  /** Override the emoji dataset. */
  emojis?: EmojiDatum[];
  /** Recently used emoji shown first. */
  recents?: string[];
  columns?: number;
  /** Hide the search box. */
  hideSearch?: boolean;
}

/** Searchable, grouped emoji picker with a built-in dataset. */
export const EmojiPicker = React.forwardRef<HTMLDivElement, EmojiPickerProps>(function EmojiPicker(
  { onSelect, emojis = EMOJIS, recents, columns = 8, hideSearch = false, className, style, ...rest },
  ref,
) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return emojis;
    return emojis.filter((e) => e.name.includes(q) || e.char === q);
  }, [emojis, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, EmojiDatum[]>();
    for (const e of filtered) {
      const list = map.get(e.group);
      if (list) list.push(e);
      else map.set(e.group, [e]);
    }
    return map;
  }, [filtered]);

  const gridStyle = { gridTemplateColumns: `repeat(${columns}, 1fr)` };

  return (
    <div
      ref={ref}
      className={cx("msr-EmojiPicker", className)}
      style={{ ["--msr-emoji-cols" as string]: String(columns), ...style }}
      {...rest}
    >
      {!hideSearch && (
        <div className="msr-EmojiPicker__search">
          <Icon name="search" size={15} />
          <input
            type="text"
            className="msr-EmojiPicker__input"
            placeholder="Search emoji"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search emoji"
          />
        </div>
      )}

      <div className="msr-EmojiPicker__scroll">
        {!query && recents && recents.length > 0 && (
          <section className="msr-EmojiPicker__section">
            <h4 className="msr-EmojiPicker__heading">Recent</h4>
            <div className="msr-EmojiPicker__grid" style={gridStyle}>
              {recents.map((char, i) => (
                <button key={`r${i}`} type="button" className="msr-EmojiPicker__emoji" onClick={() => onSelect?.(char)}>
                  {char}
                </button>
              ))}
            </div>
          </section>
        )}

        {EMOJI_GROUPS.filter((g) => grouped.has(g)).map((group) => (
          <section key={group} className="msr-EmojiPicker__section">
            <h4 className="msr-EmojiPicker__heading">{group}</h4>
            <div className="msr-EmojiPicker__grid" style={gridStyle}>
              {grouped.get(group)!.map((e) => (
                <button
                  key={e.char}
                  type="button"
                  className="msr-EmojiPicker__emoji"
                  title={e.name}
                  aria-label={e.name}
                  onClick={() => onSelect?.(e.char)}
                >
                  {e.char}
                </button>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && <div className="msr-EmojiPicker__empty">No emoji found</div>}
      </div>
    </div>
  );
});
