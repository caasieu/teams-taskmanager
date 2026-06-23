"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 ">
        <div className="flex flex-col">
          <ThemeToggle />
        </div>

        <div className="bg-app-card border border-app-border px-2 py-2 w-[12rem] h-[12rem]">
          Card testing
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => router.push("/auth/signin")}>Signin</button>

          <button onClick={() => router.push("/teams/1")}>Teams 1</button>

          <button onClick={() => router.push("/teams/1/tasks/2")}>
            Tasks 2
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[1,2,3,4,5,6,7,8,9].map((value, index) => <div key={value} className="border h-[12rem] w-[12rem]" />)}
          
        </div>
      </main>
    </div>
  );
}
