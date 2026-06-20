import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Avatar } from "../Avatar";

export interface Comment {
  id: string;
  author: string;
  avatarUrl?: string;
  /** ISO string or display string for the timestamp. */
  timestamp?: string;
  body: React.ReactNode;
  replies?: Comment[];
}

export interface CommentThreadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  comments: Comment[];
  /** Enable a reply affordance under each comment. */
  onReply?: (parentId: string, body: string) => void;
  /** Render a top-level composer; called on submit. */
  onSubmit?: (body: string) => void;
  composerPlaceholder?: string;
  /** Maximum nesting depth before flattening. */
  maxDepth?: number;
}

function CommentNode({
  comment,
  depth,
  maxDepth,
  onReply,
}: {
  comment: Comment;
  depth: number;
  maxDepth: number;
  onReply?: (parentId: string, body: string) => void;
}) {
  const [replying, setReplying] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onReply?.(comment.id, trimmed);
    setDraft("");
    setReplying(false);
  };

  return (
    <li className="msr-CommentThread__node">
      <div className="msr-CommentThread__row">
        <Avatar src={comment.avatarUrl} name={comment.author} size="sm" />
        <div className="msr-CommentThread__main">
          <div className="msr-CommentThread__meta">
            <span className="msr-CommentThread__author">{comment.author}</span>
            {comment.timestamp && <span className="msr-CommentThread__time">{comment.timestamp}</span>}
          </div>
          <div className="msr-CommentThread__body">{comment.body}</div>
          {onReply && (
            <button type="button" className="msr-CommentThread__reply" onClick={() => setReplying((r) => !r)}>
              <Icon name="reply" size={13} /> Reply
            </button>
          )}
          {replying && (
            <div className="msr-CommentThread__composer">
              <textarea
                className="msr-CommentThread__input"
                rows={2}
                value={draft}
                placeholder="Write a reply…"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
                }}
              />
              <button type="button" className="msr-CommentThread__send" onClick={submit} aria-label="Send reply">
                <Icon name="send" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
        <ul className="msr-CommentThread__children">
          {comment.replies.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReply={onReply}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Nested comment thread with inline reply composers. */
export const CommentThread = React.forwardRef<HTMLDivElement, CommentThreadProps>(function CommentThread(
  { comments, onReply, onSubmit, composerPlaceholder = "Add a comment…", maxDepth = 4, className, ...rest },
  ref,
) {
  const [draft, setDraft] = React.useState("");

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setDraft("");
  };

  return (
    <div ref={ref} className={cx("msr-CommentThread", className)} {...rest}>
      {onSubmit && (
        <div className="msr-CommentThread__composer msr-CommentThread__composer--root">
          <textarea
            className="msr-CommentThread__input"
            rows={2}
            value={draft}
            placeholder={composerPlaceholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
            }}
          />
          <button type="button" className="msr-CommentThread__send" onClick={submit} aria-label="Post comment">
            <Icon name="send" size={16} />
          </button>
        </div>
      )}
      <ul className="msr-CommentThread__list">
        {comments.map((c) => (
          <CommentNode key={c.id} comment={c} depth={0} maxDepth={maxDepth} onReply={onReply} />
        ))}
      </ul>
    </div>
  );
});
