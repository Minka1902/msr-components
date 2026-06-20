import * as React from "react";
import { cx } from "../../lib/cx";
import { DescriptionList, type DescriptionItem } from "../../components/DataDisplay/DataDisplay";

export interface Facts {
  capital?: string;
  language?: string;
  currency?: string;
  population?: number;
  area?: number;
  borders?: string[];
}

export interface FactRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  countryName: React.ReactNode;
  flag?: string;
  facts: Facts;
}

/** Reveals country facts (capital, language, currency, population…) after a guess. */
export const FactReveal = React.forwardRef<HTMLDivElement, FactRevealProps>(
  function FactReveal({ countryName, flag, facts, className, ...rest }, ref) {
    const items: DescriptionItem[] = [];
    if (facts.capital) items.push({ term: "Capital", description: facts.capital });
    if (facts.language) items.push({ term: "Language", description: facts.language });
    if (facts.currency) items.push({ term: "Currency", description: facts.currency });
    if (facts.population != null) items.push({ term: "Population", description: facts.population.toLocaleString() });
    if (facts.area != null) items.push({ term: "Area", description: `${facts.area.toLocaleString()} km²` });

    return (
      <div ref={ref} className={cx("msr-FactReveal", className)} {...rest}>
        <div className="msr-FactReveal__header">
          {flag && <span className="msr-FactReveal__flag">{flag}</span>}
          <span className="msr-FactReveal__name">{countryName}</span>
        </div>
        <DescriptionList items={items} columns={2} />
        {facts.borders && facts.borders.length > 0 && (
          <div className="msr-FactReveal__borders">
            <span className="msr-FactReveal__borders-label">Borders</span>
            <div className="msr-FactReveal__chips">
              {facts.borders.map((b) => (
                <span key={b} className="msr-FactReveal__chip">{b}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
