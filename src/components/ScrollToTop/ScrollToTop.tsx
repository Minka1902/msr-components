import * as React from "react";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";

export interface ScrollToTopProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show the button after scrolling past this many px (default 300). */
  threshold?: number;
  /** Element to scroll; defaults to window. */
  target?: React.RefObject<HTMLElement>;
  label?: string;
}

/** Floating button that appears after scrolling and returns to the top. */
export const ScrollToTop = React.forwardRef<HTMLButtonElement, ScrollToTopProps>(
  function ScrollToTop({ threshold = 300, target, label = "Scroll to top", className, ...rest }, ref) {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
      const el: HTMLElement | Window = target?.current ?? window;
      const getTop = () => (el === window ? window.scrollY : (el as HTMLElement).scrollTop);
      const onScroll = () => setVisible(getTop() > threshold);
      onScroll();
      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
    }, [threshold, target]);

    const scrollUp = () => {
      const el: HTMLElement | Window = target?.current ?? window;
      el.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cx("msr-ScrollToTop", className)}
        data-visible={visible || undefined}
        aria-label={label}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onClick={scrollUp}
        {...rest}
      >
        <Icon name="arrowUp" size={20} />
      </button>
    );
  },
);
