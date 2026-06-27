"use client";

import { useRouter } from "next/navigation";
import { AuthInput } from "./auth-input";
import { AuthSubmitButton } from "./auth-submit-button";

export function AuthLoginForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-2">
          <AuthInput type="email" id="email" placeholder="E-mail" />

          <AuthInput type="password" id="password" placeholder="Password" />
        </div>

        <div className="flex flex-row items-center justify-between gap-3">
          <div className="min-w-[10rem] w-full">
            <AuthSubmitButton label="Let's get in!" />
          </div>
        </div>
      </div>
    </form>
  );
}
