"use client";

import { Check, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { Link } from "@/i18n/navigation";

export type FilterDropdownOption = {
  description?: string;
  href?: string;
  label: string;
  value: string;
};

type FilterDropdownVariant = "field" | "nav";

type FilterDropdownProps = {
  accentClassName?: string;
  className?: string;
  icon?: LucideIcon;
  label: string;
  menuClassName?: string;
  onChange?: (value: string) => void;
  options: FilterDropdownOption[];
  value?: string;
  variant?: FilterDropdownVariant;
};

// Renders a reusable dropdown for navigation links and filter selections.
export function FilterDropdown({
  accentClassName = "text-red-700",
  className = "",
  icon: Icon,
  label,
  menuClassName = "",
  onChange,
  options,
  value,
  variant = "field",
}: FilterDropdownProps) {
  const dropdownId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];
  const isNav = variant === "nav";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Selects an option and closes the menu for filter usage.
  function handleSelect(option: FilterDropdownOption) {
    onChange?.(option.value);
    setIsOpen(false);
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {isNav ? (
        <button
          type="button"
          aria-controls={dropdownId}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen((current) => !current)}
          className="inline-flex items-center gap-1 font-semibold text-neutral-600 transition hover:text-neutral-950"
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <button
          type="button"
          aria-controls={dropdownId}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => setIsOpen((current) => !current)}
          className="w-full text-left"
        >
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-neutral-500">
            {Icon ? <Icon className={`h-4 w-4 ${accentClassName}`} aria-hidden="true" /> : null}
            {label}
          </span>
          <span className="mt-1 flex min-h-5 items-center justify-between gap-3 text-sm font-bold text-neutral-950">
            <span className="truncate">{selectedOption?.label}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-neutral-500 transition ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>
      )}

      {isOpen ? (
        <div
          id={dropdownId}
          role={isNav ? "menu" : "listbox"}
          className={`absolute left-0 top-full z-40 mt-2 min-w-48 overflow-hidden rounded-lg border border-black/10 bg-white p-1 shadow-xl ${menuClassName}`}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedOption?.value;
            const itemClassName = `flex w-full items-start justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
              isSelected
                ? "bg-neutral-100 text-neutral-950"
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
            }`;
            const content = (
              <>
                <span>
                  <span className="block font-black">{option.label}</span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs font-semibold text-neutral-500">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {!isNav && isSelected ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                ) : null}
              </>
            );

            if (option.href) {
              return (
                <Link
                  key={option.value}
                  href={option.href}
                  role={isNav ? "menuitem" : "option"}
                  aria-selected={isNav ? undefined : isSelected}
                  onClick={() => handleSelect(option)}
                  className={itemClassName}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={option.value}
                type="button"
                role={isNav ? "menuitem" : "option"}
                aria-selected={isNav ? undefined : isSelected}
                onClick={() => handleSelect(option)}
                className={itemClassName}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
