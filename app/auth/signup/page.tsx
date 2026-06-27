'use client'

import { AuthRegisterForm } from "@/components/auth/auth-register-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <div className="flex flex-col justify-between gap-20 h-full w-full sm:w-[20rem] text-xs">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="">
          <button
            onClick={handleGoBack}
            className="bg-app-surface border-app-border border-1 rounded-sm h-[2rem] w-[2rem]"
          >
            <i className="pi pi-chevron-left" style={{ fontSize: "10pt" }}></i>
            <span> {"<"} </span>
          </button>
        </div>

        <div className="">
          <span>
            Already have an account?
            <Link href="/auth/signin">
              <span className="underline text-primary"> Signin. </span>
            </Link>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold"> {"Let's create you an account."}  </h1>
          <span> Fill out the fields with your information!  </span>
        </div>

        <AuthRegisterForm />
      </div>

      <div></div>
    </div>
  );
}
