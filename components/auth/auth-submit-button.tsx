"use client";

import { useFormStatus } from "react-dom";

export function AuthSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <div className="w-full">
      <button 
        type="submit" 
        disabled={pending} 
        className="w-full bg-app-primary text-white font-semibold text-xs rounded-sm p-2 flex items-center justify-center gap-2 select-none transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
      >
        {/* Safe text mapping state toggle containing a clean CSS loader tracking stream animation wrapper */}
        {pending ? (
          <>
            <svg 
              className="animate-spin h-3.5 w-3.5 text-white shrink-0" 
              xmlns="http://w3.org" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <span>{label}</span>
        )}
      </button>
    </div>
  );
}
