"use client";

import { ArrowRight } from "lucide-react";

type AccessItem = {
  id: string;
  tool: string;
  name: string;
  category: string;
  description: string;
  automation: "Automated" | "Manual";
  approver: string;
};

export default function AccessCard({
  access,
  onView,
}: {
  access: AccessItem;
  onView: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold">
            {access.tool.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              {access.tool} – {access.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {access.category}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            access.automation === "Automated"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {access.automation}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">
        {access.description}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">
          Approver: {access.approver}
        </span>

        <button
          onClick={onView}
          className="flex items-center gap-1 text-sm font-medium hover:text-slate-950"
        >
          View details
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}