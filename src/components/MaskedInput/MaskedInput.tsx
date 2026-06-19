import * as React from "react";
import { Input, type InputProps } from "../Input/Input";

export interface MaskedInputProps extends Omit<InputProps, "value" | "defaultValue" | "onChange"> {
  /**
   * Mask pattern. Tokens: `#` = digit, `A` = letter, `*` = alphanumeric.
   * Any other character is a literal inserted automatically.
   * e.g. "(###) ###-####" or "##/##/####".
   */
  mask: string;
  value?: string;
  defaultValue?: string;
  /** Receives the formatted value and the raw (token-only) value. */
  onValueChange?: (formatted: string, raw: string) => void;
}

const TOKENS: Record<string, RegExp> = {
  "#": /\d/,
  A: /[a-zA-Z]/,
  "*": /[a-zA-Z0-9]/,
};

function applyMask(raw: string, mask: string): { formatted: string; raw: string } {
  let out = "";
  let usedRaw = "";
  let ri = 0;
  for (let mi = 0; mi < mask.length && ri < raw.length; mi++) {
    const mc = mask[mi];
    const token = TOKENS[mc];
    if (token) {
      // consume raw chars until one matches the token
      while (ri < raw.length && !token.test(raw[ri])) ri++;
      if (ri < raw.length) {
        out += raw[ri];
        usedRaw += raw[ri];
        ri++;
      }
    } else {
      out += mc; // literal
    }
  }
  return { formatted: out, raw: usedRaw };
}

/** Input that formats typed text against a mask pattern (#/A/*). */
export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  function MaskedInput({ mask, value, defaultValue = "", onValueChange, ...rest }, ref) {
    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState(() => applyMask(defaultValue, mask).formatted);
    const display = controlled ? applyMask(value, mask).formatted : internal;

    return (
      <Input
        ref={ref}
        value={display}
        inputMode={/^[#\s()/.-]*$/.test(mask) ? "numeric" : undefined}
        onChange={(e) => {
          const { formatted, raw } = applyMask(e.target.value, mask);
          if (!controlled) setInternal(formatted);
          onValueChange?.(formatted, raw);
        }}
        {...rest}
      />
    );
  },
);
