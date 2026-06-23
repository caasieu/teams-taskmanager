export function AccountCard() {
  return (
    <div className="flex items-center justify-between min-h-[4rem] w-full px-3 py-1.5 text-xs">
      <div className="flex items-center gap-2">
        <div className="border border-app-border w-[2rem] h-[2rem] rounded-md"></div>

        <div className="flex flex-col gap-1 items-start">
          <div> <span className="font-semibold"> User Name </span> </div>
          <div> <span> @username </span> </div>
        </div>
      </div>

      <div className="border border-app-border ">
        <span> [edit] </span>
      </div>
    </div>
  );
}
