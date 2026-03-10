import type { ReactNode } from "react";
import { FieldLabel } from "./field-label";
import { SelectButton } from "./select-button";

interface OptionSelectorProps<T extends string> {
  label: string;
  icon: ReactNode;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  stretch?: boolean;
}

export function OptionSelector<T extends string>({ label, icon, options, value, onChange, stretch = false }: OptionSelectorProps<T>) {
  return (
    <div className="space-y-3">
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <div className={`flex gap-2 ${stretch ? '' : 'flex-wrap'}`}>
        {options.map((opt) => (
          <SelectButton
            key={opt}
            active={value === opt}
            onClick={() => onChange(opt)}
            className={stretch ? 'flex-1' : ''}
          >
            {opt}
          </SelectButton>
        ))}
      </div>
    </div>
  );
}