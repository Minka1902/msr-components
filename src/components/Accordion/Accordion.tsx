import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { useControllableState } from "../../lib/useControllableState";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  /** Optional content rendered on the right of the header (e.g. a badge). */
  meta?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: AccordionItem[];
  /** Allow multiple panels open at once. */
  multiple?: boolean;
  /** Controlled list of open ids. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (openIds: string[]) => void;
}

/** Collapsible sections; single (default) or multiple open. */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(
    { items, multiple = false, value, defaultValue, onValueChange, className, ...rest },
    ref,
  ) {
    const [open, setOpen] = useControllableState<string[]>({
      value,
      defaultValue: defaultValue ?? [],
      onChange: onValueChange,
    });

    const toggle = (id: string) => {
      const isOpen = open.includes(id);
      if (multiple) {
        setOpen(isOpen ? open.filter((x) => x !== id) : [...open, id]);
      } else {
        setOpen(isOpen ? [] : [id]);
      }
    };

    return (
      <div ref={ref} className={cx("msr-Accordion", className)} {...rest}>
        {items.map((item) => {
          const expanded = open.includes(item.id);
          return (
            <div key={item.id} className="msr-Accordion__item" data-expanded={expanded || undefined}>
              <h3 className="msr-Accordion__heading">
                <button
                  type="button"
                  className="msr-Accordion__trigger"
                  aria-expanded={expanded}
                  disabled={item.disabled}
                  onClick={() => toggle(item.id)}
                >
                  <span className="msr-Accordion__chevron" aria-hidden="true">
                    <Icon name="chevronRight" size={16} />
                  </span>
                  <span className="msr-Accordion__title">{item.title}</span>
                  {item.meta && <span className="msr-Accordion__meta">{item.meta}</span>}
                </button>
              </h3>
              {expanded && <div className="msr-Accordion__panel">{item.content}</div>}
            </div>
          );
        })}
      </div>
    );
  },
);
