"use client";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <h1> authentication layout </h1>

      <div>{children}</div>
    </div>
  );
}
