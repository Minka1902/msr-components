import * as React from "react";
import { cx } from "../../lib/cx";
import { Tag } from "../Tag/Tag";

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Prevent duplicate tags (default true). */
  unique?: boolean;
  /** Max number of tags. */
  max?: number;
  /** Keys that commit the current text as a tag. */
  separators?: string[];
}

/** Free-form tag/token entry (type + Enter to add, Backspace to remove). */
export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(function TagInput(
  {
    value,
    defaultValue,
    onValueChange,
    placeholder = "Add tag…",
    disabled,
    unique = true,
    max,
    separators = ["Enter", ","],
    className,
    ...rest
  },
  ref,
) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? []);
  const tags = controlled ? (value ?? []) : internal;
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commit = (next: string[]) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (unique && tags.includes(t)) { setDraft(""); return; }
    if (max && tags.length >= max) return;
    commit([...tags, t]);
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (separators.includes(e.key)) {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && tags.length) {
      commit(tags.slice(0, -1));
    }
  };

  return (
    <div
      ref={ref}
      className={cx("msr-TagInput", className)}
      data-disabled={disabled || undefined}
      onClick={() => inputRef.current?.focus()}
      {...rest}
    >
      {tags.map((t) => (
        <Tag key={t} size="sm" tone="primary" onRemove={disabled ? undefined : () => commit(tags.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
      <input
        ref={inputRef}
        className="msr-TagInput__input"
        value={draft}
        disabled={disabled}
        placeholder={tags.length === 0 ? placeholder : ""}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => addTag(draft)}
      />
    </div>
  );
});
