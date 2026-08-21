export default function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}