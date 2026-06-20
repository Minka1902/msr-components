import * as React from "react";
import { cx } from "../../lib/cx";

export interface CountryFlagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "title"> {
  /** ISO 3166-1 alpha-2 country code, e.g. "US", "fr", "JP". */
  code: string;
  /** Accessible label; defaults to the uppercased code. */
  title?: string;
  /** Font-size driven flag size. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Show the code text next to the flag. */
  showCode?: boolean;
}

const OFFSET = 0x1f1e6; // Regional Indicator Symbol Letter A
const A = "A".charCodeAt(0);

/** Convert a 2-letter country code to its emoji flag (regional indicators). */
export function codeToFlagEmoji(code: string): string {
  const cc = code.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(cc)) return "";
  return String.fromCodePoint(
    OFFSET + (cc.charCodeAt(0) - A),
    OFFSET + (cc.charCodeAt(1) - A),
  );
}

/** Renders a country's flag emoji from its ISO code (no image assets). */
export const CountryFlag = React.forwardRef<HTMLSpanElement, CountryFlagProps>(function CountryFlag(
  { code, title, size = "md", showCode = false, className, ...rest },
  ref,
) {
  const cc = code.trim().toUpperCase();
  const emoji = codeToFlagEmoji(cc);
  const label = title ?? cc;

  return (
    <span
      ref={ref}
      className={cx("msr-CountryFlag", className)}
      data-size={size}
      role="img"
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className="msr-CountryFlag__glyph" aria-hidden="true">
        {emoji || "🏳"}
      </span>
      {showCode && <span className="msr-CountryFlag__code">{cc}</span>}
    </span>
  );
});
