"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Category, Item } from "@/types";
import { getImageUrl, parseImages } from "@/lib/format";

interface ItemFormProps {
  initialData?: Item; // diisi saat mode edit
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export default function ItemForm({ initialData, onSubmit, submitLabel }: ItemFormProps) {
  const isEdit = !!initialData;
  const existingImages = parseImages(initialData?.images);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: initialData?.title || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id?.toString() || "",
    price_daily: initialData?.price_daily?.toString() || "",
    price_weekly: initialData?.price_weekly?.toString() || "",
    price_monthly: initialData?.price_monthly?.toString() || "",
    price_yearly: initialData?.price_yearly?.toString() || "",
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [qris, setQris] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/categories").then((res) => setCategories(res.data.categories)).catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Saat tambah barang, foto wajib. Saat edit boleh kosong (pakai foto lama).
    if (!isEdit && (!images || images.length === 0)) {
      setError("Minimal upload 1 foto barang");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("category_id", form.category_id);
    data.append("price_daily", form.price_daily);
    data.append("price_weekly", form.price_weekly);
    data.append("price_monthly", form.price_monthly);
    data.append("price_yearly", form.price_yearly);

    if (images) {
      Array.from(images).forEach((file) => data.append("images", file));
    }
    if (qris) {
      data.append("qris_code", qris);
    }

    setLoading(true);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2E86AB]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Judul Katalog</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Contoh: Sewa Sepeda Gunung Polygon"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nama Barang</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Contoh: Sepeda Gunung Polygon"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Kategori</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Pilih kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={inputClass}
          placeholder="Jelaskan kondisi dan kelengkapan barang"
        />
      </div>

      {/* Harga per periode */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Harga Sewa (kosongkan jika tidak ditawarkan)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input name="price_daily" type="number" value={form.price_daily} onChange={handleChange} className={inputClass} placeholder="Per hari" />
          <input name="price_weekly" type="number" value={form.price_weekly} onChange={handleChange} className={inputClass} placeholder="Per minggu" />
          <input name="price_monthly" type="number" value={form.price_monthly} onChange={handleChange} className={inputClass} placeholder="Per bulan" />
          <input name="price_yearly" type="number" value={form.price_yearly} onChange={handleChange} className={inputClass} placeholder="Per tahun" />
        </div>
      </div>

      {/* Foto barang (multiple) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Foto Barang (bisa pilih beberapa, maks 5)
        </label>
        {isEdit && existingImages.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {existingImages.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={getImageUrl(img)} alt="" className="h-14 w-14 rounded-lg object-cover" />
            ))}
          </div>
        )}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          onChange={(e) => setImages(e.target.files)}
          className="w-full text-sm"
        />
        {isEdit && (
          <p className="mt-1 text-xs text-slate-400">Kosongkan jika tidak ingin mengganti foto.</p>
        )}
      </div>

      {/* QRIS */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          QR Code QRIS (untuk pembayaran)
        </label>
        {isEdit && initialData?.qris_code && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getImageUrl(initialData.qris_code)}
            alt="QRIS"
            className="mb-2 h-20 w-20 rounded-lg object-cover"
          />
        )}
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setQris(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#1A3C6E] py-2.5 text-sm font-medium text-white hover:bg-[#15315a] disabled:opacity-60"
      >
        {loading ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}
