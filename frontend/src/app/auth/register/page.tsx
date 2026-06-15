"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Role } from "@/types";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("peminjam");
  const [form, setForm] = useState({
    name: "",
    email: "",
    nrp: "",
    department: "",
    angkatan: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [ktm, setKtm] = useState<File | null>(null);
  const [ktp, setKtp] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi di sisi frontend
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi tidak sama");
      return;
    }
    if (!ktm) {
      setError("Foto KTM wajib diupload");
      return;
    }
    if (role === "pemilik" && !ktp) {
      setError("Foto KTP wajib untuk pemilik barang");
      return;
    }

    setLoading(true);

    // Pakai FormData karena mengirim file
    const data = new FormData();
    data.append("role", role);
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("username", form.username);
    data.append("password", form.password);
    data.append("nrp", form.nrp);
    data.append("department", form.department);
    data.append("phone", form.phone);
    if (role === "pemilik") {
      data.append("angkatan", form.angkatan);
      data.append("address", form.address);
    }
    data.append("photo_ktm", ktm);
    if (ktp) data.append("photo_ktp", ktp);

    try {
      await api.post("/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#2E86AB]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="my-8 w-full max-w-lg rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-[#1A3C6E]">Daftar Akun</h1>
        <p className="mb-6 text-sm text-slate-500">Buat akun ITSPinjam baru</p>

        {/* Pilih role */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("peminjam")}
            className={`rounded-lg border py-2 text-sm font-medium ${
              role === "peminjam"
                ? "border-[#1A3C6E] bg-[#1A3C6E] text-white"
                : "border-slate-300 text-slate-600"
            }`}
          >
            Peminjam
          </button>
          <button
            type="button"
            onClick={() => setRole("pemilik")}
            className={`rounded-lg border py-2 text-sm font-medium ${
              role === "pemilik"
                ? "border-[#1A3C6E] bg-[#1A3C6E] text-white"
                : "border-slate-300 text-slate-600"
            }`}
          >
            Pemilik Barang
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Nama lengkap" value={form.name} onChange={handleChange} required className={inputClass} />
          <input name="email" type="email" placeholder="Email aktif" value={form.email} onChange={handleChange} required className={inputClass} />
          <input name="nrp" placeholder="NRP" value={form.nrp} onChange={handleChange} required className={inputClass} />
          <input name="department" placeholder="Asal departemen" value={form.department} onChange={handleChange} required className={inputClass} />

          {role === "pemilik" && (
            <>
              <input name="angkatan" placeholder="Angkatan" value={form.angkatan} onChange={handleChange} required className={inputClass} />
              <input name="address" placeholder="Alamat lengkap" value={form.address} onChange={handleChange} required className={inputClass} />
            </>
          )}

          <input name="phone" placeholder="Nomor HP / WhatsApp" value={form.phone} onChange={handleChange} required className={inputClass} />
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required className={inputClass} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className={inputClass} />
          <input name="confirmPassword" type="password" placeholder="Konfirmasi password" value={form.confirmPassword} onChange={handleChange} required className={inputClass} />

          {/* Upload KTM */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Foto KTM (jpg/png/pdf, maks 5MB)
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => setKtm(e.target.files?.[0] || null)}
              required
              className="w-full text-sm"
            />
          </div>

          {/* Upload KTP hanya untuk pemilik */}
          {role === "pemilik" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Foto KTP (jpg/png/pdf, maks 5MB)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setKtp(e.target.files?.[0] || null)}
                required
                className="w-full text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#1A3C6E] py-2 text-sm font-medium text-white hover:bg-[#15315a] disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-medium text-[#2E86AB]">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
