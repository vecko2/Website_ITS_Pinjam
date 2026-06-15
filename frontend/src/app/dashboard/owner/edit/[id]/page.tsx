"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import { Item } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import ItemForm from "@/components/ItemForm";

export default function EditItemPage() {
  const { user, loading } = useRequireAuth("pemilik");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<Item | null>(null);
  const [loadingItem, setLoadingItem] = useState(true);

  useEffect(() => {
    api
      .get(`/api/items/${id}`)
      .then((res) => setItem(res.data.item))
      .catch(() => setItem(null))
      .finally(() => setLoadingItem(false));
  }, [id]);

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

  const handleSubmit = async (data: FormData) => {
    await api.put(`/api/items/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Barang berhasil diperbarui!");
    router.push("/dashboard/owner");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <BackButton />
        <h1 className="mb-6 text-2xl font-bold text-[#1A3C6E]">Edit Barang</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ItemForm initialData={item} onSubmit={handleSubmit} submitLabel="Simpan Perubahan" />
        </div>
      </main>
    </div>
  );
}
