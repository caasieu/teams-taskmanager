"use client";

import { useForm } from "react-hook-form";
import { AuthInput } from "./auth-input";
import { LoginFormData } from "@/types/auth/auth-form-data";
import { AuthSubmitButton } from "./auth-submit-button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/users/use-auth";

export function AuthLoginForm() {
  const router = useRouter();
  const { fetchUser } = useAuth(); // Connect cache synchronizer directly
  const { register, handleSubmit, reset } = useForm<LoginFormData>();

  // 1. Core interaction state parameters
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: LoginFormData) {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          result.error ||
            "Invalid credential pairing matching profile records.",
        );
      }

      reset();

      // 2. CRUCIAL CACHE PRE-FETCH: Sync the new user into hook memory before redirecting
      // This stops any dashboard hydration flashing loops or target missing bugs!
      await fetchUser();

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      console.error("Authentication execution failure status:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected server error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-2">
        {/* Dynamic Error Status Alert Banner */}
        {errorMessage && (
          <div className="p-2.5 mb-1 text-[11px] font-mono font-medium border border-danger/20 text-danger bg-danger/5 rounded-sm leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        <AuthInput<LoginFormData>
          name="email"
          type="email"
          placeholder="E-mail"
          register={register}
        />

        <AuthInput<LoginFormData>
          name="password"
          type="password"
          placeholder="Password"
          register={register}
        />

        {/* Dynamic state labels prevent double click triggers across network roundtrips */}
        <AuthSubmitButton
          label={
            isSubmitting ? "Authenticating session..." : "Let's get you in!"
          }
        />
      </div>
    </form>
  );
}