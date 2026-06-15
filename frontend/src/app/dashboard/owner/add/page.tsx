"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import ItemForm from "@/components/ItemForm";

export default function AddItemPage() {
  const { user, loading } = useRequireAuth("pemilik");
  const router = useRouter();

  if (loading || !user) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  const handleSubmit = async (data: FormData) => {
    await api.post("/api/items", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Barang berhasil ditambahkan!");
    router.push("/dashboard/owner");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <BackButton />
        <h1 className="mb-6 text-2xl font-bold text-[#1A3C6E]">Tambah Barang</h1>
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ItemForm onSubmit={handleSubmit} submitLabel="Tambah Barang" />
        </div>
      </main>
    </div>
  );
}
