import * as React from "react";
import { cx } from "../../lib/cx";

/* ------------------------------------------------------------------ */
/* PlanCard                                                            */
/* ------------------------------------------------------------------ */

export interface PlanFeature {
  label: React.ReactNode;
  included?: boolean;
}

export interface PlanCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  name: React.ReactNode;
  price: React.ReactNode;
  /** e.g. "/mo" or "per seat / month". */
  period?: React.ReactNode;
  description?: React.ReactNode;
  features?: PlanFeature[];
  /** Highlight as the recommended plan. */
  featured?: boolean;
  badge?: React.ReactNode;
  /** Mark as the user's current plan (disables the CTA). */
  current?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
}

/** A pricing-plan card with features and a call-to-action. */
export const PlanCard = React.forwardRef<HTMLDivElement, PlanCardProps>(
  function PlanCard(
    {
      name,
      price,
      period,
      description,
      features,
      featured,
      badge,
      current,
      ctaLabel,
      onSelect,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx("msr-Plan", className)}
        data-featured={featured || undefined}
        data-current={current || undefined}
        {...rest}
      >
        {(featured || badge) && (
          <div className="msr-Plan__badge">{badge ?? "Recommended"}</div>
        )}
        <div className="msr-Plan__name">{name}</div>
        <div className="msr-Plan__priceRow">
          <span className="msr-Plan__price">{price}</span>
          {period && <span className="msr-Plan__period">{period}</span>}
        </div>
        {description && (
          <div className="msr-Plan__desc">{description}</div>
        )}
        {features && features.length > 0 && (
          <ul className="msr-Plan__features">
            {features.map((f, i) => (
              <li
                key={i}
                className="msr-Plan__feature"
                data-excluded={f.included === false || undefined}
              >
                <span className="msr-Plan__check" aria-hidden="true">
                  {f.included === false ? "–" : "✓"}
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          className="msr-Plan__cta"
          disabled={current}
          onClick={onSelect}
        >
          {current ? "Current plan" : (ctaLabel ?? "Choose plan")}
        </button>
      </div>
    );
  },
);

/* ------------------------------------------------------------------ */
/* BillingSummary                                                      */
/* ------------------------------------------------------------------ */

export interface BillingSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  planName: React.ReactNode;
  /** e.g. "$49 / month". */
  planPrice?: React.ReactNode;
  nextInvoiceDate?: Date | string;
  nextInvoiceAmount?: React.ReactNode;
  /** Optional usage summary line. */
  usage?: React.ReactNode;
  onManage?: () => void;
  onChangePlan?: () => void;
}

function fmtDate(d?: Date | string): string | undefined {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? String(d) : date.toLocaleDateString();
}

/** Current plan, next invoice and quick billing actions. */
export const BillingSummary = React.forwardRef<
  HTMLDivElement,
  BillingSummaryProps
>(function BillingSummary(
  {
    planName,
    planPrice,
    nextInvoiceDate,
    nextInvoiceAmount,
    usage,
    onManage,
    onChangePlan,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-BillingSummary", className)} {...rest}>
      <div className="msr-BillingSummary__main">
        <div className="msr-BillingSummary__row">
          <span className="msr-BillingSummary__label">Current plan</span>
          <span className="msr-BillingSummary__plan">
            {planName}
            {planPrice && (
              <span className="msr-BillingSummary__price"> · {planPrice}</span>
            )}
          </span>
        </div>
        {(nextInvoiceDate || nextInvoiceAmount) && (
          <div className="msr-BillingSummary__row">
            <span className="msr-BillingSummary__label">Next invoice</span>
            <span>
              {nextInvoiceAmount}
              {nextInvoiceDate && (
                <span className="msr-BillingSummary__muted">
                  {" "}
                  on {fmtDate(nextInvoiceDate)}
                </span>
              )}
            </span>
          </div>
        )}
        {usage && <div className="msr-BillingSummary__usage">{usage}</div>}
      </div>
      <div className="msr-BillingSummary__actions">
        {onChangePlan && (
          <button
            type="button"
            className="msr-BillingSummary__btn"
            onClick={onChangePlan}
          >
            Change plan
          </button>
        )}
        {onManage && (
          <button
            type="button"
            className="msr-BillingSummary__btn msr-BillingSummary__btn--primary"
            onClick={onManage}
          >
            Manage billing
          </button>
        )}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* InvoiceList                                                         */
/* ------------------------------------------------------------------ */

export type InvoiceStatus = "paid" | "open" | "past-due" | "void" | "refunded";

export interface Invoice {
  id: string;
  number?: string;
  date: Date | string;
  amount: React.ReactNode;
  status: InvoiceStatus;
  downloadUrl?: string;
}

export interface InvoiceListProps extends React.HTMLAttributes<HTMLDivElement> {
  invoices: Invoice[];
  emptyText?: React.ReactNode;
}

const INVOICE_LABEL: Record<InvoiceStatus, string> = {
  paid: "Paid",
  open: "Open",
  "past-due": "Past due",
  void: "Void",
  refunded: "Refunded",
};

/** Table of invoices with status and download links. */
export const InvoiceList = React.forwardRef<HTMLDivElement, InvoiceListProps>(
  function InvoiceList(
    { invoices, emptyText = "No invoices yet.", className, ...rest },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("msr-Invoices", className)} {...rest}>
        {invoices.length === 0 ? (
          <div className="msr-Invoices__empty">{emptyText}</div>
        ) : (
          <table className="msr-Invoices__table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="msr-Invoices__num">
                    {inv.number ?? inv.id}
                  </td>
                  <td>{fmtDate(inv.date)}</td>
                  <td className="msr-Invoices__amount">{inv.amount}</td>
                  <td>
                    <span
                      className="msr-Invoices__status"
                      data-status={inv.status}
                    >
                      {INVOICE_LABEL[inv.status]}
                    </span>
                  </td>
                  <td className="msr-Invoices__dl">
                    {inv.downloadUrl && (
                      <a href={inv.downloadUrl} download>
                        Download
                      </a>
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

/* ------------------------------------------------------------------ */
/* UsageBreakdown                                                      */
/* ------------------------------------------------------------------ */

export interface UsageRow {
  label: React.ReactNode;
  used: number;
  limit?: number;
  /** Display string for the value (defaults to used/limit). */
  display?: React.ReactNode;
  unit?: string;
}

export interface UsageBreakdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  rows: UsageRow[];
  title?: React.ReactNode;
}

/** Itemized usage rows with progress bars against limits. */
export const UsageBreakdown = React.forwardRef<
  HTMLDivElement,
  UsageBreakdownProps
>(function UsageBreakdown({ rows, title, className, ...rest }, ref) {
  return (
    <div ref={ref} className={cx("msr-UsageBreakdown", className)} {...rest}>
      {title && <div className="msr-UsageBreakdown__title">{title}</div>}
      <ul className="msr-UsageBreakdown__list">
        {rows.map((r, i) => {
          const ratio =
            r.limit && r.limit > 0 ? Math.min(1, r.used / r.limit) : null;
          const tone =
            ratio == null
              ? "primary"
              : ratio >= 1
                ? "danger"
                : ratio >= 0.85
                  ? "warning"
                  : "primary";
          return (
            <li key={i} className="msr-UsageBreakdown__row">
              <div className="msr-UsageBreakdown__head">
                <span>{r.label}</span>
                <span className="msr-UsageBreakdown__value">
                  {r.display ??
                    `${r.used.toLocaleString()}${
                      r.limit != null ? ` / ${r.limit.toLocaleString()}` : ""
                    }${r.unit ? ` ${r.unit}` : ""}`}
                </span>
              </div>
              {ratio != null && (
                <div className="msr-UsageBreakdown__track">
                  <div
                    className="msr-UsageBreakdown__fill"
                    data-tone={tone}
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
});
