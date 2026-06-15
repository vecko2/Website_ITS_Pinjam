"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Image from "next/image";
import notifIcon from "@/images/notification.png";

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);

  const fetchUnread = () => {
    api
      .get("/api/notifications")
      .then((res) => setUnread(res.data.unread))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // cek tiap 30 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" title="Notifikasi" className="relative text-slate-600 hover:text-[#1A3C6E]">
      <Image src={notifIcon} alt="Notifikasi" width={22} height={22} className="object-contain" />
      {unread > 0 && (
        <span className="absolute -right-3 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unread}
        </span>
      )}
    </Link>
  );
}
