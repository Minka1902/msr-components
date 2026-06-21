import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* SecretInput                                                         */
/* ------------------------------------------------------------------ */

export interface SecretInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Allow toggling visibility of the secret. */
  revealable?: boolean;
  /** Show a copy-to-clipboard button. */
  copyable?: boolean;
  /** Validation/error message. */
  error?: React.ReactNode;
}

/** Secure input for secrets/tokens with masking, reveal and copy. */
export const SecretInput = React.forwardRef<HTMLInputElement, SecretInputProps>(
  function SecretInput(
    { revealable = true, copyable = false, error, className, value, ...rest },
    ref,
  ) {
    const [revealed, setRevealed] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const copy = () => {
      if (value != null) {
        void navigator.clipboard?.writeText(String(value)).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }
    };
    return (
      <div className="msr-SecretInput">
        <div
          className="msr-SecretInput__wrap"
          data-error={error ? true : undefined}
        >
          <input
            ref={ref}
            type={revealed ? "text" : "password"}
            className={cx("msr-SecretInput__field", className)}
            value={value}
            autoComplete="off"
            spellCheck={false}
            {...rest}
          />
          {copyable && (
            <button
              type="button"
              className="msr-SecretInput__btn"
              aria-label="Copy"
              onClick={copy}
            >
              {copied ? "✓" : "⧉"}
            </button>
          )}
          {revealable && (
            <button
              type="button"
              className="msr-SecretInput__btn"
              aria-label={revealed ? "Hide" : "Reveal"}
              aria-pressed={revealed}
              onClick={() => setRevealed((r) => !r)}
            >
              {revealed ? "🙈" : "👁"}
            </button>
          )}
        </div>
        {error && <div className="msr-SecretInput__error">{error}</div>}
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* ApiKeyManager                                                       */
/* ------------------------------------------------------------------ */

export interface ApiKey {
  id: string;
  label: string;
  /** Masked preview, e.g. "sk_live_••••4f2a". */
  masked: string;
  createdAt?: string | Date;
  lastUsed?: string | Date;
  /** Full key — only present immediately after creation. */
  plaintext?: string;
}

export interface ApiKeyManagerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  keys: ApiKey[];
  onCreate?: () => void;
  onRevoke?: (id: string) => void;
  onRotate?: (id: string) => void;
  /** A key shown once after creation (its `plaintext` is rendered). */
  newlyCreated?: ApiKey;
  onDismissNew?: () => void;
}

function fmtDate(d?: string | Date): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? String(d) : date.toLocaleDateString();
}

/** Create, view-once, revoke, rotate, label and audit API keys. */
export const ApiKeyManager = React.forwardRef<HTMLDivElement, ApiKeyManagerProps>(
  function ApiKeyManager(
    {
      keys,
      onCreate,
      onRevoke,
      onRotate,
      newlyCreated,
      onDismissNew,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-ApiKeys", className)} {...rest}>
        <div className="msr-ApiKeys__head">
          <span className="msr-ApiKeys__title">API keys</span>
          {onCreate && (
            <button
              type="button"
              className="msr-ApiKeys__create"
              onClick={onCreate}
            >
              + Create key
            </button>
          )}
        </div>
        {newlyCreated?.plaintext && (
          <div className="msr-ApiKeys__new" role="alert">
            <div className="msr-ApiKeys__newText">
              Copy this key now — you won’t be able to see it again.
            </div>
            <SecretInput copyable readOnly value={newlyCreated.plaintext} />
            {onDismissNew && (
              <button
                type="button"
                className="msr-ApiKeys__dismiss"
                onClick={onDismissNew}
              >
                I’ve saved it
              </button>
            )}
          </div>
        )}
        {keys.length === 0 ? (
          <div className="msr-ApiKeys__empty">No API keys yet.</div>
        ) : (
          <table className="msr-ApiKeys__table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Key</th>
                <th>Created</th>
                <th>Last used</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td>{k.label}</td>
                  <td>
                    <code className="msr-ApiKeys__masked">{k.masked}</code>
                  </td>
                  <td>{fmtDate(k.createdAt)}</td>
                  <td>{fmtDate(k.lastUsed)}</td>
                  <td className="msr-ApiKeys__rowActions">
                    {onRotate && (
                      <button type="button" onClick={() => onRotate(k.id)}>
                        Rotate
                      </button>
                    )}
                    {onRevoke && (
                      <button
                        type="button"
                        className="msr-ApiKeys__revoke"
                        onClick={() => onRevoke(k.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  },
);
