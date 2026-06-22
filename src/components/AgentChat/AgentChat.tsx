import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* CitationList                                                        */
/* ------------------------------------------------------------------ */

export interface Citation {
  id: string;
  title: React.ReactNode;
  url?: string;
  snippet?: React.ReactNode;
  /** Source label, e.g. "docs", "web", "file". */
  source?: string;
  /** Relevance 0–1 for an optional indicator. */
  score?: number;
}

export interface CitationListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  citations: Citation[];
  /** Show 1-based reference numbers ([1], [2]…). */
  numbered?: boolean;
  onSelect?: (citation: Citation) => void;
}

/** Lists the sources/citations behind an AI answer (RAG). */
export const CitationList = React.forwardRef<HTMLDivElement, CitationListProps>(
  function CitationList(
    { citations, numbered = true, onSelect, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-Citations", className)} {...rest}>
        <div className="msr-Citations__head">
          {citations.length} source{citations.length === 1 ? "" : "s"}
        </div>
        <ol className="msr-Citations__list">
          {citations.map((c, i) => {
            const Comp: React.ElementType = c.url
              ? "a"
              : onSelect
                ? "button"
                : "div";
            return (
              <li key={c.id} className="msr-Citations__item">
                <Comp
                  href={c.url}
                  target={c.url ? "_blank" : undefined}
                  rel={c.url ? "noopener noreferrer" : undefined}
                  type={!c.url && onSelect ? "button" : undefined}
                  className="msr-Citations__link"
                  onClick={onSelect ? () => onSelect(c) : undefined}
                >
                  {numbered && (
                    <span className="msr-Citations__num">{i + 1}</span>
                  )}
                  <span className="msr-Citations__body">
                    <span className="msr-Citations__title">
                      {c.title}
                      {c.source && (
                        <span className="msr-Citations__source">{c.source}</span>
                      )}
                    </span>
                    {c.snippet && (
                      <span className="msr-Citations__snippet">{c.snippet}</span>
                    )}
                  </span>
                  {c.score != null && (
                    <span className="msr-Citations__score">
                      {Math.round(c.score * 100)}%
                    </span>
                  )}
                </Comp>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* ResponseFeedback                                                    */
/* ------------------------------------------------------------------ */

export type FeedbackValue = "up" | "down" | null;

export interface ResponseFeedbackProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: FeedbackValue;
  onChange?: (value: FeedbackValue) => void;
  /** Ask for a written reason after a thumbs-down. */
  askReason?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
  label?: React.ReactNode;
}

/** Thumbs up/down feedback for an AI response, with optional reason. */
export const ResponseFeedback = React.forwardRef<
  HTMLDivElement,
  ResponseFeedbackProps
>(function ResponseFeedback(
  {
    value = null,
    onChange,
    askReason,
    reason,
    onReasonChange,
    label = "Was this helpful?",
    className,
    ...rest
  },
  ref,
) {
  const set = (v: FeedbackValue) => onChange?.(value === v ? null : v);
  return (
    <div ref={ref} className={cx("msr-Feedback", className)} {...rest}>
      <div className="msr-Feedback__row">
        {label && <span className="msr-Feedback__label">{label}</span>}
        <button
          type="button"
          className="msr-Feedback__btn"
          data-active={value === "up" || undefined}
          aria-pressed={value === "up"}
          aria-label="Good response"
          onClick={() => set("up")}
        >
          👍
        </button>
        <button
          type="button"
          className="msr-Feedback__btn"
          data-active={value === "down" || undefined}
          aria-pressed={value === "down"}
          aria-label="Bad response"
          onClick={() => set("down")}
        >
          👎
        </button>
      </div>
      {askReason && value === "down" && (
        <textarea
          className="msr-Feedback__reason"
          rows={2}
          placeholder="What went wrong? (optional)"
          value={reason ?? ""}
          onChange={(e) => onReasonChange?.(e.target.value)}
        />
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SuggestedPrompts                                                    */
/* ------------------------------------------------------------------ */

export interface SuggestedPromptsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "title"> {
  prompts: Array<string | { id: string; label: React.ReactNode; value: string }>;
  onSelect?: (value: string) => void;
  title?: React.ReactNode;
}

/** Clickable prompt suggestion chips to seed a conversation. */
export const SuggestedPrompts = React.forwardRef<
  HTMLDivElement,
  SuggestedPromptsProps
>(function SuggestedPrompts({ prompts, onSelect, title, className, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("msr-Suggested", className)} {...rest}>
      {title && <div className="msr-Suggested__title">{title}</div>}
      <div className="msr-Suggested__chips">
        {prompts.map((p, i) => {
          const value = typeof p === "string" ? p : p.value;
          const label = typeof p === "string" ? p : p.label;
          const key = typeof p === "string" ? `${p}-${i}` : p.id;
          return (
            <button
              key={key}
              type="button"
              className="msr-Suggested__chip"
              onClick={() => onSelect?.(value)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* MessageActions                                                      */
/* ------------------------------------------------------------------ */

export interface MessageActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Text used by the built-in copy action. */
  copyText?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  /** Extra custom actions. */
  extra?: React.ReactNode;
}

/** Hover toolbar for a chat message: copy, regenerate, edit. */
export const MessageActions = React.forwardRef<
  HTMLDivElement,
  MessageActionsProps
>(function MessageActions(
  { copyText, onCopy, onRegenerate, onEdit, extra, className, ...rest },
  ref,
) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (copyText != null) {
      void navigator.clipboard?.writeText(copyText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
    onCopy?.();
  };
  return (
    <div
      ref={ref}
      className={cx("msr-MsgActions", className)}
      role="toolbar"
      aria-label="Message actions"
      {...rest}
    >
      {(copyText != null || onCopy) && (
        <button
          type="button"
          className="msr-MsgActions__btn"
          aria-label="Copy"
          onClick={copy}
        >
          {copied ? "✓" : "⧉"}
        </button>
      )}
      {onRegenerate && (
        <button
          type="button"
          className="msr-MsgActions__btn"
          aria-label="Regenerate"
          onClick={onRegenerate}
        >
          ↻
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          className="msr-MsgActions__btn"
          aria-label="Edit"
          onClick={onEdit}
        >
          ✎
        </button>
      )}
      {extra}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ConversationList                                                    */
/* ------------------------------------------------------------------ */

export interface ConversationSummary {
  id: string;
  title: React.ReactNode;
  preview?: React.ReactNode;
  timestamp?: string | Date;
  unread?: boolean;
}

export interface ConversationListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  conversations: ConversationSummary[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onNew?: () => void;
  onDelete?: (id: string) => void;
}

/** Sidebar list of past conversations/threads. */
export const ConversationList = React.forwardRef<
  HTMLDivElement,
  ConversationListProps
>(function ConversationList(
  { conversations, activeId, onSelect, onNew, onDelete, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Conversations", className)} {...rest}>
      {onNew && (
        <button
          type="button"
          className="msr-Conversations__new"
          onClick={onNew}
        >
          + New chat
        </button>
      )}
      <ul className="msr-Conversations__list">
        {conversations.map((c) => {
          const time =
            c.timestamp &&
            (typeof c.timestamp === "string"
              ? new Date(c.timestamp)
              : c.timestamp);
          return (
            <li key={c.id} className="msr-Conversations__item">
              <button
                type="button"
                className="msr-Conversations__select"
                data-active={c.id === activeId || undefined}
                onClick={() => onSelect?.(c.id)}
              >
                {c.unread && (
                  <span className="msr-Conversations__dot" aria-label="Unread" />
                )}
                <span className="msr-Conversations__text">
                  <span className="msr-Conversations__title">{c.title}</span>
                  {c.preview && (
                    <span className="msr-Conversations__preview">
                      {c.preview}
                    </span>
                  )}
                </span>
                {time && (
                  <span className="msr-Conversations__time">
                    {time.toLocaleDateString()}
                  </span>
                )}
              </button>
              {onDelete && (
                <button
                  type="button"
                  className="msr-Conversations__delete"
                  aria-label="Delete conversation"
                  onClick={() => onDelete(c.id)}
                >
                  ×
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});
