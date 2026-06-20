import * as React from "react";
import { cx } from "../../lib/cx";
import { ConfidenceBadge } from "../ConfidenceBadge/ConfidenceBadge";

export interface ObservedName {
  name: string;
  count: number;
}

export interface CommonNameDetectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The most likely / canonical name. */
  mostCommonName: string;
  /** Other observed names with occurrence counts. */
  otherNames?: ObservedName[];
  /** Confidence 0–1 or 0–100. */
  confidence: number;
  title?: React.ReactNode;
}

/** Shows the inferred canonical name, alternatives, and a confidence badge. */
export const CommonNameDetector = React.forwardRef<HTMLDivElement, CommonNameDetectorProps>(
  function CommonNameDetector(
    { mostCommonName, otherNames = [], confidence, title = "Detected name", className, ...rest },
    ref,
  ) {
    const total = otherNames.reduce((s, n) => s + n.count, 0) + 1;
    return (
      <div ref={ref} className={cx("msr-CommonName", className)} {...rest}>
        <div className="msr-CommonName__header">
          <span className="msr-CommonName__title">{title}</span>
          <ConfidenceBadge confidence={confidence} />
        </div>
        <div className="msr-CommonName__primary">
          <code className="msr-CommonName__name">{mostCommonName}</code>
        </div>
        {otherNames.length > 0 && (
          <div className="msr-CommonName__others">
            <span className="msr-CommonName__others-label">Also observed</span>
            <ul className="msr-CommonName__list">
              {otherNames.map((n) => (
                <li key={n.name} className="msr-CommonName__row">
                  <code className="msr-CommonName__alt">{n.name}</code>
                  <span className="msr-CommonName__bar">
                    <span className="msr-CommonName__fill" style={{ width: `${(n.count / total) * 100}%` }} />
                  </span>
                  <span className="msr-CommonName__count">{n.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);
