"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";
import { AdminUser } from "@/types";

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      api
        .get("/api/auth/me")
        .then((res) => {
          // Hanya terima jika role-nya admin
          if (res.data.user.role === "admin") {
            setAdmin(res.data.user);
          } else {
            localStorage.removeItem("admin_token");
          }
        })
        .catch(() => localStorage.removeItem("admin_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, adminData: AdminUser) => {
    localStorage.setItem("admin_token", token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth harus dipakai di dalam AdminAuthProvider");
  return ctx;
}
