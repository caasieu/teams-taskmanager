"use client";

import { useForm } from "react-hook-form";
import { AuthInput } from "./auth-input";
import { AuthFormData } from "@/types/auth/auth-form-data";
import { AuthSubmitButton } from "./auth-submit-button";
import { useRouter } from "next/navigation";

export function AuthRegisterForm() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<AuthFormData>();

  async function onSubmit(data: AuthFormData) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log("User created");
      reset();
      router.push("/auth/signin");
    } else {
      console.log("Error creating user");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
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

        <AuthSubmitButton label="Sign me up!" />
      </div>
    </form>
  );
}
