"use client";

import Link from "next/link";
import { Item } from "@/types";
import { formatRupiah, getImageUrl, parseImages } from "@/lib/format";

export default function ItemCard({ item }: { item: Item }) {
  const images = parseImages(item.images);
  const cover = images[0] ? getImageUrl(images[0]) : "";
  const isRented = item.status === "rented";

  return (
    <Link
      href={`/catalog/${item.id}`}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md"
    >
      {/* Gambar */}
      <div className="relative aspect-[4/3] bg-slate-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={item.name}
            className={`h-full w-full object-cover ${isRented ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Tidak ada foto
          </div>
        )}

        {/* Label jika sedang disewa */}
        {isRented && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="font-bold text-white">Sedang di Sewa</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {item.category_name && (
          <span className="text-xs text-[#2E86AB]">{item.category_name}</span>
        )}
        <h3 className="mt-0.5 line-clamp-1 font-semibold text-slate-800">{item.name}</h3>
        <p className="mt-1 text-sm font-bold text-[#1A3C6E]">
          {formatRupiah(item.price_daily)}
          <span className="text-xs font-normal text-slate-400"> / hari</span>
        </p>
      </div>
    </Link>
  );
}
