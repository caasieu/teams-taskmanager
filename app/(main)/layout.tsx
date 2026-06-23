"use client";

import { NavBarContainer } from "./components/navigation/nav-bar-container";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-app-bg">
      <NavBarContainer />
      <main className="w-full min-h-screen md:ml-[18rem] ">{children}</main>
    </div>
  );
}
