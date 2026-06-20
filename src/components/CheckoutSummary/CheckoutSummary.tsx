import * as React from "react";
import { cx } from "../../lib/cx";

export interface CheckoutLine {
  label: React.ReactNode;
  value: number;
  /** Render emphasized (e.g. discounts in green). */
  tone?: "default" | "muted" | "discount";
}

export interface CheckoutSummaryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtotal: number;
  /** Additional lines: shipping, tax, discounts, etc. */
  lines?: CheckoutLine[];
  total?: number;
  formatPrice?: (value: number) => string;
  /** Footer slot (e.g. a checkout button). */
  footer?: React.ReactNode;
  note?: React.ReactNode;
}

function defaultFormat(v: number): string {
  const sign = v < 0 ? "-" : "";
  return `${sign}$${Math.abs(v).toFixed(2)}`;
}

/** Order summary with subtotal, adjustment lines and a computed total. */
export const CheckoutSummary = React.forwardRef<HTMLDivElement, CheckoutSummaryProps>(function CheckoutSummary(
  { title = "Order summary", subtotal, lines = [], total, formatPrice = defaultFormat, footer, note, className, ...rest },
  ref,
) {
  const computedTotal = total ?? subtotal + lines.reduce((sum, l) => sum + l.value, 0);

  return (
    <div ref={ref} className={cx("msr-CheckoutSummary", className)} {...rest}>
      {title && <div className="msr-CheckoutSummary__title">{title}</div>}
      <dl className="msr-CheckoutSummary__lines">
        <div className="msr-CheckoutSummary__line">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {lines.map((l, i) => (
          <div key={i} className="msr-CheckoutSummary__line" data-tone={l.tone ?? "default"}>
            <dt>{l.label}</dt>
            <dd>{formatPrice(l.value)}</dd>
          </div>
        ))}
      </dl>
      <div className="msr-CheckoutSummary__total">
        <span>Total</span>
        <span className="msr-CheckoutSummary__totalValue">{formatPrice(computedTotal)}</span>
      </div>
      {note && <p className="msr-CheckoutSummary__note">{note}</p>}
      {footer && <div className="msr-CheckoutSummary__footer">{footer}</div>}
    </div>
  );
});
