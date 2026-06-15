"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Item } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import ProgressBar from "@/components/ProgressBar";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api
      .get(`/api/items/${id}`)
      .then((res) => setItem(res.data.item))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <Navbar />
        <p className="flex-1 p-8 text-slate-500">Memuat...</p>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          <BackButton />
          <p className="text-slate-500">Barang tidak ditemukan.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const images = parseImages(item.images);
  const isRented = item.status === "rented";

  const waNumber = item.owner_phone?.replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo, saya tertarik menyewa "${item.name}" di ITSPinjam.`
  )}`;

  const prices = [
    { label: "Harian", value: item.price_daily },
    { label: "Mingguan", value: item.price_weekly },
    { label: "Bulanan", value: item.price_monthly },
    { label: "Tahunan", value: item.price_yearly },
  ].filter((p) => p.value);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (user.role !== "peminjam") {
      alert("Hanya peminjam yang bisa menambah ke keranjang.");
      return;
    }
    try {
      await api.post("/api/cart", { item_id: item.id });
      if (confirm("Barang ditambahkan ke keranjang. Lihat keranjang sekarang?")) {
        router.push("/cart");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menambahkan ke keranjang");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <BackButton />

        <div className="grid gap-8 md:grid-cols-2">
          {/* Galeri foto */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {images[activeImage] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImageUrl(images[activeImage])}
                  alt={item.name}
                  className={`h-full w-full object-cover ${isRented ? "grayscale" : ""}`}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  Tidak ada foto
                </div>
              )}
              {isRented && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-lg font-bold text-white">Sedang di Sewa</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${
                      i === activeImage ? "border-[#2E86AB]" : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info barang */}
          <div>
            {item.category_name && (
              <span className="text-sm text-[#2E86AB]">{item.category_name}</span>
            )}
            <h1 className="mt-1 text-2xl font-bold text-slate-800">{item.name}</h1>

            {/* Progress bar bila sedang disewa */}
            {isRented && item.active_start && item.active_end && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-medium text-slate-500">Masa sewa berjalan</p>
                <ProgressBar startDate={item.active_start} endDate={item.active_end} />
              </div>
            )}

            <div className="mt-4 space-y-1 rounded-lg border border-slate-200 bg-white p-3">
              {prices.map((p) => (
                <div key={p.label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{p.label}</span>
                  <span className="font-semibold text-[#1A3C6E]">{formatRupiah(p.value)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h2 className="text-sm font-semibold text-slate-700">Deskripsi</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-slate-600">
                {item.description || "Tidak ada deskripsi."}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-400">Pemilik Barang</p>
              <p className="font-medium text-slate-800">{item.owner_name}</p>
              {item.owner_department && (
                <p className="text-sm text-slate-500">{item.owner_department}</p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isRented}
                className="rounded-lg bg-[#1A3C6E] py-2.5 text-sm font-medium text-white hover:bg-[#15315a] disabled:opacity-50"
              >
                {isRented ? "Sedang Disewa" : "Tambah ke Keranjang"}
              </button>

              {waNumber && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#10B981] py-2.5 text-center text-sm font-medium text-[#10B981] hover:bg-green-50"
                >
                  Hubungi via WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
