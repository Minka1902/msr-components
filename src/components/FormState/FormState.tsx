import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* AutoSaveStatus                                                      */
/* ------------------------------------------------------------------ */

export type AutoSaveState =
  | "idle"
  | "saving"
  | "saved"
  | "error"
  | "offline"
  | "retrying";

export interface AutoSaveStatusProps
  extends React.HTMLAttributes<HTMLDivElement> {
  state: AutoSaveState;
  /** When the last successful save happened. */
  lastSaved?: Date | string;
  /** Override the label text per state. */
  labels?: Partial<Record<AutoSaveState, string>>;
  onRetry?: () => void;
}

const DEFAULT_LABELS: Record<AutoSaveState, string> = {
  idle: "All changes saved",
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn’t save",
  offline: "Offline — changes not saved",
  retrying: "Retrying…",
};

/** Displays autosave state (saving, saved, failed, offline, retrying). */
export const AutoSaveStatus = React.forwardRef<HTMLDivElement, AutoSaveStatusProps>(
  function AutoSaveStatus(
    { state, lastSaved, labels, onRetry, className, ...rest },
    ref,
  ) {
    const label = labels?.[state] ?? DEFAULT_LABELS[state];
    const showTime = (state === "saved" || state === "idle") && lastSaved;
    const time =
      lastSaved &&
      (typeof lastSaved === "string" ? new Date(lastSaved) : lastSaved);
    return (
      <div
        ref={ref}
        className={cx("msr-AutoSave", className)}
        data-state={state}
        role="status"
        aria-live="polite"
        {...rest}
      >
        <span className="msr-AutoSave__icon" aria-hidden="true" />
        <span className="msr-AutoSave__label">{label}</span>
        {showTime && time && (
          <span className="msr-AutoSave__time">
            {time.toLocaleTimeString()}
          </span>
        )}
        {(state === "error" || state === "offline") && onRetry && (
          <button
            type="button"
            className="msr-AutoSave__retry"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* DraftRestoreBanner                                                  */
/* ------------------------------------------------------------------ */

export interface DraftRestoreBannerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** When the draft was last saved. */
  savedAt?: Date | string;
  onRestore?: () => void;
  onDiscard?: () => void;
  message?: React.ReactNode;
}

/** Notifies users an unsaved draft exists and offers restore/discard. */
export const DraftRestoreBanner = React.forwardRef<
  HTMLDivElement,
  DraftRestoreBannerProps
>(function DraftRestoreBanner(
  { savedAt, onRestore, onDiscard, message, className, ...rest },
  ref,
) {
  const time =
    savedAt && (typeof savedAt === "string" ? new Date(savedAt) : savedAt);
  return (
    <div
      ref={ref}
      className={cx("msr-DraftBanner", className)}
      role="status"
      {...rest}
    >
      <span className="msr-DraftBanner__icon" aria-hidden="true">
        ↩
      </span>
      <span className="msr-DraftBanner__text">
        {message ?? "You have an unsaved draft"}
        {time && (
          <span className="msr-DraftBanner__time">
            {" "}
            from {time.toLocaleString()}
          </span>
        )}
      </span>
      <div className="msr-DraftBanner__actions">
        {onDiscard && (
          <button
            type="button"
            className="msr-DraftBanner__discard"
            onClick={onDiscard}
          >
            Discard
          </button>
        )}
        {onRestore && (
          <button
            type="button"
            className="msr-DraftBanner__restore"
            onClick={onRestore}
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
});
