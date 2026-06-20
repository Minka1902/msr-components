import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "generic";

export interface PaymentMethodCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  brand?: CardBrand;
  /** Last 4 digits of the card. */
  last4: string;
  /** Expiry, e.g. "08/27". */
  expiry?: string;
  holder?: React.ReactNode;
  /** Selectable (renders as a radio-like option). */
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  /** Mark the default method. */
  isDefault?: boolean;
  expired?: boolean;
  onRemove?: () => void;
}

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "VISA",
  mastercard: "MC",
  amex: "AMEX",
  discover: "DISC",
  generic: "CARD",
};

/** A saved payment method row with brand, masked number and selection. */
export const PaymentMethodCard = React.forwardRef<HTMLDivElement, PaymentMethodCardProps>(function PaymentMethodCard(
  {
    brand = "generic",
    last4,
    expiry,
    holder,
    selectable = false,
    selected = false,
    onSelect,
    isDefault = false,
    expired = false,
    onRemove,
    className,
    ...rest
  },
  ref,
) {
  const interactive = selectable && !expired;

  return (
    <div
      ref={ref}
      className={cx("msr-PaymentMethodCard", className)}
      data-selected={selected || undefined}
      data-expired={expired || undefined}
      data-selectable={interactive || undefined}
      role={interactive ? "radio" : undefined}
      aria-checked={interactive ? selected : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      {...rest}
    >
      <span className="msr-PaymentMethodCard__brand" data-brand={brand} aria-hidden="true">
        {BRAND_LABEL[brand]}
      </span>
      <div className="msr-PaymentMethodCard__info">
        <div className="msr-PaymentMethodCard__number">
          <span aria-hidden="true">•••• </span>
          {last4}
          {isDefault && <span className="msr-PaymentMethodCard__default">Default</span>}
        </div>
        <div className="msr-PaymentMethodCard__meta">
          {holder && <span>{holder}</span>}
          {expiry && <span>Exp {expiry}</span>}
          {expired && <span className="msr-PaymentMethodCard__expired">Expired</span>}
        </div>
      </div>
      {interactive && (
        <span className="msr-PaymentMethodCard__radio" aria-hidden="true">
          {selected && <Icon name="check" size={14} />}
        </span>
      )}
      {onRemove && !interactive && (
        <button
          type="button"
          className="msr-PaymentMethodCard__remove"
          aria-label="Remove card"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="trash" size={16} />
        </button>
      )}
    </div>
  );
});
