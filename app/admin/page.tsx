"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type AccessItem = {
  id: string;
  tool: string;
  name: string;
  category: string;
  automation: string;
};

type RequestItem = {
  id: string;
  requester_id: string;
  access_id: string;
  requested_for: string;
  employee_name: string;
  reason: string;
  status: string;
  provisioning_status: string | null;
  created_at: string;
  updated_at: string;
  access_items: AccessItem | null;
};

export default function AdminPage() {
  const supabase = createSupabaseBrowserClient();

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setError("");

    const { data, error: requestError } = await supabase
      .from("access_requests")
      .select(`
        id,
        requester_id,
        access_id,
        requested_for,
        employee_name,
        reason,
        status,
        provisioning_status,
        created_at,
        updated_at,
        access_items:access_id (
          id,
          tool,
          name,
          category,
          automation
        )
      `)
      .order("created_at", { ascending: false });

    if (requestError) {
      console.error("Admin requests error:", requestError);
      setError(requestError.message);
      setRequests([]);
    } else {
      setRequests((data || []) as unknown as RequestItem[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateRequest(
    id: string,
    status: string,
    provisioningStatus: string | null
  ) {
    setWorking(id);
    setMessage("");
    setError("");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("Your session has expired. Please login again.");
      setWorking(null);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setError(`Profile error: ${profileError.message}`);
      setWorking(null);
      return;
    }

    if (profile?.role !== "admin") {
      setError("You do not have Admin permission.");
      setWorking(null);
      return;
    }

    const { error: updateError } = await supabase
      .from("access_requests")
      .update({
        status,
        provisioning_status: provisioningStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      setError(`Update failed: ${updateError.message}`);
      setWorking(null);
      return;
    }

    if (status === "Rejected") {
      setMessage("Request rejected successfully.");
    } else if (
      status === "Completed" &&
      provisioningStatus === "Completed"
    ) {
      setMessage("Request completed successfully.");
    } else {
      setMessage("Request approved successfully.");
    }

    await loadRequests();
    setWorking(null);
  }

  async function handleApprove(request: RequestItem) {
    const isManual =
      request.access_items?.automation?.toLowerCase() === "manual";

    if (isManual) {
      await updateRequest(
        request.id,
        "Approved",
        "Pending Manual Provisioning"
      );
    } else {
      await updateRequest(
        request.id,
        "Completed",
        "Completed"
      );
    }
  }

  async function handleReject(request: RequestItem) {
    await updateRequest(
      request.id,
      "Rejected",
      null
    );
  }

  async function handleCompleteManual(request: RequestItem) {
    await updateRequest(
      request.id,
      "Completed",
      "Completed"
    );
  }

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "Pending Approval" ||
      request.provisioning_status === "Pending Manual Provisioning"
  );

  const completedRequests = requests.filter(
    (request) => request.status === "Completed"
  );

  const rejectedRequests = requests.filter(
    (request) => request.status === "Rejected"
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              NA
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">
                New Age
              </div>

              <div className="text-xs text-slate-500">
                Admin Console
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Access Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Admin Console
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Review, approve, reject, and provision access requests.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Requests
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {requests.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {pendingRequests.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {completedRequests.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Rejected
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {rejectedRequests.length}
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Access Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage submitted access requests.
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-slate-900">
                No requests found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                New access requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {requests.map((request) => {
                const isManual =
                  request.access_items?.automation?.toLowerCase() ===
                  "manual";

                const isPending =
                  request.status === "Pending Approval";

                const manualPending =
                  request.provisioning_status ===
                  "Pending Manual Provisioning";

                return (
                  <div
                    key={request.id}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {request.access_items?.tool ||
                              "Access"}{" "}
                            –{" "}
                            {request.access_items?.name ||
                              "Resource"}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            Access Request
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Requested for:{" "}
                          <span className="font-medium text-slate-700">
                            {request.employee_name ||
                              request.requested_for ||
                              "Employee"}
                          </span>
                        </p>

                        {request.reason && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Reason: {request.reason}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-400">
                          Submitted{" "}
                          {new Date(
                            request.created_at
                          ).toLocaleString()}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              request.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : request.status === "Rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {request.status}
                          </span>

                          {request.provisioning_status && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              {request.provisioning_status}
                            </span>
                          )}

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {isManual
                              ? "Manual"
                              : "Automated"}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        {isPending && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(request)
                              }
                              disabled={
                                working === request.id
                              }
                              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                              {working === request.id ? (
                                <Loader2
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={15} />
                              )}

                              Approve
                            </button>

                            <button
                              onClick={() =>
                                handleReject(request)
                              }
                              disabled={
                                working === request.id
                              }
                              className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <X size={15} />
                              Reject
                            </button>
                          </>
                        )}

                        {manualPending && (
                          <button
                            onClick={() =>
                              handleCompleteManual(request)
                            }
                            disabled={
                              working === request.id
                            }
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                          >
                            {working === request.id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Check size={15} />
                            )}

                            Complete Provisioning
                          </button>
                        )}

                        {request.status === "Completed" && (
                          <span className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                            Completed
                          </span>
                        )}

                        {request.status === "Rejected" && (
                          <span className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}