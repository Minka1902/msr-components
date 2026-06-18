import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Input, type InputProps } from "../Input/Input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "rightIcon"> {
  /** Show a strength meter below the field. */
  showStrength?: boolean;
  /** Custom strength scorer (0–4). Defaults to a simple heuristic. */
  scorer?: (value: string) => number;
}

const LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];

function defaultScore(v: string): number {
  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return Math.min(4, score);
}

/** Password field with show/hide toggle and an optional strength meter. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ showStrength = false, scorer = defaultScore, value, defaultValue, onChange, className, ...rest }, ref) {
    const [visible, setVisible] = React.useState(false);
    const [internal, setInternal] = React.useState(String(defaultValue ?? ""));
    const current = value !== undefined ? String(value) : internal;
    const score = current ? scorer(current) : 0;

    return (
      <div className={cx("msr-Password", className)}>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          value={value}
          defaultValue={defaultValue}
          fullWidth
          onChange={(e) => {
            if (value === undefined) setInternal(e.target.value);
            onChange?.(e);
          }}
          rightIcon={
            <button
              type="button"
              className="msr-Password__toggle"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
            >
              <Icon name={visible ? "eyeOff" : "eye"} size={16} />
            </button>
          }
          {...rest}
        />
        {showStrength && (
          <div className="msr-Password__strength" data-score={score}>
            <div className="msr-Password__bars">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="msr-Password__bar" data-on={i < score || undefined} />
              ))}
            </div>
            {current && <span className="msr-Password__label">{LABELS[score]}</span>}
          </div>
        )}
      </div>
    );
  },
);
