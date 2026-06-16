"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";

// Halaman root: arahkan ke dashboard kalau sudah login, kalau belum ke login
export default function Home() {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(admin ? "/dashboard" : "/login");
  }, [admin, loading, router]);

  return <div className="p-8 text-slate-500">Memuat...</div>;
}