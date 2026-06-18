import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useControllableState } from "../../lib/useControllableState";

export interface InlineEditProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called when an edit is committed (blur/Enter). */
  onCommit?: (value: string) => void;
  placeholder?: string;
  /** Use a textarea instead of an input. */
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Click-to-edit text that swaps between a display label and a field. */
export function InlineEdit({
  value,
  defaultValue = "",
  onValueChange,
  onCommit,
  placeholder = "Empty",
  multiline = false,
  disabled,
  className,
}: InlineEditProps) {
  const [val, setVal] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(val);
  const fieldRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const start = () => {
    if (disabled) return;
    setDraft(val);
    setEditing(true);
  };
  const commit = () => {
    setVal(draft);
    onCommit?.(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(val);
    setEditing(false);
  };

  React.useEffect(() => {
    if (editing) {
      fieldRef.current?.focus();
      fieldRef.current?.select?.();
    }
  }, [editing]);

  if (editing) {
    const commonProps = {
      ref: fieldRef,
      className: "msr-InlineEdit__field",
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") cancel();
        else if (e.key === "Enter" && !multiline) { e.preventDefault(); commit(); }
      },
    };
    return (
      <span className={cx("msr-InlineEdit", "msr-InlineEdit--editing", className)}>
        {multiline ? <textarea {...commonProps} rows={3} /> : <input {...commonProps} />}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={cx("msr-InlineEdit", className)}
      data-empty={!val || undefined}
      data-disabled={disabled || undefined}
      onClick={start}
    >
      <span className="msr-InlineEdit__text">{val || placeholder}</span>
      {!disabled && <Icon name="settings" size={13} className="msr-InlineEdit__hint" />}
    </button>
  );
}
