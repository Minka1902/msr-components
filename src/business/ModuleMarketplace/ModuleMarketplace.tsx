import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { Button } from "../../components/Button/Button";

export interface MarketplaceModule {
  id: string;
  name: string;
  description?: string;
  icon?: IconName | React.ReactNode;
  enabled?: boolean;
  /** e.g. "Popular", "New". */
  tag?: string;
  /** Disable the enable button (e.g. unmet requirements). */
  locked?: boolean;
}

export interface ModuleMarketplaceProps extends React.HTMLAttributes<HTMLDivElement> {
  modules: MarketplaceModule[];
  onToggle?: (id: string, enabled: boolean) => void;
  columns?: number;
}

function renderIcon(icon: IconName | React.ReactNode | undefined, fallback: IconName) {
  if (!icon) return <Icon name={fallback} size={20} />;
  return typeof icon === "string" ? <Icon name={icon as IconName} size={20} /> : icon;
}

/** Grid of enable-able business module cards. */
export const ModuleMarketplace = React.forwardRef<HTMLDivElement, ModuleMarketplaceProps>(
  function ModuleMarketplace({ modules, onToggle, columns = 3, className, style, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cx("msr-Marketplace", className)}
        style={{ ["--mp-cols" as string]: columns, ...style }}
        {...rest}
      >
        {modules.map((m) => (
          <div key={m.id} className="msr-Marketplace__card" data-enabled={m.enabled || undefined}>
            <div className="msr-Marketplace__top">
              <span className="msr-Marketplace__icon">{renderIcon(m.icon, "settings")}</span>
              {m.enabled ? (
                <StatusBadge tone="success" variant="soft" size="sm" dot>Enabled</StatusBadge>
              ) : m.tag ? (
                <StatusBadge tone="new" variant="soft" size="sm">{m.tag}</StatusBadge>
              ) : null}
            </div>
            <div className="msr-Marketplace__name">{m.name}</div>
            {m.description && <p className="msr-Marketplace__desc">{m.description}</p>}
            <div className="msr-Marketplace__footer">
              <Button
                size="sm"
                variant={m.enabled ? "outline" : "solid"}
                tone={m.enabled ? "neutral" : "primary"}
                disabled={m.locked}
                fullWidth
                onClick={() => onToggle?.(m.id, !m.enabled)}
              >
                {m.locked ? "Locked" : m.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  },
);
