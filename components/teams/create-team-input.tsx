"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export function CreateTeamInput<T extends FieldValues>({
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
    <div className="bg-app-surface border-app-border border-1 rounded-sm">
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="w-full p-2"
        {...register(name)}
      />
    </div>
  );
}