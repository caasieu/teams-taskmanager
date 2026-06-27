import { AuthLoginForm } from "@/components/auth/auth-login-form";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex flex-col justify-between gap-20 h-full w-full sm:w-[20rem] text-xs">
      <div className="flex flex-row justify-between items-center w-full">
        <div>
          <button className="h-[2rem] w-[2rem]"></button>
        </div>

        <div className="text-xs">
          <span>
            Dont have an account yet?
            <Link href="/auth/signup">
              <span className="underline text-primary"> Signup. </span>
            </Link>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col text-xs">
          <h1 className="text-2xl font-semibold"> Welcome back :-) </h1>
          <span> {"Let's get you in the app already, shall we!"}  </span>
        </div>

        <AuthLoginForm />
      </div>

      <div></div>
    </div>
  );
}
