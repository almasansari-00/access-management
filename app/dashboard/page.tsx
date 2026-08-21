"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  LogOut,
  Clock3,
  ShieldCheck,
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

type RequestItem = {
  id: string;
  status: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [accessItems, setAccessItems] = useState<AccessItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userName, setUserName] = useState("Almas");

  const [pendingCount, setPendingCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const supabase = createSupabaseBrowserClient();

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log("No active Supabase session. Redirecting to login.");

          if (isMounted) {
            setLoading(false);
          }

          router.replace("/login");
          return;
        }

        /* ---------------- PROFILE ---------------- */
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.full_name && isMounted) {
          setUserName(profile.full_name);
        }

        /* ---------------- ACCESS DIRECTORY ---------------- */
        const { data: accessData, error: accessError } = await supabase
          .from("access_items")
          .select("*")
          .order("created_at", { ascending: true });

        if (accessError) {
          throw accessError;
        }

        if (isMounted) {
          setAccessItems(accessData || []);
        }

        /* ---------------- REQUEST COUNTS ---------------- */
        const { data: requests, error: requestError } = await supabase
          .from("access_requests")
          .select("id, status")
          .eq("requester_id", user.id);

        if (!requestError && requests && isMounted) {
          const requestList = requests as RequestItem[];

          setPendingCount(
            requestList.filter((request) =>
              [
                "Pending Approval",
                "pending_approval",
                "Pending Manual Provisioning",
                "pending_manual_provisioning",
              ].includes(request.status)
            ).length
          );

          setActiveCount(
            requestList.filter((request) =>
              [
                "Completed",
                "completed",
                "Provisioned",
                "provisioned",
                "Active",
                "active",
              ].includes(request.status)
            ).length
          );
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Dashboard error:", err);

        if (isMounted) {
          setError(
            err.message ||
              "Something went wrong while loading the dashboard. Please refresh and try again."
          );
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  /* ---------------- LOGOUT ---------------- */
  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  /* ---------------- SEARCH ---------------- */
  const filteredItems = accessItems.filter((item) => {
    const text = `
      ${item.tool}
      ${item.name}
      ${item.category}
      ${item.description}
      ${item.code}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* BRAND */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
              NA
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                New Age
              </div>
              <div className="text-xs text-slate-500">
                Access Management
              </div>
            </div>
          </Link>

          {/* RIGHT HEADER */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-slate-900">
                {userName}
              </div>
              <div className="text-xs text-slate-500">Employee</div>
            </div>

            {/* 5. ADMIN LINK */}
            <Link
              href="/admin"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:block"
            >
              Admin
            </Link>

            <Link
              href="/requests"
              className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:block"
            >
              My Requests
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-slate-500">
            Access Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Welcome back, {userName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Find the applications and resources you need to do your work.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS SECTION */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* 4. MY REQUESTS CARD */}
          <Link
            href="/requests"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <p className="text-sm text-slate-500">My Requests</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              →
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Track submitted requests
            </p>
          </Link>

          {/* PENDING APPROVAL */}
          <Link
            href="/requests"
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Pending Approval</p>
              <Clock3
                size={18}
                className="text-slate-400 group-hover:text-slate-700"
              />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {loading ? "—" : pendingCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Requests waiting for action
            </p>
          </Link>

          {/* ACTIVE ACCESS */}
          <Link
            href="/requests"
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Active Access</p>
              <ShieldCheck
                size={18}
                className="text-slate-400 group-hover:text-slate-700"
              />
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {loading ? "—" : activeCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Completed and provisioned access
            </p>
          </Link>
        </div>

        {/* ACCESS DIRECTORY */}
        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Access Directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Available access you can request.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search access..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Loading access directory...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Search size={20} className="text-slate-400" />
              </div>
              <p className="mt-4 font-medium text-slate-900">
                No access found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                        {item.tool
                          ? item.tool
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()
                          : "NA"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.tool} – {item.name}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          {item.category}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.automation === "Automated"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.automation}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400">Approver</p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {item.approver}
                    </p>
                  </div>

                  <Link
                    href={`/access/${item.id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    View details
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}