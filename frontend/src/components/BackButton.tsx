"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
    >
      <span aria-hidden="true">&larr;</span> Kembali
    </button>
  );
}
