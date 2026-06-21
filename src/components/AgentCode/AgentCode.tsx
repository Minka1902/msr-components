import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* GeneratedCodePreview                                                */
/* ------------------------------------------------------------------ */

export interface GeneratedCodePreviewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  filename?: string;
  language?: string;
  /** Show line numbers in the gutter. */
  lineNumbers?: boolean;
  /** Render a unified diff instead of plain code (lines prefixed +/-). */
  diff?: boolean;
}

/** Shows generated code with filename, language label and a copy button. */
export const GeneratedCodePreview = React.forwardRef<
  HTMLDivElement,
  GeneratedCodePreviewProps
>(function GeneratedCodePreview(
  { code, filename, language, lineNumbers, diff, className, ...rest },
  ref,
) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div ref={ref} className={cx("msr-CodePreview", className)} {...rest}>
      <div className="msr-CodePreview__head">
        <span className="msr-CodePreview__file">
          {filename ?? "snippet"}
          {language && (
            <span className="msr-CodePreview__lang">{language}</span>
          )}
        </span>
        <button
          type="button"
          className="msr-CodePreview__copy"
          onClick={copy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="msr-CodePreview__pre" data-diff={diff || undefined}>
        <code>
          {lines.map((line, i) => {
            const sign = diff ? line[0] : undefined;
            const lineType =
              diff && sign === "+"
                ? "add"
                : diff && sign === "-"
                  ? "del"
                  : undefined;
            return (
              <span
                key={i}
                className="msr-CodePreview__line"
                data-line={lineType}
              >
                {lineNumbers && (
                  <span className="msr-CodePreview__num">{i + 1}</span>
                )}
                <span className="msr-CodePreview__text">{line || " "}</span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* FileChangeList                                                      */
/* ------------------------------------------------------------------ */

export type FileChangeType =
  | "added"
  | "modified"
  | "deleted"
  | "renamed"
  | "moved";

export interface FileChange {
  path: string;
  type: FileChangeType;
  /** From path for renamed/moved. */
  from?: string;
  additions?: number;
  deletions?: number;
}

export interface FileChangeListProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "onSelect"> {
  changes: FileChange[];
  onSelect?: (change: FileChange) => void;
  selectedPath?: string;
}

const CHANGE_GLYPH: Record<FileChangeType, string> = {
  added: "A",
  modified: "M",
  deleted: "D",
  renamed: "R",
  moved: "→",
};

/** Lists files created/edited/deleted/renamed by an agent. */
export const FileChangeList = React.forwardRef<
  HTMLUListElement,
  FileChangeListProps
>(function FileChangeList(
  { changes, onSelect, selectedPath, className, ...rest },
  ref,
) {
  return (
    <ul ref={ref} className={cx("msr-FileChanges", className)} {...rest}>
      {changes.map((c) => {
        const Comp = onSelect ? "button" : "div";
        return (
          <li key={c.path} className="msr-FileChanges__item">
            <Comp
              type={onSelect ? "button" : undefined}
              className="msr-FileChanges__row"
              data-selected={c.path === selectedPath || undefined}
              onClick={onSelect ? () => onSelect(c) : undefined}
            >
              <span
                className="msr-FileChanges__glyph"
                data-type={c.type}
                aria-label={c.type}
              >
                {CHANGE_GLYPH[c.type]}
              </span>
              <span className="msr-FileChanges__path">
                {c.from && (
                  <span className="msr-FileChanges__from">{c.from} → </span>
                )}
                {c.path}
              </span>
              <span className="msr-FileChanges__stats">
                {c.additions != null && (
                  <span className="msr-FileChanges__add">+{c.additions}</span>
                )}
                {c.deletions != null && (
                  <span className="msr-FileChanges__del">−{c.deletions}</span>
                )}
              </span>
            </Comp>
          </li>
        );
      })}
    </ul>
  );
});

/* ------------------------------------------------------------------ */
/* PatchReviewPanel                                                    */
/* ------------------------------------------------------------------ */

export interface PatchFile {
  path: string;
  type?: FileChangeType;
  /** Unified diff text (lines prefixed with +/-/space). */
  diff: string;
  riskNote?: string;
}

export interface PatchReviewPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  files: PatchFile[];
  onAccept?: (paths: string[]) => void;
  onReject?: (paths: string[]) => void;
}

/** Review generated code changes before applying them. */
export const PatchReviewPanel = React.forwardRef<
  HTMLDivElement,
  PatchReviewPanelProps
>(function PatchReviewPanel(
  { files, onAccept, onReject, className, ...rest },
  ref,
) {
  const [accepted, setAccepted] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(files.map((f) => [f.path, true])),
  );
  const toggle = (path: string) =>
    setAccepted((a) => ({ ...a, [path]: !a[path] }));
  const acceptedPaths = files.filter((f) => accepted[f.path]).map((f) => f.path);

  return (
    <div ref={ref} className={cx("msr-PatchReview", className)} {...rest}>
      <div className="msr-PatchReview__files">
        {files.map((f) => (
          <div key={f.path} className="msr-PatchReview__file">
            <div className="msr-PatchReview__fileHead">
              <label className="msr-PatchReview__check">
                <input
                  type="checkbox"
                  checked={Boolean(accepted[f.path])}
                  onChange={() => toggle(f.path)}
                />
                <span className="msr-PatchReview__path">{f.path}</span>
              </label>
              {f.riskNote && (
                <span className="msr-PatchReview__risk">⚠ {f.riskNote}</span>
              )}
            </div>
            <pre className="msr-PatchReview__diff">
              <code>
                {f.diff
                  .replace(/\n$/, "")
                  .split("\n")
                  .map((line, i) => {
                    const sign = line[0];
                    const type =
                      sign === "+" ? "add" : sign === "-" ? "del" : undefined;
                    return (
                      <span
                        key={i}
                        className="msr-PatchReview__line"
                        data-line={type}
                      >
                        {line || " "}
                      </span>
                    );
                  })}
              </code>
            </pre>
          </div>
        ))}
      </div>
      <div className="msr-PatchReview__actions">
        <button
          type="button"
          className="msr-PatchReview__reject"
          onClick={() => onReject?.(files.map((f) => f.path))}
        >
          Reject all
        </button>
        <button
          type="button"
          className="msr-PatchReview__accept"
          disabled={acceptedPaths.length === 0}
          onClick={() => onAccept?.(acceptedPaths)}
        >
          Apply {acceptedPaths.length} file
          {acceptedPaths.length === 1 ? "" : "s"}
        </button>
      </div>
    </div>
  );
});
