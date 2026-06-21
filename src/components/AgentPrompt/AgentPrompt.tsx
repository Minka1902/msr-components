import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* PromptTemplateManager                                               */
/* ------------------------------------------------------------------ */

export interface PromptTemplate {
  id: string;
  name: string;
  body: string;
  tags?: string[];
}

export interface PromptTemplateManagerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  templates: PromptTemplate[];
  selectedId?: string;
  onSelect?: (template: PromptTemplate) => void;
  onCreate?: () => void;
  onDelete?: (id: string) => void;
}

/** Save, browse and reuse prompt templates. */
export const PromptTemplateManager = React.forwardRef<
  HTMLDivElement,
  PromptTemplateManagerProps
>(function PromptTemplateManager(
  { templates, selectedId, onSelect, onCreate, onDelete, className, ...rest },
  ref,
) {
  const [query, setQuery] = React.useState("");
  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
  );
  return (
    <div ref={ref} className={cx("msr-PromptMgr", className)} {...rest}>
      <div className="msr-PromptMgr__bar">
        <input
          className="msr-PromptMgr__search"
          type="search"
          placeholder="Search templates…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {onCreate && (
          <button
            type="button"
            className="msr-PromptMgr__new"
            onClick={onCreate}
          >
            + New
          </button>
        )}
      </div>
      <ul className="msr-PromptMgr__list">
        {filtered.map((t) => (
          <li key={t.id} className="msr-PromptMgr__item">
            <button
              type="button"
              className="msr-PromptMgr__select"
              data-active={t.id === selectedId || undefined}
              onClick={() => onSelect?.(t)}
            >
              <span className="msr-PromptMgr__name">{t.name}</span>
              <span className="msr-PromptMgr__preview">{t.body}</span>
              {t.tags && t.tags.length > 0 && (
                <span className="msr-PromptMgr__tags">
                  {t.tags.map((tag) => (
                    <span key={tag} className="msr-PromptMgr__tag">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </button>
            {onDelete && (
              <button
                type="button"
                className="msr-PromptMgr__delete"
                aria-label={`Delete ${t.name}`}
                onClick={() => onDelete(t.id)}
              >
                ×
              </button>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="msr-PromptMgr__empty">No templates found.</li>
        )}
      </ul>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* PromptVariableEditor                                                */
/* ------------------------------------------------------------------ */

export interface PromptVariable {
  name: string;
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  options?: string[];
}

export interface PromptVariableEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Either pass `variables`, or a `template` to auto-extract {{vars}}. */
  variables?: PromptVariable[];
  template?: string;
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  /** Show the interpolated preview. */
  showPreview?: boolean;
}

function extractVars(template: string): PromptVariable[] {
  const seen = new Set<string>();
  const out: PromptVariable[] = [];
  const re = /\{\{\s*(\w+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      out.push({ name: m[1] });
    }
  }
  return out;
}

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => values[k] ?? `{{${k}}}`);
}

/** Form for filling variables inside a prompt template. */
export const PromptVariableEditor = React.forwardRef<
  HTMLDivElement,
  PromptVariableEditorProps
>(function PromptVariableEditor(
  { variables, template, values, onChange, showPreview, className, ...rest },
  ref,
) {
  const vars = variables ?? (template ? extractVars(template) : []);
  const set = (name: string, value: string) =>
    onChange({ ...values, [name]: value });
  return (
    <div ref={ref} className={cx("msr-PromptVars", className)} {...rest}>
      <div className="msr-PromptVars__fields">
        {vars.map((v) => {
          const id = `msr-var-${v.name}`;
          return (
            <div key={v.name} className="msr-PromptVars__field">
              <label htmlFor={id} className="msr-PromptVars__label">
                {v.label ?? v.name}
                {v.required && <span className="msr-PromptVars__req">*</span>}
              </label>
              {v.options ? (
                <select
                  id={id}
                  value={values[v.name] ?? ""}
                  onChange={(e) => set(v.name, e.target.value)}
                >
                  <option value="">—</option>
                  {v.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : v.multiline ? (
                <textarea
                  id={id}
                  rows={3}
                  placeholder={v.placeholder}
                  value={values[v.name] ?? ""}
                  onChange={(e) => set(v.name, e.target.value)}
                />
              ) : (
                <input
                  id={id}
                  type="text"
                  placeholder={v.placeholder}
                  value={values[v.name] ?? ""}
                  onChange={(e) => set(v.name, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
      {showPreview && template && (
        <div className="msr-PromptVars__preview">
          <div className="msr-PromptVars__previewLabel">Preview</div>
          <pre>{interpolate(template, values)}</pre>
        </div>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* ModelSelector                                                       */
/* ------------------------------------------------------------------ */

export interface ModelOption {
  id: string;
  label: string;
  provider?: string;
}

export interface ModelSettings {
  model?: string;
  temperature?: number;
  reasoning?: "off" | "low" | "medium" | "high";
}

export interface ModelSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  models: ModelOption[];
  value: ModelSettings;
  onChange: (settings: ModelSettings) => void;
  showTemperature?: boolean;
  showReasoning?: boolean;
}

/** Choose AI model, provider, temperature and reasoning level. */
export const ModelSelector = React.forwardRef<HTMLDivElement, ModelSelectorProps>(
  function ModelSelector(
    {
      models,
      value,
      onChange,
      showTemperature = true,
      showReasoning = true,
      className,
      ...rest
    },
    ref,
  ) {
    const set = (patch: Partial<ModelSettings>) =>
      onChange({ ...value, ...patch });
    return (
      <div ref={ref} className={cx("msr-ModelSelector", className)} {...rest}>
        <div className="msr-ModelSelector__field">
          <label className="msr-ModelSelector__label">Model</label>
          <select
            value={value.model ?? ""}
            onChange={(e) => set({ model: e.target.value })}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.provider ? `${m.provider} · ${m.label}` : m.label}
              </option>
            ))}
          </select>
        </div>
        {showTemperature && (
          <div className="msr-ModelSelector__field">
            <label className="msr-ModelSelector__label">
              Temperature
              <span className="msr-ModelSelector__value">
                {(value.temperature ?? 0.7).toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={value.temperature ?? 0.7}
              onChange={(e) => set({ temperature: Number(e.target.value) })}
            />
          </div>
        )}
        {showReasoning && (
          <div className="msr-ModelSelector__field">
            <label className="msr-ModelSelector__label">Reasoning</label>
            <select
              value={value.reasoning ?? "medium"}
              onChange={(e) =>
                set({ reasoning: e.target.value as ModelSettings["reasoning"] })
              }
            >
              <option value="off">Off</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        )}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* TokenBudgetBar                                                      */
/* ------------------------------------------------------------------ */

export interface TokenBudgetSegment {
  label: string;
  tokens: number;
  tone?: "primary" | "info" | "warning" | "muted";
}

export interface TokenBudgetBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Total context window. */
  max: number;
  segments: TokenBudgetSegment[];
}

/** Shows how much prompt/context/output budget remains. */
export const TokenBudgetBar = React.forwardRef<
  HTMLDivElement,
  TokenBudgetBarProps
>(function TokenBudgetBar({ max, segments, className, ...rest }, ref) {
  const used = segments.reduce((s, x) => s + x.tokens, 0);
  const remaining = Math.max(0, max - used);
  const pct = (n: number) => `${(n / max) * 100}%`;
  return (
    <div ref={ref} className={cx("msr-TokenBudget", className)} {...rest}>
      <div className="msr-TokenBudget__head">
        <span>
          {used.toLocaleString()} / {max.toLocaleString()} tokens
        </span>
        <span className="msr-TokenBudget__remaining">
          {remaining.toLocaleString()} left
        </span>
      </div>
      <div
        className="msr-TokenBudget__track"
        role="img"
        aria-label={`${used} of ${max} tokens used`}
      >
        {segments.map((s, i) => (
          <div
            key={i}
            className="msr-TokenBudget__seg"
            data-tone={s.tone ?? "primary"}
            style={{ width: pct(s.tokens) }}
            title={`${s.label}: ${s.tokens}`}
          />
        ))}
      </div>
      <div className="msr-TokenBudget__legend">
        {segments.map((s, i) => (
          <span key={i} className="msr-TokenBudget__legendItem">
            <span
              className="msr-TokenBudget__swatch"
              data-tone={s.tone ?? "primary"}
            />
            {s.label} ({s.tokens.toLocaleString()})
          </span>
        ))}
      </div>
    </div>
  );
});
