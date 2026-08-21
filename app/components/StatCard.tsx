import { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{title}</span>
        <span className="text-slate-400">{icon}</span>
      </div>

      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}