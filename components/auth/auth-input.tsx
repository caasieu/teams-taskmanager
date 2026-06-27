export function AuthInput({
  id,
  type,
  placeholder,
}: {
  id: string | undefined;
  type: string;
  placeholder: string;
}) {
  return (
    <div className=" bg-app-surface border-app-border border-1 rounded-sm">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full p-2"
      />
    </div>
  );
}
