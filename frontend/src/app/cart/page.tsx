"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { CartItem } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";

export default function CartPage() {
  const { user, loading } = useRequireAuth("peminjam");
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const fetchCart = () => {
    setLoadingItems(true);
    api
      .get("/api/cart")
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleRemove = async (cartId: number) => {
    try {
      await api.delete(`/api/cart/${cartId}`);
      fetchCart();
    } catch {
      alert("Gagal menghapus barang");
    }
  };

  if (loading || !user) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1A3C6E]">Keranjang Saya</h1>

        <div className="mt-6">
          {loadingItems ? (
            <p className="text-slate-500">Memuat keranjang...</p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Keranjang kosong.{" "}
              <Link href="/catalog" className="font-medium text-[#2E86AB]">
                Cari barang
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const cover = parseImages(item.images)[0];
                return (
                  <div
                    key={item.cart_id}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={getImageUrl(cover)} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{item.name}</h3>
                      <p className="text-sm text-slate-500">{formatRupiah(item.price_daily)} / hari</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/checkout?item=${item.id}`)}
                        className="rounded-lg bg-[#1A3C6E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#15315a]"
                      >
                        Checkout
                      </button>
                      <button
                        onClick={() => handleRemove(item.cart_id)}
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
