import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* Shared step status                                                  */
/* ------------------------------------------------------------------ */

export type AgentStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "awaiting-approval";

const STATUS_LABEL: Record<AgentStepStatus, string> = {
  pending: "Pending",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  skipped: "Skipped",
  "awaiting-approval": "Awaiting approval",
};

const STATUS_ICON: Record<AgentStepStatus, string> = {
  pending: "○",
  running: "◐",
  completed: "✓",
  failed: "✕",
  skipped: "⤼",
  "awaiting-approval": "⏸",
};

/* ------------------------------------------------------------------ */
/* AgentStepCard                                                       */
/* ------------------------------------------------------------------ */

export interface AgentStepCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  status: AgentStepStatus;
  /** Optional index displayed before the title. */
  index?: number;
  /** Actions (approve/reject/retry…). */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

/** A single AI workflow step with status. */
export const AgentStepCard = React.forwardRef<HTMLDivElement, AgentStepCardProps>(
  function AgentStepCard(
    { title, description, status, index, actions, children, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-AgentStep", className)}
        data-status={status}
        {...rest}
      >
        <div className="msr-AgentStep__head">
          <span
            className="msr-AgentStep__icon"
            data-status={status}
            aria-hidden="true"
          >
            {STATUS_ICON[status]}
          </span>
          <div className="msr-AgentStep__titles">
            <div className="msr-AgentStep__title">
              {index != null && (
                <span className="msr-AgentStep__index">{index}.</span>
              )}{" "}
              {title}
            </div>
            {description && (
              <div className="msr-AgentStep__desc">{description}</div>
            )}
          </div>
          <span className="msr-AgentStep__badge" data-status={status}>
            {STATUS_LABEL[status]}
          </span>
        </div>
        {children && <div className="msr-AgentStep__body">{children}</div>}
        {actions && <div className="msr-AgentStep__actions">{actions}</div>}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* AgentPlanViewer                                                     */
/* ------------------------------------------------------------------ */

export interface AgentPlanStep {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  status: AgentStepStatus;
  blocked?: boolean;
}

export interface AgentPlanViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  steps: AgentPlanStep[];
}

/** Displays the agent's execution plan with steps, statuses and progress. */
export const AgentPlanViewer = React.forwardRef<
  HTMLDivElement,
  AgentPlanViewerProps
>(function AgentPlanViewer({ title = "Plan", steps, className, ...rest }, ref) {
  const done = steps.filter((s) => s.status === "completed").length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  return (
    <div ref={ref} className={cx("msr-AgentPlan", className)} {...rest}>
      <div className="msr-AgentPlan__head">
        <span className="msr-AgentPlan__title">{title}</span>
        <span className="msr-AgentPlan__progress">
          {done}/{steps.length} ({pct}%)
        </span>
      </div>
      <div
        className="msr-AgentPlan__track"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="msr-AgentPlan__fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="msr-AgentPlan__steps">
        {steps.map((s) => (
          <li
            key={s.id}
            className="msr-AgentPlan__step"
            data-status={s.status}
            data-blocked={s.blocked || undefined}
          >
            <span
              className="msr-AgentStep__icon"
              data-status={s.status}
              aria-hidden="true"
            >
              {STATUS_ICON[s.status]}
            </span>
            <div className="msr-AgentPlan__stepBody">
              <span className="msr-AgentPlan__stepTitle">{s.title}</span>
              {s.description && (
                <span className="msr-AgentPlan__stepDesc">{s.description}</span>
              )}
            </div>
            {s.blocked && (
              <span className="msr-AgentPlan__blocked">Blocked</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* AgentRunTimeline                                                    */
/* ------------------------------------------------------------------ */

export type TimelineEventType =
  | "prompt"
  | "reasoning"
  | "tool-call"
  | "command"
  | "file-change"
  | "error"
  | "output";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: React.ReactNode;
  content?: React.ReactNode;
  timestamp?: string | Date;
}

export interface AgentRunTimelineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[];
}

const EVENT_GLYPH: Record<TimelineEventType, string> = {
  prompt: "›",
  reasoning: "✻",
  "tool-call": "⚙",
  command: "$",
  "file-change": "✎",
  error: "!",
  output: "▣",
};

/** Chronological timeline of an agent run. */
export const AgentRunTimeline = React.forwardRef<
  HTMLDivElement,
  AgentRunTimelineProps
>(function AgentRunTimeline({ events, className, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("msr-AgentTimeline", className)} {...rest}>
      <ol className="msr-AgentTimeline__list">
        {events.map((e) => (
          <li
            key={e.id}
            className="msr-AgentTimeline__event"
            data-type={e.type}
          >
            <span className="msr-AgentTimeline__glyph" aria-hidden="true">
              {EVENT_GLYPH[e.type]}
            </span>
            <div className="msr-AgentTimeline__body">
              <div className="msr-AgentTimeline__title">
                {e.title}
                {e.timestamp && (
                  <span className="msr-AgentTimeline__time">
                    {(typeof e.timestamp === "string"
                      ? new Date(e.timestamp)
                      : e.timestamp
                    ).toLocaleTimeString()}
                  </span>
                )}
              </div>
              {e.content && (
                <div className="msr-AgentTimeline__content">{e.content}</div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ToolResultViewer                                                    */
/* ------------------------------------------------------------------ */

export type ToolResultKind =
  | "json"
  | "logs"
  | "text"
  | "table"
  | "error";

export interface ToolResultViewerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  kind: ToolResultKind;
  /** Tool/label name shown in the header. */
  name?: React.ReactNode;
  /** Payload: object for json/table, string for logs/text/error. */
  data: unknown;
  /** Columns for `table`; inferred when omitted. */
  columns?: string[];
  collapsible?: boolean;
}

/** Renders structured tool outputs (JSON, logs, tables, errors…). */
export const ToolResultViewer = React.forwardRef<
  HTMLDivElement,
  ToolResultViewerProps
>(function ToolResultViewer(
  { kind, name, data, columns, collapsible, className, ...rest },
  ref,
) {
  const [open, setOpen] = React.useState(true);
  let body: React.ReactNode;

  if (kind === "json") {
    body = (
      <pre className="msr-ToolResult__pre">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    );
  } else if (kind === "logs" || kind === "text") {
    body = <pre className="msr-ToolResult__pre">{String(data)}</pre>;
  } else if (kind === "error") {
    body = <pre className="msr-ToolResult__error">{String(data)}</pre>;
  } else {
    // table
    const rows = (Array.isArray(data) ? data : []) as Array<
      Record<string, unknown>
    >;
    const cols = columns ?? (rows[0] ? Object.keys(rows[0]) : []);
    body = (
      <div className="msr-ToolResult__tableWrap">
        <table className="msr-ToolResult__table">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td key={c}>
                    {row[c] == null ? "" : String(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cx("msr-ToolResult", className)}
      data-kind={kind}
      {...rest}
    >
      <div className="msr-ToolResult__head">
        <span className="msr-ToolResult__name">
          {name ?? "Result"}
          <span className="msr-ToolResult__kind">{kind}</span>
        </span>
        {collapsible && (
          <button
            type="button"
            className="msr-ToolResult__toggle"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {(!collapsible || open) && (
        <div className="msr-ToolResult__body">{body}</div>
      )}
    </div>
  );
});
