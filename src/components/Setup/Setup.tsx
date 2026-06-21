import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* SetupRequirementCard                                                */
/* ------------------------------------------------------------------ */

export type RequirementState = "complete" | "incomplete" | "in-progress";

export interface SetupRequirementCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  state: RequirementState;
  /** Action button label. */
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

/** Shows one setup requirement, its state, description and action. */
export const SetupRequirementCard = React.forwardRef<
  HTMLDivElement,
  SetupRequirementCardProps
>(function SetupRequirementCard(
  { title, description, state, actionLabel, onAction, icon, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-SetupReq", className)}
      data-state={state}
      {...rest}
    >
      <span className="msr-SetupReq__icon" data-state={state} aria-hidden="true">
        {icon ?? (state === "complete" ? "✓" : state === "in-progress" ? "◐" : "○")}
      </span>
      <div className="msr-SetupReq__body">
        <div className="msr-SetupReq__title">{title}</div>
        {description && (
          <div className="msr-SetupReq__desc">{description}</div>
        )}
      </div>
      {state !== "complete" && actionLabel && onAction && (
        <button
          type="button"
          className="msr-SetupReq__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SetupBlockerList                                                    */
/* ------------------------------------------------------------------ */

export interface SetupBlocker {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  severity?: "error" | "warning";
  actionLabel?: string;
  onAction?: () => void;
}

export interface SetupBlockerListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  blockers: SetupBlocker[];
  /** Shown when there are no blockers. */
  clearMessage?: React.ReactNode;
}

/** Lists all blockers preventing a feature from going live. */
export const SetupBlockerList = React.forwardRef<
  HTMLDivElement,
  SetupBlockerListProps
>(function SetupBlockerList(
  {
    title = "Blockers",
    blockers,
    clearMessage = "No blockers — you're good to go.",
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Blockers", className)} {...rest}>
      <div className="msr-Blockers__head">
        {title}
        <span className="msr-Blockers__count" data-empty={blockers.length === 0 || undefined}>
          {blockers.length}
        </span>
      </div>
      {blockers.length === 0 ? (
        <div className="msr-Blockers__clear">
          <span aria-hidden="true">✓</span> {clearMessage}
        </div>
      ) : (
        <ul className="msr-Blockers__list">
          {blockers.map((b) => (
            <li
              key={b.id}
              className="msr-Blockers__item"
              data-severity={b.severity ?? "error"}
            >
              <span className="msr-Blockers__dot" aria-hidden="true" />
              <div className="msr-Blockers__text">
                <div className="msr-Blockers__title">{b.title}</div>
                {b.description && (
                  <div className="msr-Blockers__desc">{b.description}</div>
                )}
              </div>
              {b.actionLabel && b.onAction && (
                <button
                  type="button"
                  className="msr-Blockers__action"
                  onClick={b.onAction}
                >
                  {b.actionLabel}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* PublishReadinessPanel                                               */
/* ------------------------------------------------------------------ */

export interface ReadinessCheck {
  id: string;
  label: React.ReactNode;
  status: "pass" | "fail" | "warn";
  detail?: React.ReactNode;
}

export interface PublishReadinessPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  checks: ReadinessCheck[];
  onPublish?: () => void;
  publishLabel?: string;
  publishing?: boolean;
}

/** Shows whether something is ready to publish, with checklist and action. */
export const PublishReadinessPanel = React.forwardRef<
  HTMLDivElement,
  PublishReadinessPanelProps
>(function PublishReadinessPanel(
  {
    title = "Publish readiness",
    checks,
    onPublish,
    publishLabel = "Publish",
    publishing,
    className,
    ...rest
  },
  ref,
) {
  const failures = checks.filter((c) => c.status === "fail").length;
  const ready = failures === 0;
  return (
    <div
      ref={ref}
      className={cx("msr-Readiness", className)}
      data-ready={ready || undefined}
      {...rest}
    >
      <div className="msr-Readiness__head">
        <span className="msr-Readiness__title">{title}</span>
        <span
          className="msr-Readiness__status"
          data-ready={ready || undefined}
        >
          {ready ? "Ready" : `${failures} blocker${failures === 1 ? "" : "s"}`}
        </span>
      </div>
      <ul className="msr-Readiness__checks">
        {checks.map((c) => (
          <li
            key={c.id}
            className="msr-Readiness__check"
            data-status={c.status}
          >
            <span className="msr-Readiness__glyph" aria-hidden="true">
              {c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✕"}
            </span>
            <div className="msr-Readiness__text">
              <span>{c.label}</span>
              {c.detail && (
                <span className="msr-Readiness__detail">{c.detail}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {onPublish && (
        <button
          type="button"
          className="msr-Readiness__publish"
          disabled={!ready || publishing}
          onClick={onPublish}
        >
          {publishing ? "Publishing…" : publishLabel}
        </button>
      )}
    </div>
  );
});
