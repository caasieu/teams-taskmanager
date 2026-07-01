"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export function AuthInput<T extends FieldValues>({
  name,
  type,
  placeholder,
  register,
}: {
  name: Path<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
}) {
  return (
    <div className="bg-app-surface border border-app-border rounded-sm transition-all focus-within:border-app-primary focus-within:ring-1 focus-within:ring-app-primary/20 overflow-hidden w-full">
      {/* Visual Hidden Label ensures screen readers can process inputs correctly */}
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="w-full p-2 text-xs font-sans font-medium text-app-text placeholder-app-text/40 bg-transparent outline-none focus:outline-none focus:ring-0 border-0"
        {...register(name)}
      />
    </div>
  );
}