"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/backend-api";

const protectedRoutes = [
  "/requester",
  "/donor",
  "/hospital",
  "/courier",
];

export default function DashboardAuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const requiresAuth = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  useEffect(() => {
    if (!requiresAuth) {
      setChecked(true);
      return;
    }
    const token = window.localStorage.getItem("hemoglobin_access_token");
    if (!token) {
      router.replace("/login?next=" + encodeURIComponent(pathname));
      return;
    }
    authApi.me().then(() => setChecked(true)).catch(() => {
      window.localStorage.removeItem("hemoglobin_access_token");
      window.localStorage.removeItem("hemoglobin_refresh_token");
      router.replace("/login?next=" + encodeURIComponent(pathname));
    });
  }, [pathname, requiresAuth, router]);

  if (requiresAuth && !checked) {
    return <main className="min-h-screen flex items-center justify-center bg-slate-50 text-sm text-slate-500">Checking secure access...</main>;
  }
  return <>{children}</>;
}
