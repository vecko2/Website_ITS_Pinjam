"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";
import Image from "next/image";
import logoImg from "@/images/Logo ITS Pinjam.png";
import cartIcon from "@/images/shopping-cart.png";
import dashboardIcon from "@/images/dashboard.png";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image src={logoImg} alt="ITS Pinjam" height={36} className="object-contain" />
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/catalog" className="text-slate-600 hover:text-[#1A3C6E]">
            Katalog
          </Link>

          {user ? (
            <>
              {user.role === "peminjam" && (
                <Link href="/cart" className="text-slate-600 hover:text-[#1A3C6E]">
                  <Image src={cartIcon} alt="Keranjang" width={22} height={22} className="object-contain" />
                </Link>
              )}
              {user.role === "pemilik" && (
                <Link
                  href="/dashboard/owner/transactions"
                  className="text-slate-600 hover:text-[#1A3C6E]"
                >
                  Transaksi
                </Link>
              )}
              <NotificationBell />
              <Link href={user.role === "pemilik" ? "/dashboard/owner" : "/dashboard/borrower"}
                className="text-slate-600 hover:text-[#1A3C6E]">
                <Image src={dashboardIcon} alt="Dashboard" width={22} height={22} className="object-contain" />
              </Link>
              <span className="hidden text-slate-700 sm:inline">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-slate-600 hover:text-[#1A3C6E]">
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-[#1A3C6E] px-4 py-1.5 text-white hover:bg-[#15315a]"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
