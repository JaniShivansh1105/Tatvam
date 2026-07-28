"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";
import { ROUTES } from "@/config/routes";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);
  const router = useRouter();

  useEffect(() => {
    if (!hasInitialized) return; // Wait for auth to initialize before making decisions
    
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    } else if (!hasCompletedOnboarding) {
      router.replace(ROUTES.ONBOARDING);
    }
  }, [hasInitialized, isAuthenticated, hasCompletedOnboarding, router]);

  // Show loading while auth initializes
  if (!hasInitialized || isLoading) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#FAFAFC]">
        <Loader2 className="w-7 h-7 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  // Prevent rendering protected content before redirect completes
  if (!isAuthenticated || !hasCompletedOnboarding) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#FAFAFC]">
        <Loader2 className="w-7 h-7 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  return <>{children}</>;
}
