"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/deliveries", label: "Deliveries" },
  { href: "/dashboard/riders", label: "Agents" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar({
  companyName,
  userEmail,
}: {
  companyName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0"
        style={{
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "var(--accent)" }}
          >
            Shippa
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="5.5"
              cy="17.5"
              r="3.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle
              cx="18.5"
              cy="17.5"
              r="3.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5.5 17.5L9 10L13 12L15.5 7H19"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 12L18.5 17.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="15.5" cy="7" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* Company name */}
        <div
          className="px-5 pb-4 mb-2 border-b"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider truncate"
            style={{ color: "var(--sidebar-text)" }}
          >
            {companyName}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-item ${isActive ? "active " : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="p-4 border-t space-y-3"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          <p
            className="text-xs truncate"
            style={{ color: "var(--sidebar-text)" }}
          >
            {userEmail}
          </p>
          <button
            onClick={handleLogout}
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--sidebar-text)" }}
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          background: "var(--sidebar-bg)",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <span
          className="text-sm font-black tracking-tight"
          style={{ color: "var(--accent)" }}
        >
          Shippa
        </span>
        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  color: isActive ? "var(--accent)" : "var(--sidebar-text)",
                  background: isActive ? "rgba(240,162,2,0.1)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
