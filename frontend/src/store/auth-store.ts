import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "../lib/api-client";
import { ROUTES } from "@/config/routes";

interface User {
  id: string;
  email: string;
  fullName: string;
  username: string | null;
  avatarUrl: string | null;
  accountType?: string;
  profileCompletion?: number;
  onboardingCompleted?: boolean;
  onboardingStep?: string;
  profile?: any;
  preference?: any;
  learningDNA?: any;
  userSubjects?: any[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  hasCompletedOnboarding: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

let fetchMePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      hasInitialized: false,
      hasCompletedOnboarding: false,

      setToken: (token: string) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },

      setUser: (user: User) => {
        const isCompleted = user.onboardingCompleted ?? !!(user?.profile?.country || user?.learningDNA);
        set({ user, hasCompletedOnboarding: isCompleted });
      },

      setHasCompletedOnboarding: (completed: boolean) => {
        set({ hasCompletedOnboarding: completed });
      },

      fetchMe: async () => {
        if (get().hasInitialized) return;
        if (fetchMePromise) return fetchMePromise;

        set({ isLoading: true });

        fetchMePromise = (async () => {
          try {
            const { data } = await apiClient.get("/auth/me");
            const fetchedUser = data.data.user;
            
            // Use backend onboardingCompleted flag, fallback to country if undefined
            const isCompleted = fetchedUser?.onboardingCompleted ?? !!(fetchedUser?.profile?.country || fetchedUser?.learningDNA);

            set({
              user: fetchedUser,
              isAuthenticated: true,
              isLoading: false,
              hasInitialized: true,
              hasCompletedOnboarding: isCompleted,
            });

            if (fetchedUser?.preference?.language?.name) {
              const { useEngineStore } = await import("./engine-store");
              useEngineStore.getState().setLanguage(fetchedUser.preference.language.name);
            }
          } catch {
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isLoading: false,
              hasInitialized: true,
            });
          } finally {
            fetchMePromise = null;
          }
        })();

        return fetchMePromise;
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/logout");
        } catch {
          // Ignore
        } finally {
          // Clear React Query cache to prevent cross-user data leakage
          try {
            const { queryClient } = await import("@/components/providers/QueryProvider");
            queryClient.clear();
          } catch {
            // QueryProvider may not be loaded yet
          }

          // Clear onboarding localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("tatvam_onboarding_data");
          }

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            hasInitialized: true,
            hasCompletedOnboarding: false,
          });
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
        }
      },

    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
