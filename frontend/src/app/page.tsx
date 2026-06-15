"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Category } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import Image from "next/image";
import bicycleIcon from "@/images/bicycle.png";
import laptopIcon from "@/images/laptop.png";
import homeIcon from "@/images/home.png";
import wrenchIcon from "@/images/wrench.png";
import boxIcon from "@/images/box.png";

const categoryIcons: Record<string, { src: any; alt: string }> = {
  kendaraan:    { src: bicycleIcon, alt: "Kendaraan" },
  elektronik:   { src: laptopIcon,  alt: "Elektronik" },
  "rumah-tangga": { src: homeIcon,  alt: "Rumah Tangga" },
  "alat-teknik": { src: wrenchIcon, alt: "Alat Teknik" },
  lainnya:      { src: boxIcon,     alt: "Lainnya" },
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api
      .get("/api/categories")
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1A3C6E] to-[#2E86AB] text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Sewa Barang Antar Mahasiswa ITS
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Butuh barang sementara? Sewa dari sesama mahasiswa dengan mudah, aman, dan terpercaya.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/catalog"
              className="rounded-lg bg-[#F59E0B] px-6 py-3 font-medium text-white hover:bg-[#d98708]"
            >
              Mulai Sewa
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-white px-6 py-3 font-medium text-[#1A3C6E] hover:bg-slate-100"
            >
              Daftarkan Barang
            </Link>
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-[#1A3C6E]">Kategori Populer</h2>
        <p className="mt-2 text-center text-slate-500">Pilih kategori barang yang kamu butuhkan</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-6 transition hover:border-[#2E86AB] hover:shadow-sm"
            >
              <Image
                src={categoryIcons[cat.slug]?.src || boxIcon}
                alt={categoryIcons[cat.slug]?.alt || cat.name}
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-sm font-medium text-slate-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cara kerja */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-[#1A3C6E]">Cara Kerja</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Cari Barang", d: "Telusuri katalog dan temukan barang yang kamu butuhkan." },
              { n: "2", t: "Sewa & Bayar", d: "Pilih periode sewa, konfirmasi, dan bayar lewat QRIS." },
              { n: "3", t: "Pakai & Kembalikan", d: "Gunakan barang sesuai durasi, lalu kembalikan ke pemilik." },
            ].map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-200 p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#1A3C6E] font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">{s.t}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
