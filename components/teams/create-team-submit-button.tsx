"use client";

import { useFormStatus } from "react-dom";

export function CreateTeamSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <div className="w-full">
      <button type="submit" disabled={pending} className="w-full bg-app-primary text-white rounded-sm p-2">
        {pending ? 'submitting...' : label}
      </button>
    </div>
  );
}
