"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";
import { ROUTES } from "@/config/routes";
import { Loader2 } from "lucide-react";

export function GuestGuard({ children }: { children: ReactNode }) {
  const hasInitialized = useAuthStore((state) => state.hasInitialized);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasCompletedOnboarding = useAuthStore((state) => state.hasCompletedOnboarding);
  const router = useRouter();
  const pathname = usePathname();

  const isOnboardingRoute = pathname === ROUTES.ONBOARDING || pathname === "/onboarding";

  useEffect(() => {
    if (!hasInitialized) return; // Wait for auth to initialize
    if (!isAuthenticated) return; // Not logged in — let them see guest pages

    // Authenticated user on onboarding page
    if (isOnboardingRoute) {
      if (hasCompletedOnboarding) {
        // Already completed onboarding, go to dashboard
        router.replace(ROUTES.DASHBOARD.HOME);
      }
      // else: stay on onboarding — this is where they should be
      return;
    }

    // Authenticated user on login/register/other guest pages — redirect away
    if (hasCompletedOnboarding) {
      router.replace(ROUTES.DASHBOARD.HOME);
    } else {
      router.replace(ROUTES.ONBOARDING);
    }
  }, [hasInitialized, isAuthenticated, hasCompletedOnboarding, router, isOnboardingRoute]);

  // Still loading auth — show spinner
  if (!hasInitialized) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#F8F9FF]">
        <Loader2 className="w-7 h-7 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  // Authenticated user NOT on onboarding → hide guest content while redirecting
  if (isAuthenticated && !isOnboardingRoute) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#F8F9FF]">
        <Loader2 className="w-7 h-7 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  // Authenticated user on onboarding route who already completed → hide while redirecting
  if (isAuthenticated && isOnboardingRoute && hasCompletedOnboarding) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#F8F9FF]">
        <Loader2 className="w-7 h-7 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  return <>{children}</>;
}
