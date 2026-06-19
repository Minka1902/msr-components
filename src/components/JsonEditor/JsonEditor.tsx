import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface JsonEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  /** Fired with the parsed value when the text is valid JSON. */
  onValidChange?: (parsed: unknown) => void;
  rows?: number;
  /** Show a format/prettify button. */
  showFormat?: boolean;
  readOnly?: boolean;
}

/** Editable JSON text area with live validation and a prettify action. */
export const JsonEditor = React.forwardRef<HTMLTextAreaElement, JsonEditorProps>(
  function JsonEditor(
    { value, defaultValue = "{}", onChange, onValidChange, rows = 10, showFormat = true, readOnly, className, ...rest },
    ref,
  ) {
    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const text = controlled ? value! : internal;
    const taRef = React.useRef<HTMLTextAreaElement | null>(null);

    const error = React.useMemo(() => {
      if (!text.trim()) return null;
      try {
        JSON.parse(text);
        return null;
      } catch (e) {
        return (e as Error).message;
      }
    }, [text]);

    const update = (next: string) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
      try {
        onValidChange?.(JSON.parse(next));
      } catch {
        /* invalid — skip */
      }
    };

    const format = () => {
      try {
        update(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        /* can't format invalid JSON */
      }
    };

    return (
      <div className={cx("msr-JsonEditor", className)} data-invalid={error ? true : undefined} {...rest}>
        <div className="msr-JsonEditor__toolbar">
          <span className="msr-JsonEditor__status" data-valid={!error || undefined}>
            <Icon name={error ? "alert" : "checkCircle"} size={13} />
            {error ? "Invalid JSON" : "Valid"}
          </span>
          {showFormat && !readOnly && (
            <button type="button" className="msr-JsonEditor__format" onClick={format} disabled={!!error}>
              Format
            </button>
          )}
        </div>
        <textarea
          ref={(node) => {
            taRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
          }}
          className="msr-JsonEditor__textarea"
          spellCheck={false}
          rows={rows}
          readOnly={readOnly}
          value={text}
          onChange={(e) => update(e.target.value)}
        />
        {error && <div className="msr-JsonEditor__error">{error}</div>}
      </div>
    );
  },
);
