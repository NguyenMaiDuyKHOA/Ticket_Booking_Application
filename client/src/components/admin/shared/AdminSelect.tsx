import type { ChangeEvent, ReactNode } from "react";

type AdminSelectProps = {
  children: ReactNode;
  label: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
};

export function AdminSelect({ children, label, onChange, value }: AdminSelectProps) {
  return (
    <label>
      <span className="text-sm font-bold text-neutral-800">{label}</span>
      <select
        className="mt-2 min-h-11 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-semibold outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        onChange={onChange}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}
