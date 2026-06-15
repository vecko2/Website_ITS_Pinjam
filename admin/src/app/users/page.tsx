"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AdminShell from "@/components/AdminShell";
import { ManagedUser } from "@/types";
import { getImageUrl } from "@/lib/format";

export default function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/api/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const verify = async (id: number) => {
    await api.put(`/api/admin/users/${id}/verify`);
    fetchUsers();
  };

  const toggle = async (id: number) => {
    await api.put(`/api/admin/users/${id}/toggle-active`);
    fetchUsers();
  };

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-[#1A3C6E]">Pengguna</h1>
      <p className="text-sm text-slate-500">Verifikasi dokumen dan kelola akun pengguna</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-slate-500">Memuat...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-slate-500">Belum ada pengguna.</p>
        ) : (
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">NRP</th>
                <th className="px-4 py-3">Dokumen</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">{u.nrp || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {u.photo_ktm && (
                        <button onClick={() => setPreview(getImageUrl(u.photo_ktm!))} className="text-[#2E86AB] hover:underline">
                          KTM
                        </button>
                      )}
                      {u.photo_ktp && (
                        <button onClick={() => setPreview(getImageUrl(u.photo_ktp!))} className="text-[#2E86AB] hover:underline">
                          KTP
                        </button>
                      )}
                      {!u.photo_ktm && !u.photo_ktp && <span className="text-slate-400">-</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs ${u.is_verified ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {u.is_verified ? "Terverifikasi" : "Belum"}
                      </span>
                      <span className={`inline-block w-fit rounded-full px-2 py-0.5 text-xs ${u.is_active ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                        {u.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!u.is_verified && (
                        <button onClick={() => verify(u.id)} className="rounded-lg border border-green-300 px-2 py-1 text-xs text-green-700 hover:bg-green-50">
                          Verifikasi
                        </button>
                      )}
                      <button
                        onClick={() => toggle(u.id)}
                        className={`rounded-lg border px-2 py-1 text-xs ${u.is_active ? "border-red-300 text-red-600 hover:bg-red-50" : "border-blue-300 text-blue-600 hover:bg-blue-50"}`}
                      >
                        {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Preview dokumen KTM/KTP */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreview(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Dokumen"
            className="max-h-[80vh] max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AdminShell>
  );
}
