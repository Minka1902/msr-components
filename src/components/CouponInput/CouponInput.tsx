import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface CouponInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /** Applied coupon code, if any (controlled "applied" state). */
  appliedCode?: string | null;
  /** Validate/apply a code. Return false (or reject) to show an error. */
  onApply?: (code: string) => boolean | void | Promise<boolean | void>;
  onRemove?: () => void;
  placeholder?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  /** External error message. */
  error?: React.ReactNode;
}

/** Promo-code field with apply/applied/error states. */
export const CouponInput = React.forwardRef<HTMLDivElement, CouponInputProps>(function CouponInput(
  { appliedCode, onApply, onRemove, placeholder = "Promo code", label, disabled, error, className, ...rest },
  ref,
) {
  const [code, setCode] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [localError, setLocalError] = React.useState<React.ReactNode>(null);

  const applied = !!appliedCode;
  const shownError = error ?? localError;

  const apply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setLocalError(null);
    setPending(true);
    try {
      const result = await onApply?.(trimmed);
      if (result === false) setLocalError("Invalid or expired code");
      else setCode("");
    } finally {
      setPending(false);
    }
  };

  return (
    <div ref={ref} className={cx("msr-CouponInput", className)} {...rest}>
      {label && <span className="msr-CouponInput__label">{label}</span>}
      {applied ? (
        <div className="msr-CouponInput__applied">
          <span className="msr-CouponInput__tag">
            <Icon name="check" size={14} />
            {appliedCode}
          </span>
          {onRemove && (
            <button type="button" className="msr-CouponInput__remove" onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      ) : (
        <div className="msr-CouponInput__row" data-error={shownError ? true : undefined}>
          <input
            type="text"
            className="msr-CouponInput__input"
            value={code}
            placeholder={placeholder}
            disabled={disabled || pending}
            aria-label={placeholder}
            aria-invalid={shownError ? true : undefined}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void apply();
              }
            }}
          />
          <button
            type="button"
            className="msr-CouponInput__apply"
            disabled={disabled || pending || !code.trim()}
            onClick={apply}
          >
            {pending ? "…" : "Apply"}
          </button>
        </div>
      )}
      {shownError && <div className="msr-CouponInput__error" role="alert">{shownError}</div>}
    </div>
  );
});
