"use client";

import { AuthRegisterForm } from "@/components/auth/auth-register-form";
import Link from "next/link";
import { NavBackButton } from "@/components/navigation/nav-back-button";

export default function SignUp() {
  return (
    <div className="flex flex-col justify-between gap-20 h-full w-full sm:w-[20rem] text-xs">
      
      {/* 1. Navigation Header Row */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="">
          {/* Replaced the duplicate icon button with your unified back component */}
          <NavBackButton />
        </div>

        <div className="">
          <span>
            Already have an account?{" "}
            <Link href="/auth/signin">
              <span className="underline text-primary"> Signin. </span>
            </Link>
          </span>
        </div>
      </div>

      {/* 2. Registration Header & Form Canvas */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{"Let's create you an account."}</h1>
          <p className="text-gray-500 font-normal">Fill out the fields with your information!</p>
        </div>

        <AuthRegisterForm />
      </div>

      {/* 3. Empty bottom balancer node preserves your exact flex split spacing */}
      <div></div>
    </div>
  );
}
