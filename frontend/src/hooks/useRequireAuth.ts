"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types";

// Pakai hook ini di halaman yang butuh login.
// allowedRole opsional: batasi halaman hanya untuk role tertentu.
export function useRequireAuth(allowedRole?: Role) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (allowedRole && user.role !== allowedRole) {
      router.replace("/");
    }
  }, [user, loading, allowedRole, router]);

  return { user, loading };
}
