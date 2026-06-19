import * as React from "react";
import { MaskedInput, type MaskedInputProps } from "./MaskedInput";

export interface PhoneInputProps extends Omit<MaskedInputProps, "mask"> {
  /** Mask format; defaults to US-style "(###) ###-####". */
  format?: string;
}

/** Phone-number input with a sensible default mask. */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput({ format = "(###) ###-####", placeholder, ...rest }, ref) {
    return <MaskedInput ref={ref} mask={format} placeholder={placeholder ?? format.replace(/#/g, "0")} {...rest} />;
  },
);
