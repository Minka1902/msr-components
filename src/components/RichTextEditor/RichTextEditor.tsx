import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface RichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Controlled HTML value. */
  value?: string;
  defaultValue?: string;
  /** Fired with the editor's HTML on every change. */
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Which toolbar commands to show. */
  toolbar?: ToolbarCommand[];
  disabled?: boolean;
}

type ToolbarCommand = "bold" | "italic" | "underline" | "ul" | "ol" | "link" | "clear";

const COMMANDS: Record<ToolbarCommand, { icon: IconName; label: string; run: () => void }> = {
  bold: { icon: "check", label: "Bold", run: () => document.execCommand("bold") },
  italic: { icon: "check", label: "Italic", run: () => document.execCommand("italic") },
  underline: { icon: "check", label: "Underline", run: () => document.execCommand("underline") },
  ul: { icon: "check", label: "Bullet list", run: () => document.execCommand("insertUnorderedList") },
  ol: { icon: "check", label: "Numbered list", run: () => document.execCommand("insertOrderedList") },
  link: {
    icon: "link",
    label: "Link",
    run: () => {
      const url = window.prompt("Link URL");
      if (url) document.execCommand("createLink", false, url);
    },
  },
  clear: { icon: "close", label: "Clear formatting", run: () => document.execCommand("removeFormat") },
};

const TOOLBAR_LABELS: Partial<Record<ToolbarCommand, string>> = {
  bold: "B",
  italic: "I",
  underline: "U",
  ul: "•",
  ol: "1.",
};

const DEFAULT_TOOLBAR: ToolbarCommand[] = ["bold", "italic", "underline", "ul", "ol", "link", "clear"];

/**
 * Lightweight rich-text editor (contentEditable + execCommand toolbar) that
 * emits HTML. Dependency-free; suitable for simple comment/notes fields.
 */
export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(
  function RichTextEditor(
    { value, defaultValue = "", onChange, placeholder = "Write something…", toolbar = DEFAULT_TOOLBAR, disabled, className, ...rest },
    ref,
  ) {
    const editorRef = React.useRef<HTMLDivElement | null>(null);

    // Initialize / sync controlled value without clobbering the caret.
    React.useEffect(() => {
      const el = editorRef.current;
      if (el && value !== undefined && el.innerHTML !== value) {
        el.innerHTML = value;
      }
    }, [value]);

    React.useEffect(() => {
      const el = editorRef.current;
      if (el && value === undefined && defaultValue) el.innerHTML = defaultValue;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const emit = () => onChange?.(editorRef.current?.innerHTML ?? "");

    return (
      <div ref={ref} className={cx("msr-RTE", className)} data-disabled={disabled || undefined} {...rest}>
        <div className="msr-RTE__toolbar" role="toolbar">
          {toolbar.map((cmd) => (
            <button
              key={cmd}
              type="button"
              className="msr-RTE__btn"
              data-cmd={cmd}
              title={COMMANDS[cmd].label}
              aria-label={COMMANDS[cmd].label}
              disabled={disabled}
              onMouseDown={(e) => {
                e.preventDefault(); // keep selection
                COMMANDS[cmd].run();
                emit();
              }}
            >
              {TOOLBAR_LABELS[cmd] ?? <Icon name={COMMANDS[cmd].icon} size={14} />}
            </button>
          ))}
        </div>
        <div
          ref={editorRef}
          className="msr-RTE__editor"
          contentEditable={!disabled}
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder}
          suppressContentEditableWarning
          onInput={emit}
        />
      </div>
    );
  },
);
