import * as React from "react";
import { cx } from "../../lib/cx";
import { Combobox, type ComboboxOption } from "../../components/Combobox/Combobox";

export interface Country {
  code: string;
  name: string;
  flag?: string;
  continent?: string;
}

export interface GuessInputProps {
  countries: Country[];
  /** Already-guessed country codes to disable. */
  guessed?: string[];
  onGuess?: (country: Country) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** Searchable country picker (flag + continent) for guessing games. */
export function GuessInput({
  countries,
  guessed = [],
  onGuess,
  placeholder = "Guess a country…",
  disabled,
  className,
}: GuessInputProps) {
  const [value, setValue] = React.useState<string | null>(null);
  const byCode = React.useMemo(() => new Map(countries.map((c) => [c.code, c])), [countries]);

  const options: ComboboxOption[] = countries.map((c) => ({
    value: c.code,
    label: `${c.flag ? `${c.flag} ` : ""}${c.name}${c.continent ? ` · ${c.continent}` : ""}`,
    disabled: guessed.includes(c.code),
  }));

  return (
    <div className={cx("msr-GuessInput", className)}>
      <Combobox
        options={options}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        clearable={false}
        onChange={(code) => {
          setValue(null); // reset so the same field can be reused for the next guess
          const c = code ? byCode.get(code) : undefined;
          if (c) onGuess?.(c);
        }}
      />
    </div>
  );
}
