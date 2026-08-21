import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              NA
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                New Age
              </p>
              <p className="text-xs text-slate-500">
                Access Management
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Manage access,
            <br />
            <span className="text-slate-500">
              simply and securely.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
            Find the applications and resources you need, request access,
            and track approvals from one central place.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Open Dashboard
            </Link>

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Learn more
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <FeatureCard
            title="Find Access"
            description="Search available applications and resources."
          />

          <FeatureCard
            title="Request Access"
            description="Submit access requests for yourself or others."
          />

          <FeatureCard
            title="Track Requests"
            description="Follow approval and provisioning progress."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}