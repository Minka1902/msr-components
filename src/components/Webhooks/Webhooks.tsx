import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* WebhookManager                                                      */
/* ------------------------------------------------------------------ */

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  description?: string;
}

export interface WebhookManagerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  webhooks: Webhook[];
  onCreate?: () => void;
  onEdit?: (webhook: Webhook) => void;
  onDelete?: (id: string) => void;
  onTest?: (webhook: Webhook) => void;
  onToggle?: (id: string, enabled: boolean) => void;
}

/** Create, list, edit, test, enable/disable and delete webhooks. */
export const WebhookManager = React.forwardRef<HTMLDivElement, WebhookManagerProps>(
  function WebhookManager(
    { webhooks, onCreate, onEdit, onDelete, onTest, onToggle, className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-Webhooks", className)} {...rest}>
        <div className="msr-Webhooks__head">
          <span className="msr-Webhooks__title">Webhooks</span>
          {onCreate && (
            <button
              type="button"
              className="msr-Webhooks__create"
              onClick={onCreate}
            >
              + Add webhook
            </button>
          )}
        </div>
        {webhooks.length === 0 ? (
          <div className="msr-Webhooks__empty">No webhooks configured.</div>
        ) : (
          <ul className="msr-Webhooks__list">
            {webhooks.map((w) => (
              <li key={w.id} className="msr-Webhooks__item">
                <div className="msr-Webhooks__main">
                  <div className="msr-Webhooks__url">
                    <code>{w.url}</code>
                    <span
                      className="msr-Webhooks__state"
                      data-enabled={w.enabled || undefined}
                    >
                      {w.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  {w.description && (
                    <div className="msr-Webhooks__desc">{w.description}</div>
                  )}
                  <div className="msr-Webhooks__events">
                    {w.events.map((e) => (
                      <span key={e} className="msr-Webhooks__event">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="msr-Webhooks__actions">
                  {onToggle && (
                    <button
                      type="button"
                      onClick={() => onToggle(w.id, !w.enabled)}
                    >
                      {w.enabled ? "Disable" : "Enable"}
                    </button>
                  )}
                  {onTest && (
                    <button type="button" onClick={() => onTest(w)}>
                      Test
                    </button>
                  )}
                  {onEdit && (
                    <button type="button" onClick={() => onEdit(w)}>
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className="msr-Webhooks__delete"
                      onClick={() => onDelete(w.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* WebhookEventViewer                                                  */
/* ------------------------------------------------------------------ */

export interface WebhookDelivery {
  id: string;
  event: string;
  timestamp: string | Date;
  statusCode?: number;
  success: boolean;
  retries?: number;
  payload?: unknown;
  response?: string;
}

export interface WebhookEventViewerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  deliveries: WebhookDelivery[];
  /** Controlled expanded delivery id. */
  expandedId?: string;
  onExpand?: (id: string | null) => void;
}

/** Displays webhook delivery attempts, payloads, codes and failures. */
export const WebhookEventViewer = React.forwardRef<
  HTMLDivElement,
  WebhookEventViewerProps
>(function WebhookEventViewer(
  { deliveries, expandedId, onExpand, className, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState<string | null>(null);
  const expanded = expandedId !== undefined ? expandedId : internal;
  const toggle = (id: string) => {
    const next = expanded === id ? null : id;
    setInternal(next);
    onExpand?.(next);
  };
  return (
    <div ref={ref} className={cx("msr-WebhookEvents", className)} {...rest}>
      <ul className="msr-WebhookEvents__list">
        {deliveries.map((d) => {
          const date =
            typeof d.timestamp === "string"
              ? new Date(d.timestamp)
              : d.timestamp;
          const open = expanded === d.id;
          return (
            <li key={d.id} className="msr-WebhookEvents__item">
              <button
                type="button"
                className="msr-WebhookEvents__row"
                aria-expanded={open}
                onClick={() => toggle(d.id)}
              >
                <span
                  className="msr-WebhookEvents__status"
                  data-success={d.success || undefined}
                >
                  {d.statusCode ?? (d.success ? "OK" : "ERR")}
                </span>
                <span className="msr-WebhookEvents__event">{d.event}</span>
                {d.retries != null && d.retries > 0 && (
                  <span className="msr-WebhookEvents__retries">
                    {d.retries} retr{d.retries === 1 ? "y" : "ies"}
                  </span>
                )}
                <span className="msr-WebhookEvents__time">
                  {date.toLocaleString()}
                </span>
                <span className="msr-WebhookEvents__chevron" data-open={open || undefined}>
                  ›
                </span>
              </button>
              {open && (
                <div className="msr-WebhookEvents__detail">
                  {d.payload !== undefined && (
                    <div>
                      <div className="msr-WebhookEvents__detailLabel">
                        Payload
                      </div>
                      <pre>{JSON.stringify(d.payload, null, 2)}</pre>
                    </div>
                  )}
                  {d.response && (
                    <div>
                      <div className="msr-WebhookEvents__detailLabel">
                        Response
                      </div>
                      <pre>{d.response}</pre>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});
