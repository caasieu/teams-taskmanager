"use client";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-app-bg">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:absolute left-0 top-0 w-full h-full">
      <div className="flex flex-col items-center w-full py-6 px-10 sm:p-6 ">
         {children}
      </div>

      <div className="hidden md:block w-full h-full bg-app-primary" />
    </div>
  </main>
  );
}
