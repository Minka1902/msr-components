import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon, type IconName } from "../../lib/icons";

export interface DockItem {
  id: string;
  label: React.ReactNode;
  icon?: IconName;
  /** Custom content instead of an icon glyph. */
  content?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface DockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: DockItem[];
  /** Base icon size, px. */
  size?: number;
  /** Peak magnification factor on hover. */
  magnification?: number;
  /** Influence radius of the magnifier, px. */
  range?: number;
}

/** macOS-style dock that magnifies items near the pointer. */
export const Dock = React.forwardRef<HTMLDivElement, DockProps>(function Dock(
  { items, size = 44, magnification = 1.7, range = 120, className, ...rest },
  ref,
) {
  const [mouseX, setMouseX] = React.useState<number | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const scaleFor = (i: number): number => {
    if (mouseX == null) return 1;
    const el = itemRefs.current[i];
    if (!el) return 1;
    const r = el.getBoundingClientRect();
    const center = r.left + r.width / 2;
    const dist = Math.abs(mouseX - center);
    if (dist > range) return 1;
    const t = 1 - dist / range; // 0..1
    return 1 + (magnification - 1) * t * t;
  };

  return (
    <div
      ref={ref}
      className={cx("msr-Dock", className)}
      style={{ ["--msr-dock-size" as string]: `${size}px` }}
      onPointerMove={(e) => setMouseX(e.clientX)}
      onPointerLeave={() => setMouseX(null)}
      {...rest}
    >
      {items.map((item, i) => {
        const scale = scaleFor(i);
        return (
          <button
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            className="msr-Dock__item"
            data-active={item.active || undefined}
            style={{ width: size * scale, height: size * scale }}
            aria-label={typeof item.label === "string" ? item.label : item.id}
            title={typeof item.label === "string" ? item.label : undefined}
            onClick={item.onClick}
          >
            {item.content ?? (item.icon && <Icon name={item.icon} size={Math.round(size * 0.5 * scale)} />)}
            <span className="msr-Dock__tooltip">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
});
