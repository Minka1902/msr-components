import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { Avatar } from "../Avatar/Avatar";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  /** Message body (string or rich nodes, e.g. <MarkdownRenderer/>). */
  children: React.ReactNode;
  name?: string;
  avatar?: string;
  avatarIcon?: React.ReactNode;
  timestamp?: React.ReactNode;
  /** Show a typing/streaming caret. */
  streaming?: boolean;
  /** Action row under the bubble (e.g. copy / regenerate). */
  actions?: React.ReactNode;
}

/** A single chat message bubble with role-based alignment/style. */
export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(
    { role, children, name, avatar, avatarIcon, timestamp, streaming, actions, className, ...rest },
    ref,
  ) {
    const showAvatar = role !== "user";
    return (
      <div ref={ref} className={cx("msr-ChatMsg", className)} data-role={role} {...rest}>
        {showAvatar && (
          <div className="msr-ChatMsg__avatar">
            <Avatar size="sm" name={name ?? role} src={avatar} fallback={avatarIcon} />
          </div>
        )}
        <div className="msr-ChatMsg__main">
          {(name || timestamp) && (
            <div className="msr-ChatMsg__meta">
              {name && <span className="msr-ChatMsg__name">{name}</span>}
              {timestamp && <span className="msr-ChatMsg__time">{timestamp}</span>}
            </div>
          )}
          <div className="msr-ChatMsg__bubble">
            {children}
            {streaming && <span className="msr-ChatMsg__caret" aria-hidden="true" />}
          </div>
          {actions && <div className="msr-ChatMsg__actions">{actions}</div>}
        </div>
      </div>
    );
  },
);

export interface ChatThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Auto-scroll to the bottom when children change. */
  autoScroll?: boolean;
}

/** Scrollable container that keeps the latest message in view. */
export const ChatThread = React.forwardRef<HTMLDivElement, ChatThreadProps>(
  function ChatThread({ autoScroll = true, className, children, ...rest }, ref) {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
      if (autoScroll && innerRef.current) {
        innerRef.current.scrollTop = innerRef.current.scrollHeight;
      }
    });
    return (
      <div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cx("msr-ChatThread", className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export type ToolCallStatus = "pending" | "running" | "success" | "error";

export interface ToolCallCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  status?: ToolCallStatus;
  /** Tool arguments (rendered as code). */
  input?: React.ReactNode;
  /** Tool result (rendered as code/content). */
  output?: React.ReactNode;
  defaultOpen?: boolean;
}

const STATUS_ICON: Record<ToolCallStatus, IconName> = {
  pending: "clock",
  running: "spinner",
  success: "checkCircle",
  error: "alert",
};

/** Collapsible card showing an agent tool call: name, status, input, output. */
export const ToolCallCard = React.forwardRef<HTMLDivElement, ToolCallCardProps>(
  function ToolCallCard({ name, status = "success", input, output, defaultOpen = false, className, ...rest }, ref) {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
      <div ref={ref} className={cx("msr-ToolCall", className)} data-status={status} {...rest}>
        <button type="button" className="msr-ToolCall__header" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="msr-ToolCall__status" data-spin={status === "running" || undefined}>
            <Icon name={STATUS_ICON[status]} size={15} />
          </span>
          <span className="msr-ToolCall__name">{name}</span>
          <span className="msr-ToolCall__chevron" data-open={open || undefined}>
            <Icon name="chevronRight" size={14} />
          </span>
        </button>
        {open && (input != null || output != null) && (
          <div className="msr-ToolCall__body">
            {input != null && (
              <div className="msr-ToolCall__section">
                <span className="msr-ToolCall__label">Input</span>
                <pre className="msr-ToolCall__code">{input}</pre>
              </div>
            )}
            {output != null && (
              <div className="msr-ToolCall__section">
                <span className="msr-ToolCall__label">Output</span>
                <pre className="msr-ToolCall__code">{output}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

export interface TokenUsageMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  used: number;
  max: number;
  label?: string;
}

/** Compact context/token budget meter. */
export const TokenUsageMeter = React.forwardRef<HTMLDivElement, TokenUsageMeterProps>(
  function TokenUsageMeter({ used, max, label = "Context", className, ...rest }, ref) {
    const pct = Math.max(0, Math.min(100, (used / (max || 1)) * 100));
    const tone = pct > 90 ? "danger" : pct > 70 ? "warning" : "ok";
    return (
      <div ref={ref} className={cx("msr-TokenMeter", className)} data-tone={tone} {...rest}>
        <div className="msr-TokenMeter__head">
          <span className="msr-TokenMeter__label">{label}</span>
          <span className="msr-TokenMeter__count">
            {used.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
        <div className="msr-TokenMeter__track">
          <span className="msr-TokenMeter__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  },
);
