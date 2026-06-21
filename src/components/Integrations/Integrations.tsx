import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* IntegrationCard                                                     */
/* ------------------------------------------------------------------ */

export type ConnectionState =
  | "connected"
  | "disconnected"
  | "error"
  | "connecting";

export interface IntegrationCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  name: React.ReactNode;
  description?: React.ReactNode;
  /** Provider logo/icon. */
  logo?: React.ReactNode;
  state: ConnectionState;
  error?: React.ReactNode;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onConfigure?: () => void;
}

const CONN_LABEL: Record<ConnectionState, string> = {
  connected: "Connected",
  disconnected: "Not connected",
  error: "Error",
  connecting: "Connecting…",
};

/** Shows one integration with status, provider, connection state and errors. */
export const IntegrationCard = React.forwardRef<
  HTMLDivElement,
  IntegrationCardProps
>(function IntegrationCard(
  {
    name,
    description,
    logo,
    state,
    error,
    onConnect,
    onDisconnect,
    onConfigure,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-Integration", className)}
      data-state={state}
      {...rest}
    >
      <div className="msr-Integration__head">
        {logo && <div className="msr-Integration__logo">{logo}</div>}
        <div className="msr-Integration__titles">
          <div className="msr-Integration__name">{name}</div>
          {description && (
            <div className="msr-Integration__desc">{description}</div>
          )}
        </div>
        <span className="msr-Integration__status" data-state={state}>
          <span className="msr-Integration__dot" aria-hidden="true" />
          {CONN_LABEL[state]}
        </span>
      </div>
      {state === "error" && error && (
        <div className="msr-Integration__error">{error}</div>
      )}
      <div className="msr-Integration__actions">
        {state === "connected" ? (
          <>
            {onConfigure && (
              <button
                type="button"
                className="msr-Integration__btn"
                onClick={onConfigure}
              >
                Configure
              </button>
            )}
            {onDisconnect && (
              <button
                type="button"
                className="msr-Integration__btn msr-Integration__btn--danger"
                onClick={onDisconnect}
              >
                Disconnect
              </button>
            )}
          </>
        ) : (
          onConnect && (
            <button
              type="button"
              className="msr-Integration__btn msr-Integration__btn--primary"
              disabled={state === "connecting"}
              onClick={onConnect}
            >
              {state === "error" ? "Reconnect" : "Connect"}
            </button>
          )
        )}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ConnectionTestButton                                                */
/* ------------------------------------------------------------------ */

export type TestStatus = "idle" | "testing" | "success" | "error";

export interface ConnectionTestButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "results"
  > {
  status: TestStatus;
  onTest: () => void;
  label?: string;
  /** Detail message shown next to the button after a test. */
  resultMessage?: React.ReactNode;
}

/** Tests a connection and reports success/failure details. */
export const ConnectionTestButton = React.forwardRef<
  HTMLButtonElement,
  ConnectionTestButtonProps
>(function ConnectionTestButton(
  { status, onTest, label = "Test connection", resultMessage, className, ...rest },
  ref,
) {
  return (
    <div className="msr-ConnTest">
      <button
        ref={ref}
        type="button"
        className={cx("msr-ConnTest__btn", className)}
        data-status={status}
        disabled={status === "testing"}
        onClick={onTest}
        {...rest}
      >
        {status === "testing" && (
          <span className="msr-ConnTest__spinner" aria-hidden="true" />
        )}
        {status === "testing" ? "Testing…" : label}
      </button>
      {(status === "success" || status === "error") && (
        <span className="msr-ConnTest__result" data-status={status}>
          <span aria-hidden="true">{status === "success" ? "✓" : "✕"}</span>
          {resultMessage ??
            (status === "success" ? "Connection OK" : "Connection failed")}
        </span>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SyncStatusCard                                                      */
/* ------------------------------------------------------------------ */

export type SyncState = "synced" | "syncing" | "error" | "pending";

export interface SyncStatusCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  state: SyncState;
  lastSync?: Date | string;
  nextSync?: Date | string;
  /** 0–100 progress while syncing. */
  progress?: number;
  error?: React.ReactNode;
  onRetry?: () => void;
  onSyncNow?: () => void;
}

function fmt(d?: Date | string): string | undefined {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? String(d) : date.toLocaleString();
}

/** Shows sync status, last/next sync, errors, retry and progress. */
export const SyncStatusCard = React.forwardRef<HTMLDivElement, SyncStatusCardProps>(
  function SyncStatusCard(
    {
      title = "Sync",
      state,
      lastSync,
      nextSync,
      progress,
      error,
      onRetry,
      onSyncNow,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-Sync", className)}
        data-state={state}
        {...rest}
      >
        <div className="msr-Sync__head">
          <span className="msr-Sync__title">{title}</span>
          <span className="msr-Sync__status" data-state={state}>
            {state}
          </span>
        </div>
        {state === "syncing" && progress != null && (
          <div className="msr-Sync__track">
            <div
              className="msr-Sync__fill"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}
        {state === "error" && error && (
          <div className="msr-Sync__error">{error}</div>
        )}
        <dl className="msr-Sync__meta">
          {lastSync && (
            <div>
              <dt>Last sync</dt>
              <dd>{fmt(lastSync)}</dd>
            </div>
          )}
          {nextSync && (
            <div>
              <dt>Next sync</dt>
              <dd>{fmt(nextSync)}</dd>
            </div>
          )}
        </dl>
        <div className="msr-Sync__actions">
          {state === "error" && onRetry && (
            <button
              type="button"
              className="msr-Sync__btn"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
          {onSyncNow && state !== "syncing" && (
            <button
              type="button"
              className="msr-Sync__btn msr-Sync__btn--primary"
              onClick={onSyncNow}
            >
              Sync now
            </button>
          )}
        </div>
      </div>
    );
  },
);
