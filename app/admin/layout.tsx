import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Employee Dashboard
          </Link>

          <Link
            href="/requests"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            My Requests
          </Link>
        </div>
      </nav>

      {children}
    </>
  );
}