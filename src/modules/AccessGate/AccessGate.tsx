import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface AccessGateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether clients can currently use the module. */
  accessible: boolean;
  moduleName?: React.ReactNode;
  /** Reasons access is blocked (shown when not accessible). */
  blockers?: string[];
  action?: React.ReactNode;
}

/** Shows whether clients can use a module yet, with blocking reasons. */
export const AccessGate = React.forwardRef<HTMLDivElement, AccessGateProps>(
  function AccessGate({ accessible, moduleName, blockers = [], action, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx("msr-AccessGate", className)} data-accessible={accessible || undefined} {...rest}>
        <span className="msr-AccessGate__icon">
          <Icon name={accessible ? "checkCircle" : "shieldAlert"} size={20} />
        </span>
        <div className="msr-AccessGate__body">
          <div className="msr-AccessGate__title">
            {accessible ? "Clients can access" : "Not available to clients"}
            {moduleName && <span className="msr-AccessGate__module"> · {moduleName}</span>}
          </div>
          {!accessible && blockers.length > 0 && (
            <ul className="msr-AccessGate__blockers">
              {blockers.map((b, i) => (
                <li key={i}><Icon name="close" size={12} /> {b}</li>
              ))}
            </ul>
          )}
        </div>
        {action && <div className="msr-AccessGate__action">{action}</div>}
      </div>
    );
  },
);
