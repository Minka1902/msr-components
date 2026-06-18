import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export type FabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type FabSize = "md" | "lg";

export interface FabAction {
  id: string;
  label: string;
  icon: IconName | React.ReactNode;
  onSelect: () => void;
}

export interface FloatingActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Icon for the main button. Defaults to a plus. */
  icon?: IconName | React.ReactNode;
  label?: string;
  position?: FabPosition;
  size?: FabSize;
  /** When provided, the FAB expands into a speed-dial of actions on click. */
  actions?: FabAction[];
  /** Fix the FAB to the viewport (default true). Set false to position inline. */
  fixed?: boolean;
}

function renderIcon(icon: IconName | React.ReactNode, size: number): React.ReactNode {
  return typeof icon === "string" ? <Icon name={icon as IconName} size={size} /> : icon;
}

/** Prominent circular action button, optionally expanding into a speed-dial. */
export const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(function FloatingActionButton(
  {
    icon = "plus",
    label = "Actions",
    position = "bottom-right",
    size = "lg",
    actions,
    fixed = true,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const hasActions = !!actions?.length;

  return (
    <div
      className={cx("msr-Fab", className)}
      data-position={position}
      data-fixed={fixed || undefined}
      data-open={open || undefined}
    >
      {hasActions && (
        <div className="msr-Fab__actions" role="menu" aria-hidden={!open}>
          {actions!.map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              className="msr-Fab__action"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                a.onSelect();
                setOpen(false);
              }}
            >
              <span className="msr-Fab__action-label">{a.label}</span>
              <span className="msr-Fab__action-icon">{renderIcon(a.icon, 18)}</span>
            </button>
          ))}
        </div>
      )}
      <button
        ref={ref}
        type="button"
        className="msr-Fab__main"
        data-size={size}
        aria-label={label}
        aria-expanded={hasActions ? open : undefined}
        onClick={(e) => {
          if (hasActions) setOpen((o) => !o);
          onClick?.(e);
        }}
        {...rest}
      >
        {renderIcon(icon, size === "lg" ? 24 : 20)}
      </button>
    </div>
  );
});
