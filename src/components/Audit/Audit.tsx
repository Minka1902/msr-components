import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* AuditLogTable                                                       */
/* ------------------------------------------------------------------ */

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target?: string;
  timestamp: string | Date;
  source?: string;
  /** Optional before/after detail. */
  changes?: Array<{ field: string; from?: string; to?: string }>;
}

export interface AuditLogTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  entries: AuditLogEntry[];
  emptyText?: React.ReactNode;
}

function fmtTime(t: string | Date): string {
  const d = typeof t === "string" ? new Date(t) : t;
  if (Number.isNaN(d.getTime())) return String(t);
  return d.toLocaleString();
}

/** Tabular log of who changed what, when and from where. */
export const AuditLogTable = React.forwardRef<HTMLDivElement, AuditLogTableProps>(
  function AuditLogTable(
    { entries, emptyText = "No activity recorded.", className, ...rest },
    ref,
  ) {
    if (entries.length === 0) {
      return (
        <div ref={ref} className={cx("msr-AuditLog", className)} {...rest}>
          <div className="msr-AuditLog__empty">{emptyText}</div>
        </div>
      );
    }
    return (
      <div ref={ref} className={cx("msr-AuditLog", className)} {...rest}>
        <table className="msr-AuditLog__table">
          <thead>
            <tr>
              <th>When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Target</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="msr-AuditLog__time">{fmtTime(e.timestamp)}</td>
                <td>
                  <span className="msr-AuditLog__actor">{e.actor}</span>
                </td>
                <td>
                  <span className="msr-AuditLog__action">{e.action}</span>
                  {e.changes && e.changes.length > 0 && (
                    <ul className="msr-AuditLog__changes">
                      {e.changes.map((c, i) => (
                        <li key={i}>
                          <code>{c.field}</code>: <del>{c.from ?? "∅"}</del> →{" "}
                          <ins>{c.to ?? "∅"}</ins>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td>{e.target}</td>
                <td className="msr-AuditLog__source">{e.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* EntityActivityFeed                                                  */
/* ------------------------------------------------------------------ */

export interface ActivityItem {
  id: string;
  actor?: string;
  icon?: React.ReactNode;
  /** Main line, e.g. "updated the status to Active". */
  text: React.ReactNode;
  timestamp: string | Date;
  meta?: React.ReactNode;
}

export interface EntityActivityFeedProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[];
  emptyText?: React.ReactNode;
}

/** Chronological activity feed for a single entity. */
export const EntityActivityFeed = React.forwardRef<
  HTMLDivElement,
  EntityActivityFeedProps
>(function EntityActivityFeed(
  { items, emptyText = "No activity yet.", className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-ActivityFeed", className)} {...rest}>
      {items.length === 0 ? (
        <div className="msr-ActivityFeed__empty">{emptyText}</div>
      ) : (
        <ol className="msr-ActivityFeed__list">
          {items.map((it) => (
            <li key={it.id} className="msr-ActivityFeed__item">
              <span className="msr-ActivityFeed__marker" aria-hidden="true">
                {it.icon ?? <span className="msr-ActivityFeed__dot" />}
              </span>
              <div className="msr-ActivityFeed__body">
                <div className="msr-ActivityFeed__text">
                  {it.actor && (
                    <span className="msr-ActivityFeed__actor">{it.actor}</span>
                  )}{" "}
                  {it.text}
                </div>
                <div className="msr-ActivityFeed__time">
                  {fmtTime(it.timestamp)}
                  {it.meta && (
                    <span className="msr-ActivityFeed__meta"> · {it.meta}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ObjectInspectorPanel                                                */
/* ------------------------------------------------------------------ */

export interface ObjectInspectorPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Key-value metadata shown at the top. */
  metadata?: Array<{ label: string; value: React.ReactNode }>;
  /** Raw object rendered as formatted JSON. */
  data?: unknown;
  /** Related entities/links. */
  relationships?: Array<{ label: string; value: React.ReactNode }>;
  actions?: React.ReactNode;
  onClose?: () => void;
}

/** Side panel showing structured details for the selected object. */
export const ObjectInspectorPanel = React.forwardRef<
  HTMLDivElement,
  ObjectInspectorPanelProps
>(function ObjectInspectorPanel(
  {
    title,
    subtitle,
    metadata,
    data,
    relationships,
    actions,
    onClose,
    className,
    ...rest
  },
  ref,
) {
  return (
    <aside
      ref={ref}
      className={cx("msr-Inspector", className)}
      aria-label="Object inspector"
      {...rest}
    >
      <header className="msr-Inspector__head">
        <div>
          {title && <div className="msr-Inspector__title">{title}</div>}
          {subtitle && (
            <div className="msr-Inspector__subtitle">{subtitle}</div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            className="msr-Inspector__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </header>
      {metadata && metadata.length > 0 && (
        <dl className="msr-Inspector__meta">
          {metadata.map((m, i) => (
            <div key={i} className="msr-Inspector__metaRow">
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {relationships && relationships.length > 0 && (
        <div className="msr-Inspector__section">
          <div className="msr-Inspector__sectionTitle">Relationships</div>
          <dl className="msr-Inspector__meta">
            {relationships.map((r, i) => (
              <div key={i} className="msr-Inspector__metaRow">
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {data !== undefined && (
        <div className="msr-Inspector__section">
          <div className="msr-Inspector__sectionTitle">JSON</div>
          <pre className="msr-Inspector__json">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      )}
      {actions && <div className="msr-Inspector__actions">{actions}</div>}
    </aside>
  );
});
