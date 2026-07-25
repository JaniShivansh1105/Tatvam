"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";
import { ROUTES } from "@/config/routes";

export function AuthGuard({ children }: { children: ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  // Prevent flashing protected content before redirect
  if (isLoading || !isAuthenticated) {
    return null; // Can be replaced with a full-page loading spinner
  }

  return <>{children}</>;
}
