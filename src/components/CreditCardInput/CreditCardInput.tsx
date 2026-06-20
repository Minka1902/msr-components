import * as React from "react";
import { cx } from "../../lib/cx";

export type CreditCardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export interface CreditCardValue {
  number: string;
  expiry: string;
  cvc: string;
  name?: string;
}

export interface CreditCardInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: CreditCardValue;
  defaultValue?: Partial<CreditCardValue>;
  onChange?: (value: CreditCardValue, meta: { brand: CreditCardBrand; valid: boolean }) => void;
  /** Show a cardholder-name field. */
  showName?: boolean;
  disabled?: boolean;
}

const BRAND_LABEL: Record<CreditCardBrand, string> = {
  visa: "VISA", mastercard: "MC", amex: "AMEX", discover: "DISC", unknown: "CARD",
};

export function detectBrand(digits: string): CreditCardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^(5[1-5]|22[2-9]|2[3-6]|27[01]|2720)/.test(digits)) return "mastercard";
  if (/^6(011|5)/.test(digits)) return "discover";
  return "unknown";
}

function luhn(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return digits.length >= 13 && sum % 10 === 0;
}

function groupNumber(digits: string, brand: CreditCardBrand): string {
  if (brand === "amex") {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(" ");
  }
  return (digits.match(/.{1,4}/g) ?? []).join(" ");
}

/** Card-entry group with live brand detection, formatting and Luhn validation. */
export const CreditCardInput = React.forwardRef<HTMLDivElement, CreditCardInputProps>(function CreditCardInput(
  { value, defaultValue, onChange, showName = false, disabled, className, ...rest },
  ref,
) {
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<CreditCardValue>({
    number: defaultValue?.number ?? "",
    expiry: defaultValue?.expiry ?? "",
    cvc: defaultValue?.cvc ?? "",
    name: defaultValue?.name ?? "",
  });
  const v = controlled ? (value as CreditCardValue) : internal;

  const digits = v.number.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const maxLen = brand === "amex" ? 15 : 16;

  const emit = (next: CreditCardValue) => {
    if (!controlled) setInternal(next);
    const d = next.number.replace(/\D/g, "");
    const valid =
      luhn(d) &&
      /^\d{2}\/\d{2}$/.test(next.expiry) &&
      next.cvc.length >= 3;
    onChange?.(next, { brand: detectBrand(d), valid });
  };

  const onNumber = (raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, maxLen);
    emit({ ...v, number: groupNumber(d, detectBrand(d)) });
  };
  const onExpiry = (raw: string) => {
    let d = raw.replace(/\D/g, "").slice(0, 4);
    if (d.length >= 3) d = `${d.slice(0, 2)}/${d.slice(2)}`;
    emit({ ...v, expiry: d });
  };
  const onCvc = (raw: string) => {
    emit({ ...v, cvc: raw.replace(/\D/g, "").slice(0, brand === "amex" ? 4 : 3) });
  };

  return (
    <div ref={ref} className={cx("msr-CreditCardInput", className)} data-disabled={disabled || undefined} {...rest}>
      <div className="msr-CreditCardInput__numberRow">
        <span className="msr-CreditCardInput__brand" data-brand={brand} aria-hidden="true">
          {BRAND_LABEL[brand]}
        </span>
        <input
          className="msr-CreditCardInput__input msr-CreditCardInput__number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="Card number"
          aria-label="Card number"
          disabled={disabled}
          value={v.number}
          onChange={(e) => onNumber(e.target.value)}
        />
      </div>
      <div className="msr-CreditCardInput__row">
        <input
          className="msr-CreditCardInput__input"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/YY"
          aria-label="Expiry"
          disabled={disabled}
          value={v.expiry}
          onChange={(e) => onExpiry(e.target.value)}
        />
        <input
          className="msr-CreditCardInput__input"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder="CVC"
          aria-label="CVC"
          disabled={disabled}
          value={v.cvc}
          onChange={(e) => onCvc(e.target.value)}
        />
      </div>
      {showName && (
        <input
          className="msr-CreditCardInput__input"
          autoComplete="cc-name"
          placeholder="Cardholder name"
          aria-label="Cardholder name"
          disabled={disabled}
          value={v.name ?? ""}
          onChange={(e) => emit({ ...v, name: e.target.value })}
        />
      )}
    </div>
  );
});
