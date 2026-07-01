"use client";

import {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  disabled?: boolean;
  required?: string | boolean;
  validationRules?: RegisterOptions<T, Path<T>>;
}

export function FormInput<T extends FieldValues>({
  name,
  type,
  placeholder,
  register,
  disabled = false,
  required = false,
  validationRules,
}: FormInputProps<T>) {
  return (
    <div
      className={`bg-app-surface border rounded transition-colors ${
        disabled
          ? "opacity-60 bg-app-card cursor-not-allowed border-app-border"
          : "focus-within:border-app-primary border-app-border"
      }`}
    >
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-2.5 h-[2.2rem] outline-none text-xs text-app-text bg-transparent disabled:cursor-not-allowed placeholder:text-app-text/40"
        {...register(name, { required: required, ...validationRules })}
      />
    </div>
  );
}
