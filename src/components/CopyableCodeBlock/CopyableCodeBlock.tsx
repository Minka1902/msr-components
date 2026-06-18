import * as React from "react";
import { useClipboard } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface CopyableCodeBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  code: string;
  /** Language label shown in the header (purely informational). */
  language?: string;
  /** Optional filename/title shown in the header. */
  title?: string;
  /** Show line numbers in the gutter. */
  showLineNumbers?: boolean;
  /** Hide the copy button. */
  hideCopy?: boolean;
  /** Wrap long lines instead of scrolling horizontally. */
  wrap?: boolean;
}

/**
 * Code block with a copy-to-clipboard button and optional line numbers.
 * Highlighting is intentionally left to the consumer (bring your own
 * highlighter) to keep the library dependency-free; raw text renders cleanly.
 */
export const CopyableCodeBlock = React.forwardRef<
  HTMLDivElement,
  CopyableCodeBlockProps
>(function CopyableCodeBlock(
  {
    code,
    language,
    title,
    showLineNumbers = false,
    hideCopy = false,
    wrap = false,
    className,
    ...rest
  },
  ref,
) {
  const [copy, copied] = useClipboard();
  const lines = code.replace(/\n$/, "").split("\n");

  return (
    <div
      ref={ref}
      className={cx("msr-CodeBlock", className)}
      data-wrap={wrap || undefined}
      {...rest}
    >
      {(title || language || !hideCopy) && (
        <div className="msr-CodeBlock__header">
          <span className="msr-CodeBlock__title">{title}</span>
          <div className="msr-CodeBlock__meta">
            {language && <span className="msr-CodeBlock__lang">{language}</span>}
            {!hideCopy && (
              <button
                type="button"
                className="msr-CodeBlock__copy"
                onClick={() => void copy(code)}
                aria-label={copied ? "Copied" : "Copy code"}
              >
                <Icon name={copied ? "check" : "copy"} size={14} />
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>
        </div>
      )}
      <pre className="msr-CodeBlock__pre">
        <code className="msr-CodeBlock__code">
          {lines.map((line, i) => (
            <span className="msr-CodeBlock__line" key={i}>
              {showLineNumbers && (
                <span className="msr-CodeBlock__gutter" aria-hidden="true">
                  {i + 1}
                </span>
              )}
              <span className="msr-CodeBlock__content">{line || " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
});
