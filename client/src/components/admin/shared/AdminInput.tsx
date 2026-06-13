import type { ChangeEvent } from "react";

type AdminInputProps = {
  error?: string | null;
  label: string;
  min?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  step?: number | string;
  type?: string;
  value?: string;
};

export function AdminInput({
  error,
  label,
  min,
  onChange,
  placeholder,
  readOnly = false,
  step,
  type = "text",
  value,
}: AdminInputProps) {
  return (
    <label>
      <span className="text-sm font-bold text-neutral-800">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        className={`mt-2 min-h-11 w-full rounded-md border px-3 text-sm font-semibold outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 read-only:bg-neutral-50 read-only:text-neutral-500 ${
          error ? "border-red-300 bg-red-50" : "border-black/10"
        }`}
        min={min}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        step={step}
        type={type}
        value={value}
      />
      {error ? <span className="mt-1 block text-xs font-bold text-red-700">{error}</span> : null}
    </label>
  );
}
