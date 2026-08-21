"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type AccessItem = {
  id: string;
  code: string;
  tool: string;
  name: string;
  category: string;
  description: string;
  automation: string;
  approver: string;
};

export default function AccessDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [access, setAccess] = useState<AccessItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestedFor, setRequestedFor] = useState("Self");
  const [employeeName, setEmployeeName] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccess() {
      const { data, error } = await supabase
        .from("access_items")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setAccess(data);
      }

      setLoading(false);
    }

    loadAccess();
  }, [params.id, supabase]);

  async function submitRequest() {
    setError("");

    if (requestedFor === "Other" && !employeeName.trim()) {
      setError("Please enter the employee name.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for this access request.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("access_requests").insert({
      requester_id: user.id,
      access_id: access!.id,
      requested_for: requestedFor,
      employee_name:
        requestedFor === "Other" ? employeeName.trim() : null,
      reason: reason.trim(),
      status: "Pending Approval",
      provisioning_status: null,
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-500" />
      </main>
    );
  }

  if (!access) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8">
          <p className="font-medium text-red-600">
            {error || "Access not found."}
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        {success ? (
          <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center">
            <CheckCircle2
              size={48}
              className="mx-auto text-emerald-600"
            />

            <h1 className="mt-5 text-2xl font-semibold text-slate-900">
              Request submitted
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your request for {access.tool} – {access.name} has
              been submitted for approval.
            </p>

            <div className="mt-7 flex justify-center gap-3">
              <Link
                href="/requests"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white"
              >
                View My Requests
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700"
              >
                Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-semibold text-slate-700">
                  {access.tool.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    {access.tool} – {access.name}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {access.category}
                  </p>
                </div>
              </div>

              <p className="mt-7 text-sm leading-7 text-slate-600">
                {access.description}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Request type</p>
                  <p className="mt-1 text-sm font-medium">
                    Access Request
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Provisioning</p>
                  <p className="mt-1 text-sm font-medium">
                    {access.automation}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">Approver</p>
                  <p className="mt-1 text-sm font-medium">
                    {access.approver}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7">
              <h2 className="text-lg font-semibold">
                Request Access
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Submit an access request for yourself or another employee.
              </p>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <label className="text-sm font-medium">
                  Request access for
                </label>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestedFor("Self")}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      requestedFor === "Self"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Myself
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestedFor("Other")}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                      requestedFor === "Other"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Another employee
                  </button>
                </div>
              </div>

              {requestedFor === "Other" && (
                <div className="mt-5">
                  <label className="text-sm font-medium">
                    Employee name
                  </label>

                  <input
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    placeholder="Employee name"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                  />
                </div>
              )}

              <div className="mt-5">
                <label className="text-sm font-medium">
                  Business justification
                </label>

                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Why do you need this access?"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <button
                onClick={submitRequest}
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}

                {submitting ? "Submitting..." : "Submit Access Request"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}