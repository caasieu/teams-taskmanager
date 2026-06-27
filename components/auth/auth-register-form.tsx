"use client";

import { useRouter } from "next/navigation";
import { AuthInput } from "./auth-input";
import { AuthSubmitButton } from "./auth-submit-button";

export function AuthRegisterForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-2">
          <AuthInput
            type="username"
            id="username"
            placeholder="Username"
          />

          <AuthInput
            type="email"
            id="email"
            placeholder="E-mail"
          />

          <AuthInput
            type="password"
            id="password"
            placeholder="Password"
          />

          <AuthInput
            type="password"
            id="confirm_password"
            placeholder="Confirm your password"
          />
        </div>

        <div className="flex flex-row items-center justify-between gap-3">
          <div className="min-w-[10rem] w-full">
            <AuthSubmitButton label="Sign me up!" />
          </div>
        </div>
      </div>
    </form>
  );
}
