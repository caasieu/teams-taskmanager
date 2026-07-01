import { AuthLoginForm } from "@/components/auth/auth-login-form";
import Link from "next/link";
import { NavBackButton } from "@/components/navigation/nav-back-button";

export default function SignIn() {
  return (
    <div className="flex flex-col justify-between gap-12 h-full w-full sm:w-[20rem] text-xs font-sans text-app-text bg-app-bg transition-colors">
      
      {/* SECTION 1: Top Navigation Utilities Utility Deck */}
      <div className="flex flex-row justify-between items-baseline w-full select-none pt-2">
        <div className="shrink-0">
          {/* Integrated your safe back navigation component button element natively */}
          <NavBackButton />
        </div>

        <div className="text-[11px] text-app-text/50 font-medium text-right">
          <span>
            {"Don't have an account yet? "}
            <Link href="/auth/signup" className="underline text-app-primary font-bold hover:opacity-80 transition-opacity">
              Signup.
            </Link>
          </span>
        </div>
      </div>

      {/* SECTION 2: Dynamic Welcome Header and Access Forms Layout Canvas */}
      <div className="flex flex-col gap-6 flex-1 justify-center sm:justify-start">
        <div className="flex flex-col gap-1.5 text-xs">
          <h1 className="text-xl font-bold text-app-text tracking-tight">
            Welcome back :-)
          </h1>
          <p className="text-app-text/60 font-normal leading-relaxed">
            {"Let's get you in the app already, shall we!"}
          </p>
        </div>

        {/* Core Session Entry Input Matrix Form */}
        <div className="w-full">
          <AuthLoginForm />
        </div>
      </div>

      {/* Bottom Footer Anchor Block (Maintains Layout Balance Flex Spacing) */}
      <div className="pb-4 text-[10px] text-app-text/40 font-mono text-center tracking-wide w-full">
        Scrum Sprint Manager Canvas &bull; Security Gate
      </div>

    </div>

  );
}
