import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* PropEditorPanel                                                     */
/* ------------------------------------------------------------------ */

export type PropControlType =
  | "string"
  | "number"
  | "boolean"
  | "enum"
  | "array"
  | "object";

export interface PropControl {
  name: string;
  label?: string;
  type: PropControlType;
  /** For `enum`. */
  options?: Array<{ label: string; value: string }>;
  description?: string;
  placeholder?: string;
}

export interface PropEditorPanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  controls: PropControl[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}

/** Generic panel that renders editable controls for component props. */
export const PropEditorPanel = React.forwardRef<
  HTMLDivElement,
  PropEditorPanelProps
>(function PropEditorPanel({ controls, values, onChange, className, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("msr-PropEditor", className)} {...rest}>
      {controls.map((c) => {
        const id = `msr-prop-${c.name}`;
        const value = values[c.name];
        return (
          <div key={c.name} className="msr-PropEditor__row">
            <label htmlFor={id} className="msr-PropEditor__label">
              {c.label ?? c.name}
            </label>
            <div className="msr-PropEditor__control">
              {c.type === "boolean" ? (
                <input
                  id={id}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(e) => onChange(c.name, e.target.checked)}
                />
              ) : c.type === "number" ? (
                <input
                  id={id}
                  type="number"
                  value={value == null ? "" : String(value)}
                  placeholder={c.placeholder}
                  onChange={(e) =>
                    onChange(
                      c.name,
                      e.target.value === "" ? undefined : Number(e.target.value),
                    )
                  }
                />
              ) : c.type === "enum" ? (
                <select
                  id={id}
                  value={value == null ? "" : String(value)}
                  onChange={(e) => onChange(c.name, e.target.value)}
                >
                  <option value="">—</option>
                  {c.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : c.type === "array" || c.type === "object" ? (
                <textarea
                  id={id}
                  rows={3}
                  value={
                    value == null
                      ? ""
                      : typeof value === "string"
                        ? value
                        : JSON.stringify(value, null, 2)
                  }
                  placeholder={c.placeholder ?? "JSON"}
                  onChange={(e) => {
                    try {
                      onChange(c.name, JSON.parse(e.target.value));
                    } catch {
                      onChange(c.name, e.target.value);
                    }
                  }}
                />
              ) : (
                <input
                  id={id}
                  type="text"
                  value={value == null ? "" : String(value)}
                  placeholder={c.placeholder}
                  onChange={(e) => onChange(c.name, e.target.value)}
                />
              )}
              {c.description && (
                <span className="msr-PropEditor__hint">{c.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ComponentPlayground                                                 */
/* ------------------------------------------------------------------ */

export interface ComponentPlaygroundProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  controls: PropControl[];
  initialProps?: Record<string, unknown>;
  /** Renders the live preview from the current prop values. */
  render: (props: Record<string, unknown>) => React.ReactNode;
}

/** Live preview area where component props can be edited interactively. */
export const ComponentPlayground = React.forwardRef<
  HTMLDivElement,
  ComponentPlaygroundProps
>(function ComponentPlayground(
  { controls, initialProps, render, className, ...rest },
  ref,
) {
  const [props, setProps] = React.useState<Record<string, unknown>>(
    () => initialProps ?? {},
  );
  const update = React.useCallback(
    (name: string, value: unknown) =>
      setProps((p) => ({ ...p, [name]: value })),
    [],
  );
  return (
    <div ref={ref} className={cx("msr-Playground", className)} {...rest}>
      <div className="msr-Playground__preview">{render(props)}</div>
      <div className="msr-Playground__panel">
        <div className="msr-Playground__panelHead">Props</div>
        <PropEditorPanel
          controls={controls}
          values={props}
          onChange={update}
        />
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ComponentRegistryViewer                                             */
/* ------------------------------------------------------------------ */

export interface RegistryEntry {
  name: string;
  description?: string;
  category?: string;
  props?: PropControl[];
  variants?: string[];
  usage?: string;
  preview?: React.ReactNode;
}

export interface ComponentRegistryViewerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  entries: RegistryEntry[];
  /** Controlled selected component name. */
  selected?: string;
  onSelect?: (name: string) => void;
}

/** Browsable catalog of available components, their props and usage. */
export const ComponentRegistryViewer = React.forwardRef<
  HTMLDivElement,
  ComponentRegistryViewerProps
>(function ComponentRegistryViewer(
  { entries, selected, onSelect, className, ...rest },
  ref,
) {
  const [query, setQuery] = React.useState("");
  const [internal, setInternal] = React.useState(
    () => selected ?? entries[0]?.name,
  );
  const current = selected ?? internal;
  const select = (name: string) => {
    setInternal(name);
    onSelect?.(name);
  };
  const filtered = entries.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()),
  );
  const active = entries.find((e) => e.name === current);

  return (
    <div ref={ref} className={cx("msr-Registry", className)} {...rest}>
      <div className="msr-Registry__sidebar">
        <input
          className="msr-Registry__search"
          type="search"
          placeholder="Search components…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className="msr-Registry__list">
          {filtered.map((e) => (
            <li key={e.name}>
              <button
                type="button"
                className="msr-Registry__item"
                data-active={e.name === current || undefined}
                onClick={() => select(e.name)}
              >
                <span className="msr-Registry__itemName">{e.name}</span>
                {e.category && (
                  <span className="msr-Registry__itemCat">{e.category}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="msr-Registry__detail">
        {active ? (
          <>
            <h3 className="msr-Registry__name">{active.name}</h3>
            {active.description && (
              <p className="msr-Registry__desc">{active.description}</p>
            )}
            {active.preview && (
              <div className="msr-Registry__preview">{active.preview}</div>
            )}
            {active.variants && active.variants.length > 0 && (
              <div className="msr-Registry__variants">
                {active.variants.map((v) => (
                  <span key={v} className="msr-Registry__variant">
                    {v}
                  </span>
                ))}
              </div>
            )}
            {active.props && active.props.length > 0 && (
              <table className="msr-Registry__props">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {active.props.map((p) => (
                    <tr key={p.name}>
                      <td>
                        <code>{p.name}</code>
                      </td>
                      <td>{p.type}</td>
                      <td>{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {active.usage && (
              <pre className="msr-Registry__usage">
                <code>{active.usage}</code>
              </pre>
            )}
          </>
        ) : (
          <div className="msr-Registry__empty">Select a component.</div>
        )}
      </div>
    </div>
  );
});
