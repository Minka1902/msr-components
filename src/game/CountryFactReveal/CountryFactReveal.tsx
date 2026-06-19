import * as React from "react";
import { cx } from "../../lib/cx";
import { DescriptionList, type DescriptionItem } from "../../components/DataDisplay/DataDisplay";

export interface CountryFacts {
  capital?: string;
  language?: string;
  currency?: string;
  population?: number;
  area?: number;
  borders?: string[];
}

export interface CountryFactRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  countryName: React.ReactNode;
  flag?: string;
  facts: CountryFacts;
}

/** Reveals country facts (capital, language, currency, population…) after a guess. */
export const CountryFactReveal = React.forwardRef<HTMLDivElement, CountryFactRevealProps>(
  function CountryFactReveal({ countryName, flag, facts, className, ...rest }, ref) {
    const items: DescriptionItem[] = [];
    if (facts.capital) items.push({ term: "Capital", description: facts.capital });
    if (facts.language) items.push({ term: "Language", description: facts.language });
    if (facts.currency) items.push({ term: "Currency", description: facts.currency });
    if (facts.population != null) items.push({ term: "Population", description: facts.population.toLocaleString() });
    if (facts.area != null) items.push({ term: "Area", description: `${facts.area.toLocaleString()} km²` });

    return (
      <div ref={ref} className={cx("msr-CountryFact", className)} {...rest}>
        <div className="msr-CountryFact__header">
          {flag && <span className="msr-CountryFact__flag">{flag}</span>}
          <span className="msr-CountryFact__name">{countryName}</span>
        </div>
        <DescriptionList items={items} columns={2} />
        {facts.borders && facts.borders.length > 0 && (
          <div className="msr-CountryFact__borders">
            <span className="msr-CountryFact__borders-label">Borders</span>
            <div className="msr-CountryFact__chips">
              {facts.borders.map((b) => (
                <span key={b} className="msr-CountryFact__chip">{b}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);
