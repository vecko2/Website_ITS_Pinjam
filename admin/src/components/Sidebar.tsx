"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/users", label: "Pengguna" },
  { href: "/items", label: "Barang" },
  { href: "/transactions", label: "Transaksi" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  return (
    <aside className="flex w-56 flex-col border-r border-slate-200 bg-white p-4">
      <div className="mb-6">
        <p className="text-lg font-bold text-[#1A3C6E]">ITSPinjam</p>
        <p className="text-xs text-slate-400">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block rounded-lg px-3 py-2 text-sm ${
              pathname === l.href
                ? "bg-[#1A3C6E] text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-200 pt-3">
        <p className="px-3 text-xs text-slate-500">{admin?.name}</p>
        <button
          onClick={logout}
          className="mt-2 w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
