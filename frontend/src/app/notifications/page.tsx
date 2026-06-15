"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Notification } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import { formatDate } from "@/lib/rental";

export default function NotificationsPage() {
  const { user, loading } = useRequireAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(true);

  const fetchNotifications = () => {
    setLoadingNotif(true);
    api
      .get("/api/notifications")
      .then((res) => setNotifications(res.data.notifications))
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotif(false));
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const markAllRead = async () => {
    await api.put("/api/notifications/read-all");
    fetchNotifications();
  };

  const markRead = async (id: number) => {
    await api.put(`/api/notifications/${id}/read`);
    fetchNotifications();
  };

  if (loading || !user) return <div className="p-8 text-slate-500">Memuat...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1A3C6E]">Notifikasi</h1>
          {notifications.length > 0 && (
            <button onClick={markAllRead} className="text-sm text-[#2E86AB] hover:underline">
              Tandai semua dibaca
            </button>
          )}
        </div>

        <div className="mt-6 space-y-2">
          {loadingNotif ? (
            <p className="text-slate-500">Memuat...</p>
          ) : notifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Belum ada notifikasi.
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`block w-full rounded-xl border p-4 text-left transition ${
                  n.is_read ? "border-slate-200 bg-white" : "border-[#2E86AB] bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-800">{n.title}</h3>
                  {!n.is_read && (
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#2E86AB]" />
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(n.created_at)}</p>
              </button>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
