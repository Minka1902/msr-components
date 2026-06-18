import * as React from "react";
import { cx } from "../../lib/cx";

/** Horizontal action bar. Use <Toolbar.Group> and <Toolbar.Separator> inside. */
export const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function Toolbar({ className, ...rest }, ref) {
    return <div ref={ref} role="toolbar" className={cx("msr-Toolbar", className)} {...rest} />;
  },
) as React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
> & {
  Group: typeof ToolbarGroup;
  Separator: typeof ToolbarSeparator;
  Spacer: typeof ToolbarSpacer;
};

const ToolbarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function ToolbarGroup({ className, ...rest }, ref) {
    return <div ref={ref} className={cx("msr-Toolbar__group", className)} {...rest} />;
  },
);

function ToolbarSeparator() {
  return <span className="msr-Toolbar__separator" role="separator" aria-orientation="vertical" />;
}

function ToolbarSpacer() {
  return <span className="msr-Toolbar__spacer" aria-hidden="true" />;
}

Toolbar.Group = ToolbarGroup;
Toolbar.Separator = ToolbarSeparator;
Toolbar.Spacer = ToolbarSpacer;
