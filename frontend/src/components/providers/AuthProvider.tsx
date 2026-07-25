"use client";

import { useEffect, ReactNode } from "react";
import { useAuthStore } from "../../store/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    // On mount, try to fetch the current user to initialize the session.
    // The Axios interceptor will automatically attempt a refresh if the initial token is missing/expired.
    fetchMe();
  }, [fetchMe]);

  // We don't block rendering of the children if we are loading because Next.js needs to hydrate,
  // and some pages (like landing/auth pages) should render even while loading the session.
  // Instead, individual protected routes/components should check `isLoading` and `isAuthenticated`.

  return <>{children}</>;
}
