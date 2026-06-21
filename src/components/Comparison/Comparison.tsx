import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* CompareSelector                                                     */
/* ------------------------------------------------------------------ */

export interface CompareOption {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface CompareSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: CompareOption[];
  /** Selected entity ids. */
  selected: string[];
  onChange: (selected: string[]) => void;
  /** Maximum number of entities that can be compared. */
  max?: number;
}

/** Lets users select two or more entities to compare side by side. */
export const CompareSelector = React.forwardRef<
  HTMLDivElement,
  CompareSelectorProps
>(function CompareSelector(
  { options, selected, onChange, max = 4, className, ...rest },
  ref,
) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < max) {
      onChange([...selected, id]);
    }
  };
  return (
    <div ref={ref} className={cx("msr-Compare", className)} {...rest}>
      <div className="msr-Compare__head">
        Select up to {max} to compare
        <span className="msr-Compare__counter">
          {selected.length}/{max}
        </span>
      </div>
      <div className="msr-Compare__options">
        {options.map((o) => {
          const checked = selected.includes(o.id);
          const disabled = !checked && selected.length >= max;
          return (
            <label
              key={o.id}
              className="msr-Compare__option"
              data-checked={checked || undefined}
              data-disabled={disabled || undefined}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(o.id)}
              />
              <span className="msr-Compare__optionBody">
                <span className="msr-Compare__optionLabel">{o.label}</span>
                {o.description && (
                  <span className="msr-Compare__optionDesc">
                    {o.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ComparisonMatrix                                                    */
/* ------------------------------------------------------------------ */

export interface ComparisonEntity {
  id: string;
  label: React.ReactNode;
}

export interface ComparisonRow {
  feature: React.ReactNode;
  /** Value per entity id. */
  values: Record<string, React.ReactNode>;
}

export interface ComparisonMatrixProps
  extends React.HTMLAttributes<HTMLDivElement> {
  entities: ComparisonEntity[];
  rows: ComparisonRow[];
  /** Highlight rows where values differ. */
  highlightDifferences?: boolean;
}

function valuesDiffer(values: Record<string, React.ReactNode>, ids: string[]) {
  const serialized = ids.map((id) => JSON.stringify(values[id] ?? null));
  return new Set(serialized).size > 1;
}

/** Displays multiple objects field-by-field for quick comparison. */
export const ComparisonMatrix = React.forwardRef<
  HTMLDivElement,
  ComparisonMatrixProps
>(function ComparisonMatrix(
  { entities, rows, highlightDifferences, className, ...rest },
  ref,
) {
  const ids = entities.map((e) => e.id);
  return (
    <div ref={ref} className={cx("msr-Matrix", className)} {...rest}>
      <table className="msr-Matrix__table">
        <thead>
          <tr>
            <th className="msr-Matrix__corner" />
            {entities.map((e) => (
              <th key={e.id} className="msr-Matrix__entity">
                {e.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const diff =
              highlightDifferences && valuesDiffer(row.values, ids);
            return (
              <tr key={i} data-diff={diff || undefined}>
                <th className="msr-Matrix__feature" scope="row">
                  {row.feature}
                </th>
                {ids.map((id) => (
                  <td key={id} className="msr-Matrix__cell">
                    {row.values[id] ?? (
                      <span className="msr-Matrix__missing">—</span>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
