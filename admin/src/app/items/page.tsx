"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminShell from "@/components/AdminShell";
import { ManagedItem } from "@/types";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";

const statusText: Record<string, string> = {
  available: "Tersedia",
  rented: "Disewa",
  unavailable: "Tidak Tersedia",
};

export default function ItemsPage() {
  const [items, setItems] = useState<ManagedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    api
      .get("/api/admin/items")
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggle = async (id: number) => {
    await api.put(`/api/admin/items/${id}/toggle-active`);
    fetchItems();
  };

  const remove = async (id: number) => {
    if (!confirm("Yakin ingin menghapus barang ini?")) return;
    await api.delete(`/api/admin/items/${id}`);
    fetchItems();
  };

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-[#1A3C6E]">Barang</h1>
      <p className="text-sm text-slate-500">Kelola katalog barang seluruh pengguna</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-slate-500">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-slate-500">Belum ada barang.</p>
        ) : (
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Barang</th>
                <th className="px-4 py-3">Pemilik</th>
                <th className="px-4 py-3">Harga/hari</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Publikasi</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const cover = parseImages(it.images)[0];
                return (
                  <tr key={it.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded bg-slate-100">
                          {cover && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={getImageUrl(cover)} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{it.name}</p>
                          <p className="text-xs text-slate-400">{it.category_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{it.owner_name}</td>
                    <td className="px-4 py-3">{formatRupiah(it.price_daily)}</td>
                    <td className="px-4 py-3">{statusText[it.status] || it.status}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${it.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {it.is_active ? "Tampil" : "Disembunyikan"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => toggle(it.id)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50">
                          {it.is_active ? "Sembunyikan" : "Tampilkan"}
                        </button>
                        <button onClick={() => remove(it.id)} className="rounded-lg border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50">
                          Hapus
                        </button>
                      </div>
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
