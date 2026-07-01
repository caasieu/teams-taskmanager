"use client";

import { useForm } from "react-hook-form";
import { AuthInput } from "./auth-input";
import { AuthFormData } from "@/types/auth/auth-form-data";
import { AuthSubmitButton } from "./auth-submit-button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthRegisterForm() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AuthFormData>();
  
  // 1. Core interaction state parameters
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(data: AuthFormData) {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || "Failed to create account. Please verify input data fields.");
      }

      reset();
      // Redirect straight to sign-in checkpoint gate path
      router.push("/auth/signin");
    } catch (error: unknown) {
      console.error("Registration workflow failure status:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        
        {/* Dynamic Error Status Alert Banner */}
        {errorMessage && (
          <div className="p-2.5 mb-1 text-[11px] font-mono font-medium border border-red-200 text-red-600 bg-red-50/50 rounded-sm leading-relaxed">
            ⚠️ {errorMessage}
          </div>
        )}

        <AuthInput<AuthFormData>
          name="firstName"
          type="text"
          placeholder="First Name"
          register={register}
        />
        
        <AuthInput<AuthFormData>
          name="lastName"
          type="text"
          placeholder="Last Name"
          register={register}
        />

        <AuthInput<AuthFormData>
          name="username"
          type="text"
          placeholder="Username"
          register={register}
        />

        <AuthInput<AuthFormData>
          name="email"
          type="email"
          placeholder="E-mail"
          register={register}
        />

        <AuthInput<AuthFormData>
          name="password"
          type="password"
          placeholder="Password"
          register={register}
        />

        {/* Dynamic loading label text prevents submission spam during network roundtrips */}
        <AuthSubmitButton label={isSubmitting ? "Creating profile accounts..." : "Sign me up!"} />
      </div>
    </form>
  );
}
