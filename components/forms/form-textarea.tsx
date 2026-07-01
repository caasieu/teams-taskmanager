"use client";

import {
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  placeholder: string;
  register: UseFormRegister<T>;
  disabled?: boolean;
  required?: string | boolean;
  validationRules?: RegisterOptions<T, Path<T>>;
}

export function FormTextarea<T extends FieldValues>({
  name,
  placeholder,
  register,
  disabled = false,
  required = false,
  validationRules,
}: FormTextareaProps<T>) {
  return (
    <div
      className={`bg-app-surface border rounded transition-colors ${
        disabled
          ? "opacity-60 bg-app-card cursor-not-allowed border-app-border"
          : "focus-within:border-app-primary border-app-border"
      }`}
    >
      <textarea
        id={name}
        rows={4}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full p-2.5 outline-none resize-y text-xs text-app-text bg-transparent disabled:cursor-not-allowed placeholder:text-app-text/40 leading-relaxed"
        {...register(name, { required: required, ...validationRules })}
      />
    </div>
  );
}
