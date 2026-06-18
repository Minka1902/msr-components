import * as React from "react";
import { cx } from "../../lib/cx";

export interface DiffViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  oldText: string;
  newText: string;
  /** "unified" (default) or "split" side-by-side. */
  mode?: "unified" | "split";
  oldLabel?: string;
  newLabel?: string;
}

type DiffOp = { type: "eq" | "del" | "ins"; text: string };

/** LCS-based line diff. */
function diffLines(a: string[], b: string[]): DiffOp[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ type: "eq", text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { ops.push({ type: "del", text: a[i] }); i++; }
    else { ops.push({ type: "ins", text: b[j] }); j++; }
  }
  while (i < n) ops.push({ type: "del", text: a[i++] });
  while (j < m) ops.push({ type: "ins", text: b[j++] });
  return ops;
}

/** Side-by-side / unified text diff with add/remove highlighting. */
export const DiffViewer = React.forwardRef<HTMLDivElement, DiffViewerProps>(function DiffViewer(
  { oldText, newText, mode = "unified", oldLabel = "Before", newLabel = "After", className, ...rest },
  ref,
) {
  const ops = React.useMemo(
    () => diffLines(oldText.split("\n"), newText.split("\n")),
    [oldText, newText],
  );
  const added = ops.filter((o) => o.type === "ins").length;
  const removed = ops.filter((o) => o.type === "del").length;

  return (
    <div ref={ref} className={cx("msr-Diff", className)} data-mode={mode} {...rest}>
      <div className="msr-Diff__header">
        <span className="msr-Diff__stat msr-Diff__stat--add">+{added}</span>
        <span className="msr-Diff__stat msr-Diff__stat--del">−{removed}</span>
        {mode === "split" && (
          <span className="msr-Diff__labels">
            <span>{oldLabel}</span>
            <span>{newLabel}</span>
          </span>
        )}
      </div>
      {mode === "unified" ? (
        <pre className="msr-Diff__body">
          {ops.map((op, i) => (
            <div key={i} className="msr-Diff__line" data-type={op.type}>
              <span className="msr-Diff__sign">{op.type === "ins" ? "+" : op.type === "del" ? "−" : " "}</span>
              <span className="msr-Diff__text">{op.text || " "}</span>
            </div>
          ))}
        </pre>
      ) : (
        <div className="msr-Diff__split">
          <pre className="msr-Diff__col">
            {ops.filter((o) => o.type !== "ins").map((op, i) => (
              <div key={i} className="msr-Diff__line" data-type={op.type === "del" ? "del" : "eq"}>
                <span className="msr-Diff__text">{op.text || " "}</span>
              </div>
            ))}
          </pre>
          <pre className="msr-Diff__col">
            {ops.filter((o) => o.type !== "del").map((op, i) => (
              <div key={i} className="msr-Diff__line" data-type={op.type === "ins" ? "ins" : "eq"}>
                <span className="msr-Diff__text">{op.text || " "}</span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
});
