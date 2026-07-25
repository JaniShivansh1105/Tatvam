"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";
import { ROUTES } from "@/config/routes";

export function GuestGuard({ children }: { children: ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD.HOME); // Redirect authenticated users to the dashboard/home
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || isAuthenticated) {
    return null; // Prevents auth forms from flashing if the user is already logged in
  }

  return <>{children}</>;
}
