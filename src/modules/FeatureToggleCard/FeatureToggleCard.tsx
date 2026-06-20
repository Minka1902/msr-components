import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Switch } from "../../components/Switch/Switch";

export interface FeatureToggleCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  /** Requirements that must be met before the feature can be enabled. */
  missingRequirements?: string[];
  /** Setup action button label/handler. */
  onSetup?: () => void;
  setupLabel?: string;
  disabled?: boolean;
}

/** Card with a switch, status, and missing-requirement hints for a feature. */
export const FeatureToggleCard = React.forwardRef<HTMLDivElement, FeatureToggleCardProps>(
  function FeatureToggleCard(
    {
      title,
      description,
      icon,
      enabled,
      onToggle,
      missingRequirements,
      onSetup,
      setupLabel = "Set up",
      disabled,
      className,
      ...rest
    },
    ref,
  ) {
    const hasMissing = !!missingRequirements?.length;
    const blocked = disabled || hasMissing;
    const labelId = React.useId();

    return (
      <div
        ref={ref}
        className={cx("msr-FeatureToggle", className)}
        data-enabled={enabled || undefined}
        {...rest}
      >
        <div className="msr-FeatureToggle__main">
          {icon && <span className="msr-FeatureToggle__icon">{icon}</span>}
          <div className="msr-FeatureToggle__text">
            <div id={labelId} className="msr-FeatureToggle__title">
              {title}
            </div>
            {description && (
              <div className="msr-FeatureToggle__description">{description}</div>
            )}
          </div>
          <Switch
            checked={enabled}
            aria-labelledby={labelId}
            disabled={blocked}
            onCheckedChange={onToggle}
          />
        </div>

        {hasMissing && (
          <div className="msr-FeatureToggle__requirements">
            <div className="msr-FeatureToggle__req-title">
              <Icon name="warning" size={14} /> Requires setup
            </div>
            <ul>
              {missingRequirements!.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            {onSetup && (
              <button type="button" className="msr-FeatureToggle__setup" onClick={onSetup}>
                {setupLabel}
                <Icon name="arrowRight" size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  },
);
