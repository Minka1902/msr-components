import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* RetryActionButton                                                   */
/* ------------------------------------------------------------------ */

export interface RetryActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Number of attempts made so far (shown as a hint). */
  attempts?: number;
  /** Disable + show countdown while a backoff is active (seconds). */
  cooldown?: number;
  retrying?: boolean;
  label?: string;
}

/** Standard retry button for failed jobs, imports, API calls or syncs. */
export const RetryActionButton = React.forwardRef<
  HTMLButtonElement,
  RetryActionButtonProps
>(function RetryActionButton(
  { attempts, cooldown, retrying, label = "Retry", className, disabled, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx("msr-Retry", className)}
      data-retrying={retrying || undefined}
      disabled={disabled || retrying || (cooldown != null && cooldown > 0)}
      {...rest}
    >
      <span className="msr-Retry__icon" aria-hidden="true">
        ↻
      </span>
      {children ??
        (retrying
          ? "Retrying…"
          : cooldown != null && cooldown > 0
            ? `Retry in ${cooldown}s`
            : label)}
      {attempts != null && attempts > 0 && (
        <span className="msr-Retry__attempts">·{attempts}</span>
      )}
    </button>
  );
});

/* ------------------------------------------------------------------ */
/* BackgroundJobMonitor                                                */
/* ------------------------------------------------------------------ */

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "canceled";

export interface BackgroundJob {
  id: string;
  name: React.ReactNode;
  status: JobStatus;
  /** 0–100, used for running jobs. */
  progress?: number;
  startedAt?: string | Date;
  error?: React.ReactNode;
}

export interface BackgroundJobMonitorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  jobs: BackgroundJob[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  /** Group jobs by status with section headers. */
  grouped?: boolean;
}

const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  canceled: "Canceled",
};

const JOB_ORDER: JobStatus[] = [
  "running",
  "queued",
  "failed",
  "completed",
  "canceled",
];

function JobRow({
  job,
  onRetry,
  onCancel,
}: {
  job: BackgroundJob;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  return (
    <li className="msr-Jobs__item" data-status={job.status}>
      <span className="msr-Jobs__badge" data-status={job.status}>
        {JOB_STATUS_LABEL[job.status]}
      </span>
      <div className="msr-Jobs__main">
        <div className="msr-Jobs__name">{job.name}</div>
        {job.status === "running" && job.progress != null && (
          <div className="msr-Jobs__track">
            <div
              className="msr-Jobs__fill"
              style={{ width: `${Math.max(0, Math.min(100, job.progress))}%` }}
            />
          </div>
        )}
        {job.status === "failed" && job.error && (
          <div className="msr-Jobs__error">{job.error}</div>
        )}
      </div>
      <div className="msr-Jobs__actions">
        {job.status === "failed" && onRetry && (
          <button type="button" onClick={() => onRetry(job.id)}>
            Retry
          </button>
        )}
        {(job.status === "queued" || job.status === "running") && onCancel && (
          <button
            type="button"
            className="msr-Jobs__cancel"
            onClick={() => onCancel(job.id)}
          >
            Cancel
          </button>
        )}
      </div>
    </li>
  );
}

/** Shows queued, running, completed, failed and canceled background jobs. */
export const BackgroundJobMonitor = React.forwardRef<
  HTMLDivElement,
  BackgroundJobMonitorProps
>(function BackgroundJobMonitor(
  { jobs, onRetry, onCancel, grouped, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Jobs", className)} {...rest}>
      {jobs.length === 0 ? (
        <div className="msr-Jobs__empty">No background jobs.</div>
      ) : grouped ? (
        JOB_ORDER.map((status) => {
          const group = jobs.filter((j) => j.status === status);
          if (group.length === 0) return null;
          return (
            <div key={status} className="msr-Jobs__group">
              <div className="msr-Jobs__groupTitle">
                {JOB_STATUS_LABEL[status]} ({group.length})
              </div>
              <ul className="msr-Jobs__list">
                {group.map((j) => (
                  <JobRow
                    key={j.id}
                    job={j}
                    onRetry={onRetry}
                    onCancel={onCancel}
                  />
                ))}
              </ul>
            </div>
          );
        })
      ) : (
        <ul className="msr-Jobs__list">
          {jobs.map((j) => (
            <JobRow key={j.id} job={j} onRetry={onRetry} onCancel={onCancel} />
          ))}
        </ul>
      )}
    </div>
  );
});
