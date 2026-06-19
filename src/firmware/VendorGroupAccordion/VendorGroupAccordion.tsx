import * as React from "react";
import { cx } from "../../lib/cx";
import { Accordion, type AccordionItem } from "../../components/Accordion/Accordion";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { FilePathViewer } from "../../components/FilePathViewer/FilePathViewer";

export interface VendorGroup {
  vendor: string;
  /** File paths observed for this vendor. */
  paths: string[];
}

export interface VendorGroupAccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  groups: VendorGroup[];
  multiple?: boolean;
  defaultOpen?: string[];
}

/** Per-vendor collapsible list of file paths (built on Accordion). */
export const VendorGroupAccordion = React.forwardRef<HTMLDivElement, VendorGroupAccordionProps>(
  function VendorGroupAccordion({ groups, multiple = true, defaultOpen, className, ...rest }, ref) {
    const items: AccordionItem[] = groups.map((g) => ({
      id: g.vendor,
      title: g.vendor,
      meta: <StatusBadge tone="muted" size="sm">{g.paths.length}</StatusBadge>,
      content: (
        <ul className="msr-VendorGroup__paths">
          {g.paths.map((p, i) => (
            <li key={i}>
              <FilePathViewer path={p} />
            </li>
          ))}
        </ul>
      ),
    }));

    return (
      <div ref={ref} className={cx("msr-VendorGroup", className)} {...rest}>
        <Accordion items={items} multiple={multiple} defaultValue={defaultOpen} />
      </div>
    );
  },
);
