import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface MaintenancePageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  message?: React.ReactNode;
  icon?: IconName;
  /** Optional ETA / back-online time. */
  eta?: React.ReactNode;
  /** Status/links area (e.g. status page link). */
  actions?: React.ReactNode;
  /** Brand/logo node rendered above the icon. */
  brand?: React.ReactNode;
}

/** Full-bleed "we'll be right back" maintenance screen. */
export const MaintenancePage = React.forwardRef<HTMLDivElement, MaintenancePageProps>(function MaintenancePage(
  {
    title = "Under maintenance",
    message = "We're making things better. Please check back shortly.",
    icon = "settings",
    eta,
    actions,
    brand,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div ref={ref} className={cx("msr-MaintenancePage", className)} role="status" {...rest}>
      <div className="msr-MaintenancePage__inner">
        {brand && <div className="msr-MaintenancePage__brand">{brand}</div>}
        <span className="msr-MaintenancePage__icon" aria-hidden="true">
          <Icon name={icon} size={36} />
        </span>
        <h1 className="msr-MaintenancePage__title">{title}</h1>
        <p className="msr-MaintenancePage__message">{message}</p>
        {eta && <div className="msr-MaintenancePage__eta">{eta}</div>}
        {actions && <div className="msr-MaintenancePage__actions">{actions}</div>}
      </div>
    </div>
  );
});
