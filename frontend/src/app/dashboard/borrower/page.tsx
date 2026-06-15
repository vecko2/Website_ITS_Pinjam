"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Transaction } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import QrisModal from "@/components/QrisModal";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";
import { formatDate, periodLabels } from "@/lib/rental";

const statusBadge: Record<string, { text: string; color: string }> = {
  pending: { text: "Menunggu Konfirmasi", color: "bg-amber-100 text-amber-700" },
  confirmed: { text: "Menunggu Pembayaran", color: "bg-orange-100 text-orange-700" },
  active: { text: "Sedang Disewa", color: "bg-blue-100 text-blue-700" },
  completed: { text: "Selesai", color: "bg-green-100 text-green-700" },
  cancelled: { text: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

export default function BorrowerDashboard() {
  const { user, loading } = useRequireAuth("peminjam");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTrx, setLoadingTrx] = useState(true);
  const [qrisTrx, setQrisTrx] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoadingTrx(true);
    try {
      const res = await api.get("/api/transactions/borrower");
      setTransactions(res.data.transactions);
      return res.data.transactions as Transaction[];
    } catch {
      setTransactions([]);
      return [];
    } finally {
      setLoadingTrx(false);
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  // Konfirmasi terima -> lalu buka modal QRIS untuk transaksi tsb
  const handleConfirm = async (id: number) => {
    if (!confirm("Konfirmasi bahwa barang sudah Anda terima?")) return;
    try {
      await api.put(`/api/transactions/${id}/confirm-borrow`);
      const updated = await fetchTransactions();
      const trx = updated.find((t) => t.id === id);
      if (trx) setQrisTrx(trx); // tampilkan QRIS + countdown
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal konfirmasi");
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1A3C6E]">Dashboard Peminjam</h1>
        <p className="text-sm text-slate-500">Halo, {user.name}</p>

        <h2 className="mt-6 text-lg font-semibold text-slate-800">Transaksi Saya</h2>

        <div className="mt-3">
          {loadingTrx ? (
            <p className="text-slate-500">Memuat transaksi...</p>
          ) : transactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Belum ada transaksi.{" "}
              <Link href="/catalog" className="font-medium text-[#2E86AB]">
                Mulai sewa
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((trx) => {
                const cover = parseImages(trx.item_images)[0];
                const badge = statusBadge[trx.status] || statusBadge.pending;
                return (
                  <div key={trx.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {cover && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={getImageUrl(cover)} alt={trx.item_name} className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-slate-800">{trx.item_name}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                            {badge.text}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {periodLabels[trx.rental_period]} &middot; {formatDate(trx.start_date)} - {formatDate(trx.end_date)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#1A3C6E]">{formatRupiah(trx.total_price)}</p>
                      </div>
                    </div>

                    {/* Progress bar saat masa sewa aktif */}
                    {trx.status === "active" && (
                      <ProgressBar startDate={trx.start_date} endDate={trx.end_date} />
                    )}

                    {/* Tombol konfirmasi diterima (saat pending) */}
                    {trx.status === "pending" && (
                      <button
                        onClick={() => handleConfirm(trx.id)}
                        className="mt-3 w-full rounded-lg bg-[#10B981] py-2 text-sm font-medium text-white hover:bg-[#0e9f70]"
                      >
                        Konfirmasi Barang Diterima
                      </button>
                    )}

                    {/* Tombol tampilkan QRIS (saat menunggu pembayaran) */}
                    {trx.status === "confirmed" && (
                      <button
                        onClick={() => setQrisTrx(trx)}
                        className="mt-3 w-full rounded-lg bg-[#F59E0B] py-2 text-sm font-medium text-white hover:bg-[#d98708]"
                      >
                        Tampilkan QRIS &amp; Bayar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal QRIS */}
      {qrisTrx && <QrisModal transaction={qrisTrx} onClose={() => setQrisTrx(null)} />}
    </div>
  );
}
