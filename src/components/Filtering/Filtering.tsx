import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* Shared field model                                                  */
/* ------------------------------------------------------------------ */

export interface FilterFieldDef {
  name: string;
  label: string;
  type?: "string" | "number" | "date" | "enum" | "boolean";
  options?: Array<{ label: string; value: string }>;
  operators?: string[];
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const DEFAULT_OPERATORS: Record<string, string[]> = {
  string: ["equals", "contains", "starts with", "ends with"],
  number: ["=", "≠", ">", "<", ">=", "<="],
  date: ["before", "after", "on"],
  enum: ["is", "is not"],
  boolean: ["is true", "is false"],
};

function operatorsFor(field?: FilterFieldDef): string[] {
  if (!field) return ["equals"];
  return field.operators ?? DEFAULT_OPERATORS[field.type ?? "string"] ?? ["equals"];
}

let uid = 0;
const nextId = () => `cond-${++uid}`;

/* ------------------------------------------------------------------ */
/* FilterBuilder                                                       */
/* ------------------------------------------------------------------ */

export interface FilterBuilderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  fields: FilterFieldDef[];
  value?: FilterCondition[];
  onChange?: (conditions: FilterCondition[]) => void;
}

/** Visual filter builder: pick field, operator and value per row. */
export const FilterBuilder = React.forwardRef<HTMLDivElement, FilterBuilderProps>(
  function FilterBuilder({ fields, value, onChange, className, ...rest }, ref) {
    const [internal, setInternal] = React.useState<FilterCondition[]>(
      value ?? [],
    );
    const conditions = value ?? internal;
    const commit = (next: FilterCondition[]) => {
      setInternal(next);
      onChange?.(next);
    };
    const add = () => {
      const f = fields[0];
      commit([
        ...conditions,
        {
          id: nextId(),
          field: f?.name ?? "",
          operator: operatorsFor(f)[0],
          value: "",
        },
      ]);
    };
    const update = (id: string, patch: Partial<FilterCondition>) =>
      commit(conditions.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    const remove = (id: string) =>
      commit(conditions.filter((c) => c.id !== id));

    return (
      <div ref={ref} className={cx("msr-FilterBuilder", className)} {...rest}>
        {conditions.map((c) => {
          const field = fields.find((f) => f.name === c.field);
          return (
            <div key={c.id} className="msr-FilterBuilder__row">
              <select
                value={c.field}
                onChange={(e) => {
                  const nf = fields.find((f) => f.name === e.target.value);
                  update(c.id, {
                    field: e.target.value,
                    operator: operatorsFor(nf)[0],
                  });
                }}
              >
                {fields.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </select>
              <select
                value={c.operator}
                onChange={(e) => update(c.id, { operator: e.target.value })}
              >
                {operatorsFor(field).map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
              {field?.type === "enum" ? (
                <select
                  value={c.value}
                  onChange={(e) => update(c.id, { value: e.target.value })}
                >
                  <option value="">—</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                  value={c.value}
                  placeholder="Value"
                  onChange={(e) => update(c.id, { value: e.target.value })}
                />
              )}
              <button
                type="button"
                className="msr-FilterBuilder__remove"
                aria-label="Remove condition"
                onClick={() => remove(c.id)}
              >
                ×
              </button>
            </div>
          );
        })}
        <button type="button" className="msr-FilterBuilder__add" onClick={add}>
          + Add filter
        </button>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* QueryBuilder (nested AND/OR groups)                                 */
/* ------------------------------------------------------------------ */

export type QueryCombinator = "AND" | "OR";

export interface QueryGroup {
  id: string;
  combinator: QueryCombinator;
  rules: Array<QueryGroup | FilterCondition>;
}

function isGroup(node: QueryGroup | FilterCondition): node is QueryGroup {
  return (node as QueryGroup).rules !== undefined;
}

export interface QueryBuilderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  fields: FilterFieldDef[];
  value: QueryGroup;
  onChange: (group: QueryGroup) => void;
  /** Internal: nesting depth. */
  depth?: number;
}

/** Advanced filter builder with nested AND/OR groups. */
export const QueryBuilder = React.forwardRef<HTMLDivElement, QueryBuilderProps>(
  function QueryBuilder(
    { fields, value, onChange, depth = 0, className, ...rest },
    ref,
  ) {
    const setRules = (rules: QueryGroup["rules"]) =>
      onChange({ ...value, rules });
    const addRule = () => {
      const f = fields[0];
      setRules([
        ...value.rules,
        {
          id: nextId(),
          field: f?.name ?? "",
          operator: operatorsFor(f)[0],
          value: "",
        },
      ]);
    };
    const addGroup = () =>
      setRules([
        ...value.rules,
        { id: nextId(), combinator: "AND", rules: [] },
      ]);
    const updateAt = (i: number, node: QueryGroup | FilterCondition) =>
      setRules(value.rules.map((r, idx) => (idx === i ? node : r)));
    const removeAt = (i: number) =>
      setRules(value.rules.filter((_, idx) => idx !== i));

    return (
      <div
        ref={ref}
        className={cx("msr-QueryBuilder", className)}
        data-depth={depth}
        {...rest}
      >
        <div className="msr-QueryBuilder__head">
          <div className="msr-QueryBuilder__combinator">
            {(["AND", "OR"] as QueryCombinator[]).map((c) => (
              <button
                key={c}
                type="button"
                data-active={value.combinator === c || undefined}
                onClick={() => onChange({ ...value, combinator: c })}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="msr-QueryBuilder__headActions">
            <button type="button" onClick={addRule}>
              + Rule
            </button>
            <button type="button" onClick={addGroup}>
              + Group
            </button>
          </div>
        </div>
        <div className="msr-QueryBuilder__rules">
          {value.rules.map((rule, i) =>
            isGroup(rule) ? (
              <div key={rule.id} className="msr-QueryBuilder__nested">
                <QueryBuilder
                  fields={fields}
                  value={rule}
                  depth={depth + 1}
                  onChange={(g) => updateAt(i, g)}
                />
                <button
                  type="button"
                  className="msr-QueryBuilder__removeGroup"
                  onClick={() => removeAt(i)}
                >
                  Remove group
                </button>
              </div>
            ) : (
              <div key={rule.id} className="msr-QueryBuilder__rule">
                <select
                  value={rule.field}
                  onChange={(e) => {
                    const nf = fields.find((f) => f.name === e.target.value);
                    updateAt(i, {
                      ...rule,
                      field: e.target.value,
                      operator: operatorsFor(nf)[0],
                    });
                  }}
                >
                  {fields.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </select>
                <select
                  value={rule.operator}
                  onChange={(e) =>
                    updateAt(i, { ...rule, operator: e.target.value })
                  }
                >
                  {operatorsFor(fields.find((f) => f.name === rule.field)).map(
                    (op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ),
                  )}
                </select>
                <input
                  value={rule.value}
                  placeholder="Value"
                  onChange={(e) =>
                    updateAt(i, { ...rule, value: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="msr-QueryBuilder__remove"
                  aria-label="Remove rule"
                  onClick={() => removeAt(i)}
                >
                  ×
                </button>
              </div>
            ),
          )}
          {value.rules.length === 0 && (
            <div className="msr-QueryBuilder__empty">No rules yet.</div>
          )}
        </div>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* FacetedFilterPanel                                                  */
/* ------------------------------------------------------------------ */

export interface FacetValue {
  value: string;
  label?: string;
  count?: number;
}

export interface Facet {
  name: string;
  label: string;
  values: FacetValue[];
}

export interface FacetedFilterPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  facets: Facet[];
  /** Selected values keyed by facet name. */
  selected?: Record<string, string[]>;
  onChange?: (selected: Record<string, string[]>) => void;
}

/** Sidebar filter with grouped values and counts. */
export const FacetedFilterPanel = React.forwardRef<
  HTMLDivElement,
  FacetedFilterPanelProps
>(function FacetedFilterPanel(
  { facets, selected, onChange, className, ...rest },
  ref,
) {
  const [internal, setInternal] = React.useState<Record<string, string[]>>(
    selected ?? {},
  );
  const sel = selected ?? internal;
  const toggle = (facet: string, value: string) => {
    const cur = sel[facet] ?? [];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value];
    const result = { ...sel, [facet]: next };
    setInternal(result);
    onChange?.(result);
  };
  return (
    <aside ref={ref} className={cx("msr-Faceted", className)} {...rest}>
      {facets.map((facet) => (
        <div key={facet.name} className="msr-Faceted__group">
          <div className="msr-Faceted__groupTitle">{facet.label}</div>
          <ul className="msr-Faceted__values">
            {facet.values.map((v) => {
              const checked = (sel[facet.name] ?? []).includes(v.value);
              return (
                <li key={v.value}>
                  <label className="msr-Faceted__value">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(facet.name, v.value)}
                    />
                    <span className="msr-Faceted__valueLabel">
                      {v.label ?? v.value}
                    </span>
                    {v.count != null && (
                      <span className="msr-Faceted__count">{v.count}</span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
});
