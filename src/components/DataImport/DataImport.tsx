import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* DataPreviewTable                                                    */
/* ------------------------------------------------------------------ */

export interface DataPreviewTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Column keys; inferred from the first row when omitted. */
  columns?: string[];
  rows: Array<Record<string, unknown>>;
  /** Cap the number of rows rendered. */
  maxRows?: number;
  caption?: React.ReactNode;
}

/** Previews imported/generated/fetched data before saving it. */
export const DataPreviewTable = React.forwardRef<
  HTMLDivElement,
  DataPreviewTableProps
>(function DataPreviewTable(
  { columns, rows, maxRows = 50, caption, className, ...rest },
  ref,
) {
  const cols = columns ?? (rows[0] ? Object.keys(rows[0]) : []);
  const shown = rows.slice(0, maxRows);
  return (
    <div ref={ref} className={cx("msr-DataPreview", className)} {...rest}>
      {caption && <div className="msr-DataPreview__caption">{caption}</div>}
      <div className="msr-DataPreview__scroll">
        <table className="msr-DataPreview__table">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row, i) => (
              <tr key={i}>
                {cols.map((c) => {
                  const v = row[c];
                  return (
                    <td key={c}>
                      {v == null ? (
                        <span className="msr-DataPreview__null">null</span>
                      ) : typeof v === "object" ? (
                        JSON.stringify(v)
                      ) : (
                        String(v)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > maxRows && (
        <div className="msr-DataPreview__more">
          Showing {maxRows} of {rows.length} rows
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* DataSourcePicker                                                    */
/* ------------------------------------------------------------------ */

export interface DataSourceOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DataSourcePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: DataSourceOption[];
  value?: string;
  onChange?: (id: string) => void;
}

/** Lets users choose a data source (API, file, database, sample data…). */
export const DataSourcePicker = React.forwardRef<
  HTMLDivElement,
  DataSourcePickerProps
>(function DataSourcePicker(
  { options, value, onChange, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx("msr-DataSource", className)}
      role="radiogroup"
      {...rest}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={o.id === value}
          disabled={o.disabled}
          className="msr-DataSource__option"
          data-selected={o.id === value || undefined}
          onClick={() => onChange?.(o.id)}
        >
          {o.icon && <span className="msr-DataSource__icon">{o.icon}</span>}
          <span className="msr-DataSource__body">
            <span className="msr-DataSource__label">{o.label}</span>
            {o.description && (
              <span className="msr-DataSource__desc">{o.description}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* FieldMappingWizard                                                  */
/* ------------------------------------------------------------------ */

export interface TargetField {
  name: string;
  label: string;
  required?: boolean;
}

export interface FieldMappingWizardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Columns detected in the source file. */
  sourceFields: string[];
  /** Schema fields the app expects. */
  targetFields: TargetField[];
  /** Current mapping: target field name → source column (or ""). */
  mapping?: Record<string, string>;
  onChange?: (mapping: Record<string, string>) => void;
}

/** Maps imported CSV/JSON columns to the app's schema fields. */
export const FieldMappingWizard = React.forwardRef<
  HTMLDivElement,
  FieldMappingWizardProps
>(function FieldMappingWizard(
  { sourceFields, targetFields, mapping, onChange, className, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState<Record<string, string>>(
    mapping ?? {},
  );
  const map = mapping ?? internal;
  const set = (target: string, source: string) => {
    const next = { ...map, [target]: source };
    setInternal(next);
    onChange?.(next);
  };
  return (
    <div ref={ref} className={cx("msr-FieldMap", className)} {...rest}>
      <div className="msr-FieldMap__head">
        <span>Target field</span>
        <span>Source column</span>
      </div>
      {targetFields.map((t) => {
        const unmapped = t.required && !map[t.name];
        return (
          <div key={t.name} className="msr-FieldMap__row" data-error={unmapped || undefined}>
            <div className="msr-FieldMap__target">
              {t.label}
              {t.required && <span className="msr-FieldMap__req">*</span>}
            </div>
            <span className="msr-FieldMap__arrow" aria-hidden="true">
              →
            </span>
            <select
              value={map[t.name] ?? ""}
              onChange={(e) => set(t.name, e.target.value)}
            >
              <option value="">— not mapped —</option>
              {sourceFields.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ImportWizard                                                        */
/* ------------------------------------------------------------------ */

export type ImportStep = "upload" | "map" | "validate" | "preview" | "confirm";

export interface ImportWizardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  step: ImportStep;
  onStepChange?: (step: ImportStep) => void;
  /** Content for the current step. */
  children: React.ReactNode;
  /** Steps that are complete (enables nav + check marks). */
  completed?: ImportStep[];
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}

const IMPORT_STEPS: Array<{ id: ImportStep; label: string }> = [
  { id: "upload", label: "Upload" },
  { id: "map", label: "Map fields" },
  { id: "validate", label: "Validate" },
  { id: "preview", label: "Preview" },
  { id: "confirm", label: "Confirm" },
];

/** Complete import flow: upload → map → validate → preview → confirm. */
export const ImportWizard = React.forwardRef<HTMLDivElement, ImportWizardProps>(
  function ImportWizard(
    {
      step,
      onStepChange,
      children,
      completed = [],
      onBack,
      onNext,
      nextLabel,
      nextDisabled,
      className,
      ...rest
    },
    ref,
  ) {
    const idx = IMPORT_STEPS.findIndex((s) => s.id === step);
    const isLast = idx === IMPORT_STEPS.length - 1;
    return (
      <div ref={ref} className={cx("msr-ImportWizard", className)} {...rest}>
        <ol className="msr-ImportWizard__steps">
          {IMPORT_STEPS.map((s, i) => {
            const done = completed.includes(s.id);
            const active = s.id === step;
            return (
              <li
                key={s.id}
                className="msr-ImportWizard__step"
                data-active={active || undefined}
                data-done={done || undefined}
              >
                <button
                  type="button"
                  onClick={() => onStepChange?.(s.id)}
                  disabled={!done && !active}
                >
                  <span className="msr-ImportWizard__num">
                    {done ? "✓" : i + 1}
                  </span>
                  <span className="msr-ImportWizard__label">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="msr-ImportWizard__body">{children}</div>
        <div className="msr-ImportWizard__footer">
          <button
            type="button"
            className="msr-ImportWizard__back"
            onClick={onBack}
            disabled={idx === 0}
          >
            Back
          </button>
          <button
            type="button"
            className="msr-ImportWizard__next"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel ?? (isLast ? "Confirm import" : "Next")}
          </button>
        </div>
      </div>
    );
  },
);
