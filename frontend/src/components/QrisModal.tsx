"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/types";
import { getImageUrl, formatRupiah } from "@/lib/format";
import { remainingSeconds, formatCountdown } from "@/lib/rental";

export default function QrisModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const [seconds, setSeconds] = useState(
    transaction.payment_deadline ? remainingSeconds(transaction.payment_deadline) : 0
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(
        transaction.payment_deadline ? remainingSeconds(transaction.payment_deadline) : 0
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [transaction.payment_deadline]);

  const expired = seconds <= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-[#1A3C6E]">Pembayaran QRIS</h2>
        <p className="mt-1 text-sm text-slate-500">{transaction.item_name}</p>

        {/* Hitung mundur */}
        <div className={`mt-3 text-3xl font-bold ${expired ? "text-red-500" : "text-[#F59E0B]"}`}>
          {expired ? "Waktu Habis" : formatCountdown(seconds)}
        </div>
        {!expired && <p className="text-xs text-slate-400">Sisa waktu pembayaran</p>}

        {/* Gambar QRIS */}
        <div className="mt-4 flex justify-center">
          {transaction.qris_code ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageUrl(transaction.qris_code)}
              alt="QRIS"
              className="h-56 w-56 rounded-lg border object-contain"
            />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border text-sm text-slate-400">
              Pemilik belum mengunggah QRIS
            </div>
          )}
        </div>

        <p className="mt-4 text-lg font-bold text-[#1A3C6E]">
          {formatRupiah(transaction.total_price)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Scan QRIS untuk membayar. Setelah membayar, tunggu pemilik memverifikasi pembayaran Anda.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
