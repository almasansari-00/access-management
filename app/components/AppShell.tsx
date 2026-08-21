"use client";

import { ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  Settings,
} from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  role?: "employee" | "admin";
}

export default function AppShell({
  children,
  role = "employee",
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              NA
            </div>

            <div>
              <h1 className="text-sm font-semibold">New Age</h1>
              <p className="text-xs text-slate-500">
                Access Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 hover:text-slate-900">
              <Bell size={19} />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <button className="text-slate-500 hover:text-slate-900">
              <Settings size={19} />
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <button className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold">
                AA
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">Almas Ansari</p>
                <p className="text-xs text-slate-500">
                  {role === "admin" ? "Board Admin" : "Employee"}
                </p>
              </div>

              <ChevronDown size={15} className="text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}