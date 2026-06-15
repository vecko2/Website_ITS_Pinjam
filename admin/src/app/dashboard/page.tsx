"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminShell from "@/components/AdminShell";
import { Stats } from "@/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/api/admin/stats").then((res) => setStats(res.data.stats)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Pengguna", value: stats?.users, color: "text-[#1A3C6E]" },
    { label: "Total Barang", value: stats?.items, color: "text-[#2E86AB]" },
    { label: "Transaksi Aktif", value: stats?.activeTransactions, color: "text-[#F59E0B]" },
    { label: "Total Transaksi", value: stats?.totalTransactions, color: "text-[#10B981]" },
  ];

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-[#1A3C6E]">Dashboard</h1>
      <p className="text-sm text-slate-500">Ringkasan statistik ITSPinjam</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className={`mt-2 text-3xl font-bold ${c.color}`}>{c.value ?? "-"}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
