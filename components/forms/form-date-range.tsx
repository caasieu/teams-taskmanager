"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface FormDateRangeProps<T extends FieldValues> {
  startName: Path<T>;
  endName: Path<T>;
  register: UseFormRegister<T>;
  disabled?: boolean;
  required?: boolean | string;
}

export function FormDateRange<T extends FieldValues>({
  startName,
  endName,
  register,
  disabled = false,
  required = false,
}: FormDateRangeProps<T>) {
  const wrapperStyles = `w-full p-2.5 h-[2.2rem] border rounded bg-app-surface flex items-center transition-colors ${
    disabled 
      ? "opacity-60 bg-app-card/50 cursor-not-allowed border-app-border" 
      : "focus-within:border-app-primary border-app-border"
  }`;

  const inputStyles = "w-full outline-none text-xs text-app-text bg-transparent disabled:cursor-not-allowed cursor-pointer scheme-light dark:scheme-dark";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-app-card p-3 border border-app-border rounded-sm w-full">
      {/* Start Date Input Block */}
      <div className={wrapperStyles}>
        <label htmlFor={startName} className="font-bold text-app-text/40 font-mono uppercase text-[10px] tracking-wider pr-2 shrink-0 select-none">
          From:
        </label>
        <input
          id={startName}
          type="date"
          disabled={disabled}
          className={inputStyles}
          onClick={(e) => !disabled && e.currentTarget.showPicker?.()}
          {...register(startName, { required: required })}
        />
      </div>

      {/* End Date Input Block */}
      <div className={wrapperStyles}>
        <label htmlFor={endName} className="font-bold text-app-text/40 font-mono uppercase text-[10px] tracking-wider pr-2 shrink-0 select-none">
          To:
        </label>
        <input
          id={endName}
          type="date"
          disabled={disabled}
          className={inputStyles}
          onClick={(e) => !disabled && e.currentTarget.showPicker?.()}
          {...register(endName, { required: required })}
        />
      </div>
    </div>
  );
}
