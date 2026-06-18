import * as React from "react";
import { cx } from "../../lib/cx";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";
import { Select } from "../Select/Select";
import { Checkbox } from "../Checkbox/Checkbox";
import { Switch } from "../Switch/Switch";
import { RadioGroup } from "../Radio/Radio";
import { Slider } from "../Slider/Slider";
import { NumberStepper } from "../NumberStepper/NumberStepper";
import { DatePicker } from "../DatePicker/DatePicker";
import { Button } from "../Button/Button";

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "radio"
  | "slider"
  | "date";

export interface FormFieldSchema {
  name: string;
  type: FormFieldType;
  label?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: unknown;
  /** For select/radio. */
  options?: Array<{ value: string; label: string }>;
  /** For number/slider. */
  min?: number;
  max?: number;
  step?: number;
  /** Span multiple grid columns. */
  colSpan?: number;
  /** Custom validation; return an error string or undefined. */
  validate?: (value: unknown, values: Record<string, unknown>) => string | undefined;
}

export interface FormBuilderProps {
  fields: FormFieldSchema[];
  values?: Record<string, unknown>;
  defaultValues?: Record<string, unknown>;
  onChange?: (values: Record<string, unknown>) => void;
  onSubmit?: (values: Record<string, unknown>) => void;
  submitLabel?: string;
  /** Optional cancel button. */
  onCancel?: () => void;
  cancelLabel?: string;
  columns?: number;
  className?: string;
}

function initialValues(fields: FormFieldSchema[], provided?: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...provided };
  for (const f of fields) {
    if (out[f.name] === undefined) {
      out[f.name] = f.defaultValue ?? (f.type === "checkbox" || f.type === "switch" ? false : f.type === "slider" || f.type === "number" ? f.min ?? 0 : "");
    }
  }
  return out;
}

/** Schema-driven form: pass a JSON `fields` array and get a working form. */
export function FormBuilder({
  fields,
  values,
  defaultValues,
  onChange,
  onSubmit,
  submitLabel = "Submit",
  onCancel,
  cancelLabel = "Cancel",
  columns = 1,
  className,
}: FormBuilderProps) {
  const controlled = values !== undefined;
  const [internal, setInternal] = React.useState(() => initialValues(fields, defaultValues));
  const data = controlled ? values! : internal;
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const setValue = (name: string, value: unknown) => {
    const next = { ...data, [name]: value };
    if (!controlled) setInternal(next);
    onChange?.(next);
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validateAll = (): boolean => {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = data[f.name];
      if (f.required && (v === "" || v === null || v === undefined || v === false)) {
        next[f.name] = `${f.label ?? f.name} is required`;
        continue;
      }
      if (f.type === "email" && typeof v === "string" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
        next[f.name] = "Enter a valid email";
        continue;
      }
      const custom = f.validate?.(v, data);
      if (custom) next[f.name] = custom;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const renderControl = (f: FormFieldSchema) => {
    const v = data[f.name];
    const invalid = !!errors[f.name];
    const tone = invalid ? "danger" : "default";
    switch (f.type) {
      case "textarea":
        return <Textarea fullWidth tone={tone} placeholder={f.placeholder} disabled={f.disabled} value={String(v ?? "")} onChange={(e) => setValue(f.name, e.target.value)} />;
      case "select":
        return <Select fullWidth tone={tone} placeholder={f.placeholder} disabled={f.disabled} options={f.options ?? []} value={String(v ?? "")} onChange={(e) => setValue(f.name, e.target.value)} />;
      case "checkbox":
        return <Checkbox checked={!!v} disabled={f.disabled} label={f.placeholder} onChange={(e) => setValue(f.name, e.target.checked)} />;
      case "switch":
        return <Switch checked={!!v} disabled={f.disabled} onCheckedChange={(c) => setValue(f.name, c)} />;
      case "radio":
        return <RadioGroup options={f.options ?? []} value={String(v ?? "")} disabled={f.disabled} onValueChange={(val) => setValue(f.name, val)} />;
      case "slider":
        return <Slider min={f.min} max={f.max} step={f.step} value={Number(v ?? f.min ?? 0)} disabled={f.disabled} showValue onValueChange={(val) => setValue(f.name, val)} />;
      case "number":
        return <NumberStepper min={f.min} max={f.max} step={f.step} value={Number(v ?? f.min ?? 0)} disabled={f.disabled} onValueChange={(val) => setValue(f.name, val)} />;
      case "date":
        return <DatePicker value={v ? new Date(String(v)) : null} onChange={(d) => setValue(f.name, d ? d.toISOString() : "")} />;
      default:
        return <Input fullWidth tone={tone} type={f.type === "password" ? "password" : f.type === "email" ? "email" : "text"} placeholder={f.placeholder} disabled={f.disabled} value={String(v ?? "")} onChange={(e) => setValue(f.name, e.target.value)} />;
    }
  };

  return (
    <form
      className={cx("msr-FormBuilder", className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (validateAll()) onSubmit?.(data);
      }}
      noValidate
    >
      <div className="msr-FormBuilder__grid" style={{ ["--fb-cols" as string]: columns }}>
        {fields.map((f) => (
          <div key={f.name} className="msr-FormBuilder__cell" style={{ gridColumn: f.colSpan ? `span ${f.colSpan}` : undefined }}>
            <Field label={f.label} hint={f.hint} error={errors[f.name] || undefined} required={f.required}>
              {renderControl(f)}
            </Field>
          </div>
        ))}
      </div>
      <div className="msr-FormBuilder__actions">
        {onCancel && (
          <Button type="button" variant="ghost" tone="neutral" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
