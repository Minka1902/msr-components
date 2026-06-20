import * as React from "react";
import { cx } from "../../lib/cx";

export interface OdometerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "prefix"> {
  value: number;
  /** Group thousands with separators. */
  group?: boolean;
  /** Fixed decimal places. */
  decimals?: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function DigitReel({ digit }: { digit: number }) {
  return (
    <span className="msr-Odometer__digit">
      <span className="msr-Odometer__reel" style={{ transform: `translateY(${-digit * 10}%)` }}>
        {DIGITS.map((d) => (
          <span key={d} className="msr-Odometer__num">{d}</span>
        ))}
      </span>
    </span>
  );
}

/** Number with rolling-digit reels that animate on value change. */
export const Odometer = React.forwardRef<HTMLSpanElement, OdometerProps>(function Odometer(
  { value, group = true, decimals = 0, prefix, suffix, className, ...rest },
  ref,
) {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = group ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : intPart;
  const chars = (decPart ? `${grouped}.${decPart}` : grouped).split("");

  return (
    <span ref={ref} className={cx("msr-Odometer", className)} role="img" aria-label={fixed} {...rest}>
      {prefix && <span className="msr-Odometer__affix">{prefix}</span>}
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <DigitReel key={i} digit={Number(ch)} />
        ) : (
          <span key={i} className="msr-Odometer__sep">{ch}</span>
        ),
      )}
      {suffix && <span className="msr-Odometer__affix">{suffix}</span>}
    </span>
  );
});
