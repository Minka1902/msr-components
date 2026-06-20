import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { NumberStepper } from "../NumberStepper/NumberStepper";

export interface CartLineItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** Per-unit price in minor or major units (your choice); used with `formatPrice`. */
  price: number;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  image?: string;
  /** Variant/option line, e.g. "Size M · Blue". */
  variant?: React.ReactNode;
  minQuantity?: number;
  maxQuantity?: number;
  /** Format a numeric price into a display string. */
  formatPrice?: (value: number) => string;
  readOnlyQuantity?: boolean;
}

function defaultFormat(v: number): string {
  return `$${v.toFixed(2)}`;
}

/** A single cart row: thumbnail, title, quantity stepper, line total, remove. */
export const CartLineItem = React.forwardRef<HTMLDivElement, CartLineItemProps>(function CartLineItem(
  {
    title,
    price,
    quantity,
    onQuantityChange,
    onRemove,
    image,
    variant,
    minQuantity = 1,
    maxQuantity = 99,
    formatPrice = defaultFormat,
    readOnlyQuantity = false,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-CartLineItem", className)} {...rest}>
      <div className="msr-CartLineItem__media">
        {image ? (
          <img src={image} alt="" className="msr-CartLineItem__img" />
        ) : (
          <span className="msr-CartLineItem__placeholder" aria-hidden="true">
            <Icon name="file" size={20} />
          </span>
        )}
      </div>

      <div className="msr-CartLineItem__info">
        <div className="msr-CartLineItem__title">{title}</div>
        {variant && <div className="msr-CartLineItem__variant">{variant}</div>}
        <div className="msr-CartLineItem__unit">{formatPrice(price)} each</div>
      </div>

      <div className="msr-CartLineItem__qty">
        {readOnlyQuantity ? (
          <span className="msr-CartLineItem__qtyStatic">× {quantity}</span>
        ) : (
          <NumberStepper
            value={quantity}
            min={minQuantity}
            max={maxQuantity}
            size="sm"
            onValueChange={(v) => onQuantityChange?.(v)}
          />
        )}
      </div>

      <div className="msr-CartLineItem__total">{formatPrice(price * quantity)}</div>

      {onRemove && (
        <button type="button" className="msr-CartLineItem__remove" aria-label="Remove item" onClick={onRemove}>
          <Icon name="trash" size={16} />
        </button>
      )}
    </div>
  );
});
