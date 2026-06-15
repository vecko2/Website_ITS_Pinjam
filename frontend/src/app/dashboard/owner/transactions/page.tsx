"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Transaction } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import ProgressBar from "@/components/ProgressBar";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";
import { formatDate, periodLabels } from "@/lib/rental";

const statusBadge: Record<string, { text: string; color: string }> = {
  pending: { text: "Menunggu Konfirmasi Peminjam", color: "bg-amber-100 text-amber-700" },
  confirmed: { text: "Menunggu Verifikasi Pembayaran", color: "bg-orange-100 text-orange-700" },
  active: { text: "Sedang Disewa", color: "bg-blue-100 text-blue-700" },
  completed: { text: "Selesai", color: "bg-green-100 text-green-700" },
  cancelled: { text: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

export default function OwnerTransactionsPage() {
  const { user, loading } = useRequireAuth("pemilik");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTrx, setLoadingTrx] = useState(true);

  const fetchTransactions = () => {
    setLoadingTrx(true);
    api
      .get("/api/transactions/owner")
      .then((res) => setTransactions(res.data.transactions))
      .catch(() => setTransactions([]))
      .finally(() => setLoadingTrx(false));
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  const handleVerifyPayment = async (id: number) => {
    if (!confirm("Konfirmasi bahwa pembayaran sudah Anda terima?")) return;
    try {
      await api.put(`/api/transactions/${id}/confirm-payment`);
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal verifikasi pembayaran");
    }
  };

  const handleVerifyReturn = async (id: number) => {
    if (!confirm("Verifikasi bahwa barang sudah dikembalikan?")) return;
    try {
      await api.put(`/api/transactions/${id}/confirm-return`);
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal verifikasi");
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <BackButton />
        <h1 className="text-2xl font-bold text-[#1A3C6E]">Transaksi Masuk</h1>
        <p className="text-sm text-slate-500">Penyewaan barang milik Anda</p>

        <div className="mt-6">
          {loadingTrx ? (
            <p className="text-slate-500">Memuat transaksi...</p>
          ) : transactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Belum ada penyewaan.
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
                        <p className="mt-1 text-sm text-slate-500">Penyewa: {trx.borrower_name}</p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {periodLabels[trx.rental_period]} &middot; {formatDate(trx.start_date)} - {formatDate(trx.end_date)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#1A3C6E]">{formatRupiah(trx.total_price)}</p>
                      </div>
                    </div>

                    {/* Progress bar saat aktif */}
                    {trx.status === "active" && (
                      <ProgressBar startDate={trx.start_date} endDate={trx.end_date} />
                    )}

                    {/* Tombol verifikasi pembayaran (saat menunggu pembayaran) */}
                    {trx.status === "confirmed" && (
                      <button
                        onClick={() => handleVerifyPayment(trx.id)}
                        className="mt-3 w-full rounded-lg bg-[#10B981] py-2 text-sm font-medium text-white hover:bg-[#0e9f70]"
                      >
                        Verifikasi Pembayaran Berhasil
                      </button>
                    )}

                    {/* Tombol verifikasi pengembalian (saat aktif) */}
                    {trx.status === "active" && (
                      <button
                        onClick={() => handleVerifyReturn(trx.id)}
                        className="mt-3 w-full rounded-lg bg-[#1A3C6E] py-2 text-sm font-medium text-white hover:bg-[#15315a]"
                      >
                        Verifikasi Barang Telah Dikembalikan
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
