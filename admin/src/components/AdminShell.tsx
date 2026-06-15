"use client";

import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import Sidebar from "@/components/Sidebar";

// Pembungkus halaman admin: cek login + tampilkan sidebar
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useRequireAdmin();

  if (loading || !admin) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
