import * as React from "react";
import { useClickOutsideObject } from "msr-hooks";
import { cx } from "../../lib/cx";
import { Icon } from "../../lib/icons";
import { Tag } from "../Tag/Tag";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface BaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  /** Called with the typed query (use for async option loading). */
  onInputChange?: (query: string) => void;
  /** Disable built-in label filtering (e.g. when filtering server-side). */
  manualFilter?: boolean;
  emptyMessage?: React.ReactNode;
  className?: string;
  id?: string;
}

export interface SingleComboboxProps extends BaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface MultiComboboxProps extends BaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type ComboboxProps = SingleComboboxProps | MultiComboboxProps;

/** Autocomplete/combobox supporting single or multi (chips) selection. */
export function Combobox(props: ComboboxProps) {
  const {
    options,
    placeholder = "Select…",
    disabled,
    clearable = true,
    onInputChange,
    manualFilter = false,
    emptyMessage = "No options",
    className,
    id,
  } = props;
  const multiple = props.multiple === true;

  const isControlled = props.value !== undefined;
  const [internalSingle, setInternalSingle] = React.useState<string | null>(
    (props as SingleComboboxProps).defaultValue ?? null,
  );
  const [internalMulti, setInternalMulti] = React.useState<string[]>(
    (props as MultiComboboxProps).defaultValue ?? [],
  );

  const selectedSingle = isControlled
    ? ((props as SingleComboboxProps).value ?? null)
    : internalSingle;
  const selectedMulti = isControlled
    ? ((props as MultiComboboxProps).value ?? [])
    : internalMulti;

  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const reactId = React.useId();
  const listId = `${id ?? reactId}-list`;

  useClickOutsideObject(wrapperRef, () => setOpen(false));

  const filtered = React.useMemo(() => {
    if (manualFilter || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, manualFilter]);

  const labelFor = (value: string) => options.find((o) => o.value === value)?.label ?? value;

  const commitSingle = (value: string | null) => {
    if (!isControlled) setInternalSingle(value);
    (props as SingleComboboxProps).onChange?.(value);
  };
  const commitMulti = (values: string[]) => {
    if (!isControlled) setInternalMulti(values);
    (props as MultiComboboxProps).onChange?.(values);
  };

  const select = (opt: ComboboxOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const exists = selectedMulti.includes(opt.value);
      commitMulti(exists ? selectedMulti.filter((v) => v !== opt.value) : [...selectedMulti, opt.value]);
      setQuery("");
      inputRef.current?.focus();
    } else {
      commitSingle(opt.value);
      setQuery("");
      setOpen(false);
    }
  };

  const clear = () => {
    if (multiple) commitMulti([]);
    else commitSingle(null);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && filtered[active]) select(filtered[active]);
      else setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && multiple && !query && selectedMulti.length) {
      commitMulti(selectedMulti.slice(0, -1));
    }
  };

  const hasValue = multiple ? selectedMulti.length > 0 : selectedSingle != null;
  const showInputValue = multiple ? query : open ? query : (selectedSingle ? labelFor(selectedSingle) : query);

  return (
    <div ref={wrapperRef} className={cx("msr-Combobox", className)} data-disabled={disabled || undefined}>
      <div className="msr-Combobox__control" data-open={open || undefined} onClick={() => !disabled && (setOpen(true), inputRef.current?.focus())}>
        {multiple &&
          selectedMulti.map((v) => (
            <Tag key={v} size="sm" tone="primary" onRemove={() => commitMulti(selectedMulti.filter((x) => x !== v))}>
              {labelFor(v)}
            </Tag>
          ))}
        <input
          ref={inputRef}
          id={id ?? reactId}
          className="msr-Combobox__input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          disabled={disabled}
          placeholder={hasValue && !multiple ? undefined : placeholder}
          value={showInputValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            onInputChange?.(e.target.value);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {clearable && hasValue && !disabled && (
          <button type="button" className="msr-Combobox__clear" aria-label="Clear" onClick={(e) => { e.stopPropagation(); clear(); }}>
            <Icon name="close" size={14} />
          </button>
        )}
        <span className="msr-Combobox__chevron" aria-hidden="true">
          <Icon name="chevronDown" size={16} />
        </span>
      </div>

      {open && (
        <ul id={listId} role="listbox" aria-multiselectable={multiple} className="msr-Combobox__list">
          {filtered.length === 0 ? (
            <li className="msr-Combobox__empty">{emptyMessage}</li>
          ) : (
            filtered.map((opt, i) => {
              const selected = multiple ? selectedMulti.includes(opt.value) : selectedSingle === opt.value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={opt.disabled || undefined}
                  data-active={i === active || undefined}
                  data-selected={selected || undefined}
                  data-disabled={opt.disabled || undefined}
                  className="msr-Combobox__option"
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); select(opt); }}
                >
                  <span className="msr-Combobox__option-label">{opt.label}</span>
                  {selected && <Icon name="check" size={14} />}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
