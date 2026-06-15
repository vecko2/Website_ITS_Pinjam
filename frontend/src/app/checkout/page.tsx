"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Item } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { formatRupiah } from "@/lib/format";
import { periodLabels, periodUnit, calcEndDate, formatDate } from "@/lib/rental";

function CheckoutContent() {
  const { user, loading } = useRequireAuth("peminjam");
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");

  const [item, setItem] = useState<Item | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);

  const [period, setPeriod] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!itemId) {
      setLoadingItem(false);
      return;
    }
    api
      .get(`/api/items/${itemId}`)
      .then((res) => setItem(res.data.item))
      .catch(() => setItem(null))
      .finally(() => setLoadingItem(false));
  }, [itemId]);

  if (loading || loadingItem) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <BackButton />
          <p className="text-slate-500">Barang tidak ditemukan.</p>
        </main>
      </div>
    );
  }

  // Periode yang tersedia (punya harga)
  const availablePeriods = [
    { key: "daily", price: item.price_daily },
    { key: "weekly", price: item.price_weekly },
    { key: "monthly", price: item.price_monthly },
    { key: "yearly", price: item.price_yearly },
  ].filter((p) => p.price);

  const selectedPrice = period
    ? availablePeriods.find((p) => p.key === period)?.price || 0
    : 0;
  const total = selectedPrice * quantity;
  const endDate = startDate && period ? calcEndDate(startDate, period, quantity) : "";
  const today = new Date().toISOString().split("T")[0];

  const handleCheckout = async () => {
    if (!period || !startDate || quantity < 1) {
      alert("Lengkapi periode, jumlah, dan tanggal mulai.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/transactions", {
        item_id: item.id,
        rental_period: period,
        start_date: startDate,
        quantity,
      });
      alert("Pesanan berhasil dibuat!");
      router.push("/dashboard/borrower");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <BackButton />
        <h1 className="mb-6 text-2xl font-bold text-[#1A3C6E]">Checkout</h1>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          {/* Barang */}
          <div className="border-b border-slate-100 pb-4">
            <p className="text-sm text-slate-400">Barang</p>
            <p className="font-semibold text-slate-800">{item.name}</p>
          </div>

          {/* Pilih periode */}
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Periode Sewa</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2E86AB]"
            >
              <option value="">Pilih periode</option>
              {availablePeriods.map((p) => (
                <option key={p.key} value={p.key}>
                  {periodLabels[p.key]} - {formatRupiah(p.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah */}
          {period && (
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Jumlah ({periodUnit[period]})
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2E86AB]"
              />
            </div>
          )}

          {/* Tanggal mulai */}
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">Tanggal Mulai</label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2E86AB]"
            />
          </div>

          {/* Ringkasan biaya */}
          {period && startDate && (
            <div className="mt-6 space-y-1 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal selesai</span>
                <span className="font-medium text-slate-700">{formatDate(endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {formatRupiah(selectedPrice)} x {quantity} {periodUnit[period]}
                </span>
                <span className="font-medium text-slate-700">{formatRupiah(total)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base">
                <span className="font-semibold text-slate-800">Total</span>
                <span className="font-bold text-[#1A3C6E]">{formatRupiah(total)}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-[#1A3C6E] py-2.5 text-sm font-medium text-white hover:bg-[#15315a] disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Buat Pesanan"}
          </button>
        </div>
      </main>
    </div>
  );
}

// useSearchParams wajib dibungkus Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500">Memuat...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
