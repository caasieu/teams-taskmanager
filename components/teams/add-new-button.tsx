import Link from "next/link";

export function AddNewButton({ linkTo }: { linkTo: string }) {
  return (
    <Link href={linkTo}>
      <div className="flex items-center justify-center p-2 w-[2rem] h-[2rem] border border-app-border rounded-full">
        <span> + </span>
      </div>
    </Link>
  );
}
