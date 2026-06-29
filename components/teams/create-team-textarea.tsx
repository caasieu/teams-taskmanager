"use client";

import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export function CreateTeamTextarea<T extends FieldValues>({
  name,
  placeholder,
  register,
}: {
  name: Path<T>;
  placeholder: string;
  register: UseFormRegister<T>;
}) {
  return (
    <div className="bg-app-surface border-app-border border-1 rounded-sm">
      <textarea
        id={name}
        rows={6}
        placeholder={placeholder}
        className="w-full p-2"
        {...register(name)}
      />
    </div>
  );
}