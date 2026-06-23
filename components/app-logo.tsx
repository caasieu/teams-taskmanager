import Link from "next/link";

export function AppLogo() {
  return (
    <Link href={'/'}>
      <div>
        <h1 className="font-semibold text-lg"> Tasko </h1>
      </div>
    </Link>
  );
}
