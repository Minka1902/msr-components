import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* AgentPermissionPrompt                                               */
/* ------------------------------------------------------------------ */

export type AgentActionRisk = "low" | "medium" | "high";

export interface AgentPermissionPromptProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  /** What the agent wants to do. */
  action: React.ReactNode;
  /** e.g. the command, file path or API endpoint. */
  detail?: React.ReactNode;
  risk?: AgentActionRisk;
  onAllow?: () => void;
  onDeny?: () => void;
  allowLabel?: string;
  denyLabel?: string;
  /** Offer a "always allow" affordance. */
  onAlwaysAllow?: () => void;
}

/** Asks for confirmation before the agent performs a sensitive action. */
export const AgentPermissionPrompt = React.forwardRef<
  HTMLDivElement,
  AgentPermissionPromptProps
>(function AgentPermissionPrompt(
  {
    title = "Agent requests permission",
    action,
    detail,
    risk = "medium",
    onAllow,
    onDeny,
    onAlwaysAllow,
    allowLabel = "Allow",
    denyLabel = "Deny",
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-AgentPerm", className)}
      data-risk={risk}
      role="alertdialog"
      aria-label={typeof title === "string" ? title : "Agent permission"}
      {...rest}
    >
      <div className="msr-AgentPerm__head">
        <span className="msr-AgentPerm__icon" aria-hidden="true">
          🔐
        </span>
        <span className="msr-AgentPerm__title">{title}</span>
        <span className="msr-AgentPerm__risk" data-risk={risk}>
          {risk} risk
        </span>
      </div>
      <div className="msr-AgentPerm__action">{action}</div>
      {detail && (
        <pre className="msr-AgentPerm__detail">
          <code>{detail}</code>
        </pre>
      )}
      <div className="msr-AgentPerm__actions">
        <button
          type="button"
          className="msr-AgentPerm__deny"
          onClick={onDeny}
        >
          {denyLabel}
        </button>
        {onAlwaysAllow && (
          <button
            type="button"
            className="msr-AgentPerm__always"
            onClick={onAlwaysAllow}
          >
            Always allow
          </button>
        )}
        <button
          type="button"
          className="msr-AgentPerm__allow"
          onClick={onAllow}
        >
          {allowLabel}
        </button>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* AgentMemoryViewer                                                   */
/* ------------------------------------------------------------------ */

export interface MemoryItem {
  id: string;
  category?: string;
  content: React.ReactNode;
  /** Relevance 0–1, used for an indicator. */
  relevance?: number;
  pinned?: boolean;
}

export interface AgentMemoryViewerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: MemoryItem[];
  onForget?: (id: string) => void;
  onPin?: (id: string) => void;
}

/** Shows saved context/preferences/decisions the agent may use. */
export const AgentMemoryViewer = React.forwardRef<
  HTMLDivElement,
  AgentMemoryViewerProps
>(function AgentMemoryViewer({ items, onForget, onPin, className, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("msr-AgentMemory", className)} {...rest}>
      {items.length === 0 ? (
        <div className="msr-AgentMemory__empty">No memory entries.</div>
      ) : (
        <ul className="msr-AgentMemory__list">
          {items.map((m) => (
            <li
              key={m.id}
              className="msr-AgentMemory__item"
              data-pinned={m.pinned || undefined}
            >
              <div className="msr-AgentMemory__body">
                {m.category && (
                  <span className="msr-AgentMemory__cat">{m.category}</span>
                )}
                <span className="msr-AgentMemory__content">{m.content}</span>
              </div>
              <div className="msr-AgentMemory__side">
                {m.relevance != null && (
                  <span
                    className="msr-AgentMemory__relevance"
                    title={`Relevance ${Math.round(m.relevance * 100)}%`}
                  >
                    {Math.round(m.relevance * 100)}%
                  </span>
                )}
                {onPin && (
                  <button
                    type="button"
                    aria-label={m.pinned ? "Unpin" : "Pin"}
                    onClick={() => onPin(m.id)}
                    className="msr-AgentMemory__pin"
                    data-pinned={m.pinned || undefined}
                  >
                    ⌖
                  </button>
                )}
                {onForget && (
                  <button
                    type="button"
                    aria-label="Forget"
                    onClick={() => onForget(m.id)}
                    className="msr-AgentMemory__forget"
                  >
                    ×
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* RunAgainButton                                                      */
/* ------------------------------------------------------------------ */

export interface RunAgainButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  busy?: boolean;
  /** Render a small menu of variant actions (modified parameters…). */
  variants?: Array<{ label: string; onSelect: () => void }>;
}

/** Re-runs a workflow with the same (or modified) input/settings. */
export const RunAgainButton = React.forwardRef<
  HTMLButtonElement,
  RunAgainButtonProps
>(function RunAgainButton(
  { label = "Run again", busy, variants, className, children, ...rest },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="msr-RunAgain">
      <button
        ref={ref}
        type="button"
        className={cx("msr-RunAgain__btn", className)}
        data-busy={busy || undefined}
        disabled={busy}
        {...rest}
      >
        <span className="msr-RunAgain__icon" aria-hidden="true">
          ↻
        </span>
        {children ?? (busy ? "Running…" : label)}
      </button>
      {variants && variants.length > 0 && (
        <span className="msr-RunAgain__menuWrap">
          <button
            type="button"
            className="msr-RunAgain__caret"
            aria-label="More run options"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            ▾
          </button>
          {open && (
            <ul className="msr-RunAgain__menu">
              {variants.map((v, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      v.onSelect();
                      setOpen(false);
                    }}
                  >
                    {v.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </span>
      )}
    </span>
  );
});

/* ------------------------------------------------------------------ */
/* HumanApprovalGate                                                   */
/* ------------------------------------------------------------------ */

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface HumanApprovalGateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onChange"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The next action awaiting approval. */
  preview?: React.ReactNode;
  status?: ApprovalStatus;
  /** Allow editing the next action before approval. */
  comment?: string;
  onComment?: (comment: string) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

/** Pauses a workflow until a human approves/rejects/comments. */
export const HumanApprovalGate = React.forwardRef<
  HTMLDivElement,
  HumanApprovalGateProps
>(function HumanApprovalGate(
  {
    title = "Approval required",
    description,
    preview,
    status = "pending",
    comment,
    onComment,
    onApprove,
    onReject,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Approval", className)}
      data-status={status}
      {...rest}
    >
      <div className="msr-Approval__head">
        <span className="msr-Approval__title">{title}</span>
        <span className="msr-Approval__status" data-status={status}>
          {status}
        </span>
      </div>
      {description && (
        <p className="msr-Approval__desc">{description}</p>
      )}
      {preview && <div className="msr-Approval__preview">{preview}</div>}
      {status === "pending" && (
        <>
          {onComment && (
            <textarea
              className="msr-Approval__comment"
              rows={2}
              placeholder="Add a comment (optional)…"
              value={comment ?? ""}
              onChange={(e) => onComment(e.target.value)}
            />
          )}
          <div className="msr-Approval__actions">
            <button
              type="button"
              className="msr-Approval__reject"
              onClick={onReject}
            >
              Reject
            </button>
            <button
              type="button"
              className="msr-Approval__approve"
              onClick={onApprove}
            >
              Approve
            </button>
          </div>
        </>
      )}
    </div>
  );
});
