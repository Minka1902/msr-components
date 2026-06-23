import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* StatusDot                                                           */
/* ------------------------------------------------------------------ */

export type StatusTone =
  | "online"
  | "offline"
  | "busy"
  | "away"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  label?: React.ReactNode;
  /** Add a pulsing ring (e.g. for "live"). */
  pulse?: boolean;
  size?: "sm" | "md" | "lg";
}

/** Colored status dot with optional label and pulse. */
export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  function StatusDot(
    { tone = "neutral", label, pulse, size = "md", className, ...rest },
    ref,
  ) {
    return (
      <span
        ref={ref}
        className={cx("msr-StatusDot", className)}
        data-tone={tone}
        data-size={size}
        {...rest}
      >
        <span
          className="msr-StatusDot__dot"
          data-pulse={pulse || undefined}
          aria-hidden="true"
        />
        {label && <span className="msr-StatusDot__label">{label}</span>}
      </span>
    );
  },
);

/* ------------------------------------------------------------------ */
/* HealthIndicator                                                     */
/* ------------------------------------------------------------------ */

export type HealthStatus =
  | "operational"
  | "degraded"
  | "partial-outage"
  | "major-outage"
  | "maintenance";

export interface HealthIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  status: HealthStatus;
  label?: React.ReactNode;
}

const HEALTH_LABEL: Record<HealthStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  "partial-outage": "Partial outage",
  "major-outage": "Major outage",
  maintenance: "Maintenance",
};

/** Service-health pill (operational / degraded / outage / maintenance). */
export const HealthIndicator = React.forwardRef<
  HTMLSpanElement,
  HealthIndicatorProps
>(function HealthIndicator({ status, label, className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      className={cx("msr-Health", className)}
      data-status={status}
      {...rest}
    >
      <span className="msr-Health__dot" aria-hidden="true" />
      {label ?? HEALTH_LABEL[status]}
    </span>
  );
});

/* ------------------------------------------------------------------ */
/* ServiceStatusList                                                   */
/* ------------------------------------------------------------------ */

export interface ServiceStatus {
  id: string;
  name: React.ReactNode;
  status: HealthStatus;
  description?: React.ReactNode;
}

export interface ServiceStatusListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  services: ServiceStatus[];
  /** Show an overall summary header derived from the worst status. */
  showSummary?: boolean;
}

const HEALTH_RANK: Record<HealthStatus, number> = {
  operational: 0,
  maintenance: 1,
  degraded: 2,
  "partial-outage": 3,
  "major-outage": 4,
};

/** Status-page style list of services and their health. */
export const ServiceStatusList = React.forwardRef<
  HTMLDivElement,
  ServiceStatusListProps
>(function ServiceStatusList(
  { services, showSummary = true, className, ...rest },
  ref,
) {
  const worst = services.reduce<HealthStatus>(
    (acc, s) => (HEALTH_RANK[s.status] > HEALTH_RANK[acc] ? s.status : acc),
    "operational",
  );
  const allOk = services.every((s) => s.status === "operational");
  return (
    <div ref={ref} className={cx("msr-ServiceStatus", className)} {...rest}>
      {showSummary && (
        <div className="msr-ServiceStatus__summary" data-status={worst}>
          <span className="msr-Health__dot" aria-hidden="true" />
          {allOk ? "All systems operational" : HEALTH_LABEL[worst]}
        </div>
      )}
      <ul className="msr-ServiceStatus__list">
        {services.map((s) => (
          <li key={s.id} className="msr-ServiceStatus__item">
            <div className="msr-ServiceStatus__main">
              <span className="msr-ServiceStatus__name">{s.name}</span>
              {s.description && (
                <span className="msr-ServiceStatus__desc">{s.description}</span>
              )}
            </div>
            <HealthIndicator status={s.status} />
          </li>
        ))}
      </ul>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Heartbeat                                                           */
/* ------------------------------------------------------------------ */

export interface HeartbeatProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Whether the source is currently live. */
  live?: boolean;
  label?: React.ReactNode;
  /** Last-seen time shown when not live. */
  lastSeen?: Date | string;
}

/** Live "pulsing" indicator with optional last-seen fallback. */
export const Heartbeat = React.forwardRef<HTMLSpanElement, HeartbeatProps>(
  function Heartbeat(
    { live = true, label, lastSeen, className, ...rest },
    ref,
  ) {
    const seen =
      lastSeen && (typeof lastSeen === "string" ? new Date(lastSeen) : lastSeen);
    return (
      <span
        ref={ref}
        className={cx("msr-Heartbeat", className)}
        data-live={live || undefined}
        {...rest}
      >
        <span className="msr-Heartbeat__pulse" aria-hidden="true">
          <span className="msr-Heartbeat__core" />
        </span>
        <span className="msr-Heartbeat__label">
          {label ?? (live ? "Live" : "Offline")}
          {!live && seen && (
            <span className="msr-Heartbeat__seen">
              {" "}
              · last seen {seen.toLocaleTimeString()}
            </span>
          )}
        </span>
      </span>
    );
  },
);

/* ------------------------------------------------------------------ */
/* IncidentBanner                                                      */
/* ------------------------------------------------------------------ */

export type IncidentSeverity = "info" | "minor" | "major" | "critical";

export interface IncidentBannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  severity?: IncidentSeverity;
  /** Latest update time. */
  updatedAt?: Date | string;
  /** Link to the full incident / status page. */
  href?: string;
  linkLabel?: string;
  onDismiss?: () => void;
  children?: React.ReactNode;
}

/** Active-incident banner with severity, latest-update time and a link. */
export const IncidentBanner = React.forwardRef<
  HTMLDivElement,
  IncidentBannerProps
>(function IncidentBanner(
  {
    title,
    severity = "minor",
    updatedAt,
    href,
    linkLabel = "View status",
    onDismiss,
    children,
    className,
    ...rest
  },
  ref,
) {
  const updated =
    updatedAt && (typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt);
  return (
    <div
      ref={ref}
      className={cx("msr-Incident", className)}
      data-severity={severity}
      role="alert"
      {...rest}
    >
      <span className="msr-Incident__icon" aria-hidden="true">
        {severity === "critical" || severity === "major" ? "⛔" : "⚠"}
      </span>
      <div className="msr-Incident__body">
        <div className="msr-Incident__title">{title}</div>
        {children && <div className="msr-Incident__desc">{children}</div>}
        {updated && (
          <div className="msr-Incident__time">
            Updated {updated.toLocaleString()}
          </div>
        )}
      </div>
      {href && (
        <a
          className="msr-Incident__link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkLabel}
        </a>
      )}
      {onDismiss && (
        <button
          type="button"
          className="msr-Incident__dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          ×
        </button>
      )}
    </div>
  );
});
