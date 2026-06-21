import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* DuplicateDetectorView                                               */
/* ------------------------------------------------------------------ */

export interface DuplicateRecord {
  id: string;
  label: React.ReactNode;
  fields?: Record<string, React.ReactNode>;
}

export interface DuplicateGroup {
  id: string;
  /** Similarity 0–1. */
  score: number;
  records: DuplicateRecord[];
  /** Fields that matched between records. */
  matchingFields?: string[];
}

export interface DuplicateDetectorViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  groups: DuplicateGroup[];
  onMerge?: (group: DuplicateGroup) => void;
  onDismiss?: (groupId: string) => void;
}

function scoreTone(score: number): "danger" | "warning" | "muted" {
  if (score >= 0.9) return "danger";
  if (score >= 0.7) return "warning";
  return "muted";
}

/** Shows possible duplicates, similarity scores and merge suggestions. */
export const DuplicateDetectorView = React.forwardRef<
  HTMLDivElement,
  DuplicateDetectorViewProps
>(function DuplicateDetectorView(
  { groups, onMerge, onDismiss, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-Dupes", className)} {...rest}>
      {groups.length === 0 ? (
        <div className="msr-Dupes__empty">No duplicates detected.</div>
      ) : (
        groups.map((g) => (
          <div key={g.id} className="msr-Dupes__group">
            <div className="msr-Dupes__head">
              <span
                className="msr-Dupes__score"
                data-tone={scoreTone(g.score)}
              >
                {Math.round(g.score * 100)}% match
              </span>
              {g.matchingFields && g.matchingFields.length > 0 && (
                <span className="msr-Dupes__fields">
                  on {g.matchingFields.join(", ")}
                </span>
              )}
              <span className="msr-Dupes__actions">
                {onDismiss && (
                  <button
                    type="button"
                    className="msr-Dupes__dismiss"
                    onClick={() => onDismiss(g.id)}
                  >
                    Not a duplicate
                  </button>
                )}
                {onMerge && (
                  <button
                    type="button"
                    className="msr-Dupes__merge"
                    onClick={() => onMerge(g)}
                  >
                    Merge
                  </button>
                )}
              </span>
            </div>
            <div className="msr-Dupes__records">
              {g.records.map((r) => (
                <div key={r.id} className="msr-Dupes__record">
                  <div className="msr-Dupes__recordLabel">{r.label}</div>
                  {r.fields && (
                    <dl className="msr-Dupes__recordFields">
                      {Object.entries(r.fields).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* MergeRecordsDialog                                                  */
/* ------------------------------------------------------------------ */

export interface MergeFieldChoice {
  field: string;
  label?: string;
  /** Candidate value per source record id. */
  values: Record<string, React.ReactNode>;
}

export interface MergeRecordsDialogProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Source records being merged. */
  sources: Array<{ id: string; label: React.ReactNode }>;
  fields: MergeFieldChoice[];
  /** Chosen source id per field. */
  selection: Record<string, string>;
  onChange: (selection: Record<string, string>) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/** Merge duplicates by choosing the winning value for each field. */
export const MergeRecordsDialog = React.forwardRef<
  HTMLDivElement,
  MergeRecordsDialogProps
>(function MergeRecordsDialog(
  { sources, fields, selection, onChange, onConfirm, onCancel, className, ...rest },
  ref,
) {
  const choose = (field: string, sourceId: string) =>
    onChange({ ...selection, [field]: sourceId });
  return (
    <div ref={ref} className={cx("msr-Merge", className)} {...rest}>
      <div className="msr-Merge__head">Choose the value to keep for each field</div>
      <div className="msr-Merge__fields">
        {fields.map((f) => (
          <div key={f.field} className="msr-Merge__field">
            <div className="msr-Merge__fieldLabel">{f.label ?? f.field}</div>
            <div className="msr-Merge__choices">
              {sources.map((s) => {
                const chosen = selection[f.field] === s.id;
                return (
                  <label
                    key={s.id}
                    className="msr-Merge__choice"
                    data-chosen={chosen || undefined}
                  >
                    <input
                      type="radio"
                      name={`merge-${f.field}`}
                      checked={chosen}
                      onChange={() => choose(f.field, s.id)}
                    />
                    <span className="msr-Merge__choiceValue">
                      {f.values[s.id] ?? (
                        <span className="msr-Merge__empty">—</span>
                      )}
                    </span>
                    <span className="msr-Merge__choiceSource">{s.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="msr-Merge__actions">
        <button
          type="button"
          className="msr-Merge__cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="msr-Merge__confirm"
          onClick={onConfirm}
        >
          Merge records
        </button>
      </div>
    </div>
  );
});
