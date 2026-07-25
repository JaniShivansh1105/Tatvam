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
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
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

      setToken: (token: string) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },

      setUser: (user: User) => {
        set({ user });
      },

      fetchMe: async () => {
        // Prevent duplicate network calls from React Strict Mode or late-mounting components
        if (get().hasInitialized) return;
        if (fetchMePromise) return fetchMePromise;

        set({ isLoading: true });

        fetchMePromise = (async () => {
          try {
            const { data } = await apiClient.get("/auth/me");
            const fetchedUser = data.data.user;
            
            set({
              user: fetchedUser,
              isAuthenticated: true,
              isLoading: false,
              hasInitialized: true,
            });

            // Sync language preference
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
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            hasInitialized: true, // we know they are definitively anonymous now
          });
          if (typeof window !== "undefined") {
            window.location.href = ROUTES.LOGIN;
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
);
