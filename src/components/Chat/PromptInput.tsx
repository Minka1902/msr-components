import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface PromptInputProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Submit handler; receives the current text. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Show a loading/streaming state on the send button. */
  loading?: boolean;
  maxRows?: number;
  /** Toolbar/attachments rendered to the left of the send button. */
  toolbar?: React.ReactNode;
  sendLabel?: string;
}

/** Auto-growing chat composer with ⌘/Ctrl+Enter to send. */
export const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  function PromptInput(
    { value, defaultValue = "", onValueChange, onSubmit, placeholder = "Send a message…", disabled, loading, maxRows = 8, toolbar, sendLabel = "Send", className, ...rest },
    ref,
  ) {
    const [internal, setInternal] = React.useState(defaultValue);
    const text = value ?? internal;
    const taRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setText = (v: string) => {
      if (value === undefined) setInternal(v);
      onValueChange?.(v);
    };

    const resize = React.useCallback(() => {
      const el = taRef.current;
      if (!el) return;
      el.style.height = "auto";
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
      el.style.height = `${Math.min(el.scrollHeight, lh * maxRows)}px`;
    }, [maxRows]);

    React.useEffect(resize, [text, resize]);

    const submit = () => {
      const t = text.trim();
      if (!t || disabled || loading) return;
      onSubmit?.(t);
      if (value === undefined) setInternal("");
    };

    return (
      <form
        className={cx("msr-Prompt", className)}
        data-disabled={disabled || undefined}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        {...rest}
      >
        <textarea
          ref={(node) => {
            taRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
          }}
          className="msr-Prompt__textarea"
          rows={1}
          placeholder={placeholder}
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="msr-Prompt__footer">
          <div className="msr-Prompt__toolbar">{toolbar}</div>
          <button
            type="submit"
            className="msr-Prompt__send"
            aria-label={sendLabel}
            disabled={disabled || loading || !text.trim()}
            data-loading={loading || undefined}
          >
            <Icon name={loading ? "spinner" : "arrowUp"} size={18} />
          </button>
        </div>
      </form>
    );
  },
);
