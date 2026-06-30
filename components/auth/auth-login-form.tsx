"use client";

import { useForm } from "react-hook-form";
import { AuthInput } from "./auth-input";
import { LoginFormData } from "@/types/auth/auth-form-data";
import { AuthSubmitButton } from "./auth-submit-button";
import { useRouter } from "next/navigation";

export function AuthLoginForm() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log(res);
      reset();
      router.push("/");
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">

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

        <AuthSubmitButton label="Let's get you in!" />
      </div>
    </form>
  );
}