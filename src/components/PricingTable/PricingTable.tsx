import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface PricingFeature {
  text: React.ReactNode;
  included?: boolean;
}

export interface PricingPlan {
  id: string;
  name: React.ReactNode;
  price: React.ReactNode;
  /** e.g. "/mo". */
  period?: React.ReactNode;
  description?: React.ReactNode;
  features: Array<string | PricingFeature>;
  highlighted?: boolean;
  badge?: string;
  ctaLabel?: string;
}

export interface PricingTableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  plans: PricingPlan[];
  onSelectPlan?: (plan: PricingPlan) => void;
  /** id of the currently active plan. */
  currentPlanId?: string;
}

function normalize(f: string | PricingFeature): PricingFeature {
  return typeof f === "string" ? { text: f, included: true } : { included: true, ...f };
}

/** Side-by-side pricing plan comparison cards. */
export const PricingTable = React.forwardRef<HTMLDivElement, PricingTableProps>(function PricingTable(
  { plans, onSelectPlan, currentPlanId, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-PricingTable", className)} {...rest}>
      {plans.map((plan) => {
        const isCurrent = plan.id === currentPlanId;
        return (
          <div key={plan.id} className="msr-PricingTable__plan" data-highlighted={plan.highlighted || undefined}>
            {plan.badge && <span className="msr-PricingTable__badge">{plan.badge}</span>}
            <div className="msr-PricingTable__name">{plan.name}</div>
            <div className="msr-PricingTable__price">
              <span className="msr-PricingTable__amount">{plan.price}</span>
              {plan.period && <span className="msr-PricingTable__period">{plan.period}</span>}
            </div>
            {plan.description && <p className="msr-PricingTable__desc">{plan.description}</p>}
            <ul className="msr-PricingTable__features">
              {plan.features.map((raw, i) => {
                const f = normalize(raw);
                return (
                  <li key={i} className="msr-PricingTable__feature" data-excluded={!f.included || undefined}>
                    <Icon name={f.included ? "check" : "close"} size={15} />
                    <span>{f.text}</span>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="msr-PricingTable__cta"
              data-variant={plan.highlighted ? "primary" : "outline"}
              disabled={isCurrent}
              onClick={() => onSelectPlan?.(plan)}
            >
              {isCurrent ? "Current plan" : (plan.ctaLabel ?? "Choose plan")}
            </button>
          </div>
        );
      })}
    </div>
  );
});
