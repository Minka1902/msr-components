import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* Shared types                                                        */
/* ------------------------------------------------------------------ */

export interface KeyValuePair {
  key: string;
  value: string;
  /** Treat the value as a secret (masked input). */
  secret?: boolean;
  enabled?: boolean;
}

let kvUid = 0;

/* ------------------------------------------------------------------ */
/* KeyValueEditor                                                      */
/* ------------------------------------------------------------------ */

export interface KeyValueEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  /** Render an enable/disable checkbox per row. */
  toggleable?: boolean;
  /** Allow marking individual values as secret (adds a reveal toggle). */
  allowSecret?: boolean;
}

/** Generic editor for arbitrary key/value pairs. */
export const KeyValueEditor = React.forwardRef<
  HTMLDivElement,
  KeyValueEditorProps
>(function KeyValueEditor(
  {
    pairs,
    onChange,
    keyPlaceholder = "Key",
    valuePlaceholder = "Value",
    addLabel = "Add row",
    toggleable = false,
    allowSecret = false,
    className,
    ...rest
  },
  ref,
) {
  const [revealed, setRevealed] = React.useState<Record<number, boolean>>({});
  const update = (i: number, patch: Partial<KeyValuePair>) =>
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([...pairs, { key: "", value: "", enabled: true }]);

  return (
    <div ref={ref} className={cx("msr-KV", className)} {...rest}>
      <div className="msr-KV__rows">
        {pairs.map((p, i) => (
          <div
            key={i}
            className="msr-KV__row"
            data-disabled={toggleable && p.enabled === false ? true : undefined}
          >
            {toggleable && (
              <input
                type="checkbox"
                className="msr-KV__toggle"
                checked={p.enabled !== false}
                aria-label="Enabled"
                onChange={(e) => update(i, { enabled: e.target.checked })}
              />
            )}
            <input
              className="msr-KV__key"
              value={p.key}
              placeholder={keyPlaceholder}
              onChange={(e) => update(i, { key: e.target.value })}
            />
            <input
              className="msr-KV__value"
              type={p.secret && !revealed[i] ? "password" : "text"}
              value={p.value}
              placeholder={valuePlaceholder}
              autoComplete="off"
              onChange={(e) => update(i, { value: e.target.value })}
            />
            {allowSecret && (
              <button
                type="button"
                className="msr-KV__icon"
                aria-label={p.secret ? "Mark as plain text" : "Mark as secret"}
                data-active={p.secret || undefined}
                onClick={() => update(i, { secret: !p.secret })}
              >
                🔒
              </button>
            )}
            {p.secret && (
              <button
                type="button"
                className="msr-KV__icon"
                aria-label={revealed[i] ? "Hide value" : "Reveal value"}
                onClick={() =>
                  setRevealed((r) => ({ ...r, [i]: !r[i] }))
                }
              >
                {revealed[i] ? "🙈" : "👁"}
              </button>
            )}
            <button
              type="button"
              className="msr-KV__remove"
              aria-label="Remove row"
              onClick={() => remove(i)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="msr-KV__add" onClick={add}>
        + {addLabel}
      </button>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* EnvVarEditor                                                        */
/* ------------------------------------------------------------------ */

export interface EnvVar {
  key: string;
  value: string;
  secret?: boolean;
}

export interface EnvVarEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  vars: EnvVar[];
  onChange: (vars: EnvVar[]) => void;
  /** Enable pasting a `.env` blob to bulk-import. */
  allowPaste?: boolean;
}

function parseDotEnv(text: string): EnvVar[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line) => {
      const eq = line.indexOf("=");
      if (eq === -1) return { key: line, value: "" };
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      const secret = /SECRET|TOKEN|KEY|PASSWORD|PASS|PRIVATE/i.test(key);
      return { key, value, secret };
    });
}

/** Editor for environment variables, with optional `.env` paste import. */
export const EnvVarEditor = React.forwardRef<HTMLDivElement, EnvVarEditorProps>(
  function EnvVarEditor(
    { vars, onChange, allowPaste = true, className, ...rest },
    ref,
  ) {
    const [pasting, setPasting] = React.useState(false);
    const [blob, setBlob] = React.useState("");
    return (
      <div ref={ref} className={cx("msr-EnvVars", className)} {...rest}>
        <KeyValueEditor
          pairs={vars.map((v) => ({
            key: v.key,
            value: v.value,
            secret: v.secret,
          }))}
          onChange={(pairs) =>
            onChange(
              pairs.map((p) => ({
                key: p.key,
                value: p.value,
                secret: p.secret,
              })),
            )
          }
          keyPlaceholder="VARIABLE_NAME"
          valuePlaceholder="value"
          addLabel="Add variable"
          allowSecret
        />
        {allowPaste && (
          <div className="msr-EnvVars__paste">
            {pasting ? (
              <>
                <textarea
                  className="msr-EnvVars__blob"
                  rows={4}
                  placeholder={"KEY=value\nAPI_TOKEN=secret"}
                  value={blob}
                  onChange={(e) => setBlob(e.target.value)}
                />
                <div className="msr-EnvVars__pasteActions">
                  <button
                    type="button"
                    onClick={() => {
                      setPasting(false);
                      setBlob("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="msr-EnvVars__import"
                    onClick={() => {
                      onChange([...vars, ...parseDotEnv(blob)]);
                      setPasting(false);
                      setBlob("");
                    }}
                  >
                    Import
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="msr-EnvVars__pasteToggle"
                onClick={() => setPasting(true)}
              >
                Paste .env
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* HeadersEditor                                                       */
/* ------------------------------------------------------------------ */

export interface HttpHeader {
  name: string;
  value: string;
  enabled?: boolean;
}

export interface HeadersEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  headers: HttpHeader[];
  onChange: (headers: HttpHeader[]) => void;
}

const COMMON_HEADERS = [
  "Authorization",
  "Content-Type",
  "Accept",
  "User-Agent",
  "X-Api-Key",
];

/** Editor for HTTP request headers with common-name suggestions. */
export const HeadersEditor = React.forwardRef<HTMLDivElement, HeadersEditorProps>(
  function HeadersEditor({ headers, onChange, className, ...rest }, ref) {
    const listId = React.useMemo(() => `msr-headers-${++kvUid}`, []);
    const update = (i: number, patch: Partial<HttpHeader>) =>
      onChange(headers.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
    const remove = (i: number) =>
      onChange(headers.filter((_, idx) => idx !== i));
    return (
      <div ref={ref} className={cx("msr-Headers", className)} {...rest}>
        <datalist id={listId}>
          {COMMON_HEADERS.map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>
        <div className="msr-KV__rows">
          {headers.map((h, i) => (
            <div
              key={i}
              className="msr-KV__row"
              data-disabled={h.enabled === false || undefined}
            >
              <input
                type="checkbox"
                className="msr-KV__toggle"
                checked={h.enabled !== false}
                aria-label="Enabled"
                onChange={(e) => update(i, { enabled: e.target.checked })}
              />
              <input
                className="msr-KV__key"
                list={listId}
                value={h.name}
                placeholder="Header"
                onChange={(e) => update(i, { name: e.target.value })}
              />
              <input
                className="msr-KV__value"
                value={h.value}
                placeholder="Value"
                onChange={(e) => update(i, { value: e.target.value })}
              />
              <button
                type="button"
                className="msr-KV__remove"
                aria-label="Remove header"
                onClick={() => remove(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="msr-KV__add"
          onClick={() =>
            onChange([...headers, { name: "", value: "", enabled: true }])
          }
        >
          + Add header
        </button>
      </div>
    );
  },
);
