"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminShell from "@/components/AdminShell";
import { ManagedTransaction } from "@/types";
import { formatRupiah, formatDate, periodLabels } from "@/lib/format";
import { generateReceipt } from "@/lib/receipt";

const statusBadge: Record<string, { text: string; color: string }> = {
  pending: { text: "Pending", color: "bg-amber-100 text-amber-700" },
  confirmed: { text: "Pembayaran", color: "bg-orange-100 text-orange-700" },
  active: { text: "Aktif", color: "bg-blue-100 text-blue-700" },
  completed: { text: "Selesai", color: "bg-green-100 text-green-700" },
  cancelled: { text: "Batal", color: "bg-red-100 text-red-700" },
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ManagedTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/transactions")
      .then((res) => setTransactions(res.data.transactions))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-[#1A3C6E]">Transaksi</h1>
      <p className="text-sm text-slate-500">Riwayat seluruh transaksi sewa</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-slate-500">Memuat...</p>
        ) : transactions.length === 0 ? (
          <p className="p-6 text-slate-500">Belum ada transaksi.</p>
        ) : (
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">Penyewa</th>
                <th className="px-4 py-3">Pemilik</th>
                <th className="px-4 py-3">Periode</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bukti</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const badge = statusBadge[t.status] || statusBadge.pending;
                const sudahBayar = t.status === "active" || t.status === "completed";
                return (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-800">{t.item_name}</td>
                    <td className="px-4 py-3">{t.borrower_name}</td>
                    <td className="px-4 py-3">{t.owner_name}</td>
                    <td className="px-4 py-3">
                      <p>{periodLabels[t.rental_period]}</p>
                      <p className="text-xs text-slate-400">
                        {formatDate(t.start_date)} - {formatDate(t.end_date)}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#1A3C6E]">
                      {formatRupiah(t.total_price)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sudahBayar ? (
                        <button
                          onClick={() => generateReceipt(t)}
                          className="rounded-lg border border-[#1A3C6E] px-2 py-1 text-xs text-[#1A3C6E] hover:bg-[#1A3C6E] hover:text-white"
                        >
                          Bukti PDF
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}