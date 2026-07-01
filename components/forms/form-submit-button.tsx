"use client";

interface FormSubmitButtonProps {
  label: string;
  disabled?: boolean;
}

export function FormSubmitButton({ label, disabled = false }: FormSubmitButtonProps) {
  return (
    <div className="w-full">
      <button
        type="submit"
        disabled={disabled}
        className="w-full bg-app-primary text-white font-semibold text-xs tracking-wide rounded h-[2.2rem] px-4 cursor-pointer hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {label}
      </button>
    </div>
  );
}
