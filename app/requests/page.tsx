"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type RequestRow = {
  id: string;
  requested_for: string;
  employee_name: string | null;
  reason: string;
  status: string;
  provisioning_status: string | null;
  created_at: string;
  access_items: {
    tool: string;
    name: string;
    category: string;
    automation: string;
  } | null;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      const supabase = createSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("access_requests")
        .select(`
          id,
          requested_for,
          employee_name,
          reason,
          status,
          provisioning_status,
          created_at,
          access_items (
            tool,
            name,
            category,
            automation
          )
        `)
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false });

      // ✅ FIX 1: Double cast used to resolve Supabase join type mismatch
      setRequests((data as unknown as RequestRow[]) || []);
      setLoading(false);
    }

    loadRequests();
  }, []); // ✅ FIX 2: Completely warning-free empty dependency array

  function statusIcon(status: string) {
    if (status === "Completed" || status === "Provisioned") {
      return <CheckCircle2 size={17} className="text-emerald-600" />;
    }

    if (status === "Rejected") {
      return <XCircle size={17} className="text-red-600" />;
    }

    return <Clock3 size={17} className="text-amber-600" />;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">
          My Requests
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Track your submitted access requests and provisioning progress.
        </p>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-white p-10 text-center">
            <p className="font-medium text-slate-900">
              No requests yet
            </p>

            <Link
              href="/dashboard"
              className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
            >
              Browse access
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {request.access_items?.tool} –{" "}
                      {request.access_items?.name}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Request ID: {request.id.slice(0, 8)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium">
                    {statusIcon(request.status)}
                    {request.status}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      Requested for
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {request.employee_name || request.requested_for}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Provisioning
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {request.provisioning_status || "Waiting for approval"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Submitted
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-400">
                    Justification
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {request.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}