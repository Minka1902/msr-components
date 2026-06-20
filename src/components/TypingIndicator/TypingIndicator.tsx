import * as React from "react";
import { cx } from "../../lib/cx";

export interface TypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Names of people currently typing. */
  users?: string[];
  /** Show only the animated dots (no text). */
  dotsOnly?: boolean;
  size?: "sm" | "md";
}

function summarize(users: string[]): string {
  if (users.length === 0) return "Someone is typing";
  if (users.length === 1) return `${users[0]} is typing`;
  if (users.length === 2) return `${users[0]} and ${users[1]} are typing`;
  return `${users[0]}, ${users[1]} and ${users.length - 2} more are typing`;
}

/** Animated "user is typing…" indicator for chat/collaboration UIs. */
export const TypingIndicator = React.forwardRef<HTMLDivElement, TypingIndicatorProps>(function TypingIndicator(
  { users = [], dotsOnly = false, size = "md", className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-TypingIndicator", className)}
      data-size={size}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className="msr-TypingIndicator__dots" aria-hidden="true">
        <span className="msr-TypingIndicator__dot" />
        <span className="msr-TypingIndicator__dot" />
        <span className="msr-TypingIndicator__dot" />
      </span>
      {!dotsOnly && <span className="msr-TypingIndicator__text">{summarize(users)}</span>}
    </div>
  );
});
