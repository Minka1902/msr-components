import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* SchemaPageRenderer                                                  */
/* ------------------------------------------------------------------ */

export type SchemaFieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "enum"
  | "text"
  | "custom";

export interface SchemaField {
  name: string;
  label?: string;
  type?: SchemaFieldType;
  value?: unknown;
  /** For `enum` fields. */
  options?: Array<{ label: string; value: string }>;
  description?: string;
  /** Component key resolved against the renderer's `components` map. */
  component?: string;
}

export interface SchemaAction {
  label: string;
  /** Looked up against the renderer's `onAction` handler. */
  action: string;
  variant?: "primary" | "default" | "danger";
}

export interface SchemaSection {
  id?: string;
  title?: string;
  description?: string;
  /** Number of columns for the field grid. */
  columns?: number;
  fields?: SchemaField[];
  actions?: SchemaAction[];
}

export interface PageSchema {
  title?: string;
  description?: string;
  sections: SchemaSection[];
}

export interface SchemaPageRendererProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  schema: PageSchema;
  /** Override field rendering by `component` key or field `type`. */
  components?: Record<
    string,
    (field: SchemaField) => React.ReactNode
  >;
  /** Invoked when a schema action button is pressed. */
  onAction?: (action: string) => void;
}

function defaultFieldValue(field: SchemaField): React.ReactNode {
  const { value, type } = field;
  if (value == null || value === "") return <em className="msr-SchemaTools__nullish">—</em>;
  if (type === "boolean") return value ? "Yes" : "No";
  if (type === "enum") {
    const opt = field.options?.find((o) => o.value === value);
    return opt ? opt.label : String(value);
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** Renders a full page from a structured schema (sections, fields, actions). */
export const SchemaPageRenderer = React.forwardRef<
  HTMLDivElement,
  SchemaPageRendererProps
>(function SchemaPageRenderer(
  { schema, components, onAction, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-SchemaPage", className)} {...rest}>
      {schema.title && <h1 className="msr-SchemaPage__title">{schema.title}</h1>}
      {schema.description && (
        <p className="msr-SchemaPage__desc">{schema.description}</p>
      )}
      {schema.sections.map((section, si) => (
        <section
          key={section.id ?? si}
          className="msr-SchemaPage__section"
        >
          {(section.title || section.actions) && (
            <div className="msr-SchemaPage__sectionHead">
              <div>
                {section.title && (
                  <h2 className="msr-SchemaPage__sectionTitle">
                    {section.title}
                  </h2>
                )}
                {section.description && (
                  <p className="msr-SchemaPage__sectionDesc">
                    {section.description}
                  </p>
                )}
              </div>
              {section.actions && (
                <div className="msr-SchemaPage__actions">
                  {section.actions.map((a, ai) => (
                    <button
                      key={ai}
                      type="button"
                      className="msr-SchemaPage__action"
                      data-variant={a.variant ?? "default"}
                      onClick={() => onAction?.(a.action)}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {section.fields && section.fields.length > 0 && (
            <div
              className="msr-SchemaPage__grid"
              style={{
                gridTemplateColumns: `repeat(${section.columns ?? 2}, minmax(0, 1fr))`,
              }}
            >
              {section.fields.map((field) => {
                const custom =
                  (field.component && components?.[field.component]) ||
                  (field.type && components?.[field.type]);
                return (
                  <div key={field.name} className="msr-SchemaPage__field">
                    <div className="msr-SchemaPage__label">
                      {field.label ?? field.name}
                    </div>
                    <div className="msr-SchemaPage__value">
                      {custom ? custom(field) : defaultFieldValue(field)}
                    </div>
                    {field.description && (
                      <div className="msr-SchemaPage__hint">
                        {field.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* SchemaViewer                                                        */
/* ------------------------------------------------------------------ */

export interface SchemaProperty {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  enumValues?: string[];
  example?: string;
}

export interface SchemaViewerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional schema name/title. */
  name?: string;
  properties: SchemaProperty[];
}

/** Displays an object schema: field names, types, required flags, enums, examples. */
export const SchemaViewer = React.forwardRef<HTMLDivElement, SchemaViewerProps>(
  function SchemaViewer({ name, properties, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("msr-SchemaViewer", className)} {...rest}>
        {name && <div className="msr-SchemaViewer__name">{name}</div>}
        <table className="msr-SchemaViewer__table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.name}>
                <td>
                  <code className="msr-SchemaViewer__field">{p.name}</code>
                </td>
                <td>
                  <span className="msr-SchemaViewer__type">{p.type}</span>
                  {p.enumValues && (
                    <span className="msr-SchemaViewer__enum">
                      {p.enumValues.join(" | ")}
                    </span>
                  )}
                </td>
                <td>
                  {p.required ? (
                    <span className="msr-SchemaViewer__req">required</span>
                  ) : (
                    <span className="msr-SchemaViewer__opt">optional</span>
                  )}
                </td>
                <td>
                  {p.description}
                  {p.example != null && (
                    <span className="msr-SchemaViewer__example">
                      e.g. <code>{p.example}</code>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* SchemaDiffViewer                                                    */
/* ------------------------------------------------------------------ */

export type SchemaDiffStatus = "added" | "removed" | "changed" | "unchanged";

export interface SchemaDiffRow {
  name: string;
  status: SchemaDiffStatus;
  before?: string;
  after?: string;
}

export interface SchemaDiffViewerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Pre-computed rows, or pass `before`/`after` for auto-diff. */
  rows?: SchemaDiffRow[];
  before?: Record<string, string>;
  after?: Record<string, string>;
  /** Hide rows that are unchanged. */
  hideUnchanged?: boolean;
}

function computeDiff(
  before: Record<string, string>,
  after: Record<string, string>,
): SchemaDiffRow[] {
  const keys = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  ).sort();
  return keys.map((name) => {
    const inB = name in before;
    const inA = name in after;
    if (inB && !inA) return { name, status: "removed", before: before[name] };
    if (!inB && inA) return { name, status: "added", after: after[name] };
    if (before[name] !== after[name])
      return { name, status: "changed", before: before[name], after: after[name] };
    return { name, status: "unchanged", before: before[name], after: after[name] };
  });
}

/** Compares two schemas/response shapes and highlights changes. */
export const SchemaDiffViewer = React.forwardRef<
  HTMLDivElement,
  SchemaDiffViewerProps
>(function SchemaDiffViewer(
  { rows, before, after, hideUnchanged, className, ...rest },
  ref,
) {
  const allRows =
    rows ?? (before && after ? computeDiff(before, after) : []);
  const visible = hideUnchanged
    ? allRows.filter((r) => r.status !== "unchanged")
    : allRows;
  return (
    <div ref={ref} className={cx("msr-SchemaDiff", className)} {...rest}>
      {visible.map((r) => (
        <div
          key={r.name}
          className="msr-SchemaDiff__row"
          data-status={r.status}
        >
          <span className="msr-SchemaDiff__marker" aria-hidden="true">
            {r.status === "added"
              ? "+"
              : r.status === "removed"
                ? "−"
                : r.status === "changed"
                  ? "~"
                  : " "}
          </span>
          <code className="msr-SchemaDiff__name">{r.name}</code>
          <span className="msr-SchemaDiff__detail">
            {r.status === "changed" ? (
              <>
                <del>{r.before}</del> <ins>{r.after}</ins>
              </>
            ) : (
              r.after ?? r.before
            )}
          </span>
        </div>
      ))}
    </div>
  );
});
