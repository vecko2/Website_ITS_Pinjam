"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Item } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";

// Label status dalam bahasa Indonesia + warna badge
const statusLabel: Record<string, { text: string; color: string }> = {
  available: { text: "Tersedia", color: "bg-green-100 text-green-700" },
  rented: { text: "Sedang Disewa", color: "bg-amber-100 text-amber-700" },
  unavailable: { text: "Tidak Tersedia", color: "bg-slate-100 text-slate-600" },
};

export default function OwnerDashboard() {
  const { user, loading } = useRequireAuth("pemilik");

  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const fetchItems = () => {
    setLoadingItems(true);
    api
      .get("/api/items/mine")
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  };

  useEffect(() => {
    if (user) fetchItems();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus barang ini?")) return;
    try {
      await api.delete(`/api/items/${id}`);
      fetchItems();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menghapus barang");
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A3C6E]">Dashboard Pemilik</h1>
            <p className="text-sm text-slate-500">Halo, {user.name}</p>
          </div>
          <Link
            href="/dashboard/owner/add"
            className="rounded-lg bg-[#1A3C6E] px-4 py-2 text-sm font-medium text-white hover:bg-[#15315a]"
          >
            + Tambah Barang
          </Link>
        </div>

        {/* Daftar barang milik sendiri */}
        <div className="mt-6">
          {loadingItems ? (
            <p className="text-slate-500">Memuat barang...</p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Belum ada barang. Klik &quot;Tambah Barang&quot; untuk mulai menyewakan.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const cover = parseImages(item.images)[0];
                const status = statusLabel[item.status] || statusLabel.available;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    {/* Foto */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImageUrl(cover)} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-sm text-slate-500">{formatRupiah(item.price_daily)} / hari</p>
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>

                    {/* Aksi */}
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/owner/edit/${item.id}`}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
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
