import * as React from "react";
import { cx } from "../../lib/cx";
import type { InputTone } from "../Input/Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  tone?: InputTone;
  fullWidth?: boolean;
  /** Grow with content up to `maxRows` instead of scrolling. */
  autoResize?: boolean;
  maxRows?: number;
}

/** Multiline text field with optional auto-resize. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { tone = "default", fullWidth = false, autoResize = false, maxRows = 10, className, onChange, rows = 3, ...rest },
    ref,
  ) {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRef = (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    };

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
      el.style.height = `${Math.min(el.scrollHeight, lineHeight * maxRows)}px`;
    }, [autoResize, maxRows]);

    React.useEffect(resize, [resize]);

    return (
      <textarea
        ref={setRef}
        rows={rows}
        className={cx("msr-Textarea", className)}
        data-tone={tone}
        data-full-width={fullWidth || undefined}
        aria-invalid={tone === "danger" || undefined}
        onChange={(e) => {
          onChange?.(e);
          resize();
        }}
        {...rest}
      />
    );
  },
);
