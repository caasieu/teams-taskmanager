export function AuthSubmitButton({ label }: { label: string }) {
  return (
    <div className="w-full ">
      <button className="w-full bg-app-primary text-white rounded-sm p-2">
        {label}
      </button>
    </div>
  );
}
