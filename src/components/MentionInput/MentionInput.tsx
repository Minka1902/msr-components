import * as React from "react";
import { cx } from "../../lib/cx";

export interface MentionOption {
  id: string;
  label: string;
  /** Optional secondary text (e.g. @handle). */
  detail?: string;
}

export interface MentionInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value" | "defaultValue"> {
  options: MentionOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Trigger character (default "@"). */
  trigger?: string;
  /** Render the inserted mention from a chosen option. */
  renderMention?: (option: MentionOption) => string;
}

/** Textarea with @-mention autocomplete (keyboard navigable). */
export const MentionInput = React.forwardRef<HTMLTextAreaElement, MentionInputProps>(
  function MentionInput(
    { options, value, defaultValue = "", onValueChange, trigger = "@", renderMention, className, rows = 3, ...rest },
    ref,
  ) {
    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const text = controlled ? value! : internal;
    const taRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [query, setQuery] = React.useState<string | null>(null);
    const [active, setActive] = React.useState(0);
    const tokenStart = React.useRef(-1);

    const setText = (v: string) => {
      if (!controlled) setInternal(v);
      onValueChange?.(v);
    };

    const matches = query == null
      ? []
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6);

    const detectTrigger = (el: HTMLTextAreaElement) => {
      const caret = el.selectionStart;
      const upto = el.value.slice(0, caret);
      const idx = upto.lastIndexOf(trigger);
      if (idx >= 0) {
        const after = upto.slice(idx + 1);
        // valid token: no whitespace since trigger, and trigger at start or preceded by space
        if (!/\s/.test(after) && (idx === 0 || /\s/.test(upto[idx - 1]))) {
          tokenStart.current = idx;
          setQuery(after);
          setActive(0);
          return;
        }
      }
      setQuery(null);
      tokenStart.current = -1;
    };

    const insert = (opt: MentionOption) => {
      const el = taRef.current;
      if (!el || tokenStart.current < 0) return;
      const caret = el.selectionStart;
      const mentionText = `${trigger}${renderMention ? renderMention(opt) : opt.label} `;
      const next = text.slice(0, tokenStart.current) + mentionText + text.slice(caret);
      setText(next);
      setQuery(null);
      tokenStart.current = -1;
      requestAnimationFrame(() => {
        const pos = tokenStart.current < 0 ? next.length : 0;
        void pos;
        el.focus();
      });
    };

    return (
      <div className={cx("msr-Mention", className)}>
        <textarea
          ref={(node) => {
            taRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
          }}
          className="msr-Mention__textarea"
          rows={rows}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            detectTrigger(e.target);
          }}
          onClick={(e) => detectTrigger(e.currentTarget)}
          onKeyDown={(e) => {
            if (query == null || matches.length === 0) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % matches.length); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i - 1 + matches.length) % matches.length); }
            else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); insert(matches[active]); }
            else if (e.key === "Escape") { setQuery(null); }
          }}
          {...rest}
        />
        {query != null && matches.length > 0 && (
          <ul className="msr-Mention__list" role="listbox">
            {matches.map((opt, i) => (
              <li
                key={opt.id}
                role="option"
                aria-selected={i === active}
                data-active={i === active || undefined}
                className="msr-Mention__option"
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => { e.preventDefault(); insert(opt); }}
              >
                <span className="msr-Mention__label">{opt.label}</span>
                {opt.detail && <span className="msr-Mention__detail">{opt.detail}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);
