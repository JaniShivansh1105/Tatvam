import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "initial-1",
          title: "Welcome to Tatvam!",
          message: "Your learning journey begins here.",
          read: false,
          createdAt: Date.now() - 1000 * 60 * 60, // 1 hour ago
        }
      ],
      addNotification: (title: string, message: string) =>
        set((state) => ({
          notifications: [
            {
              id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
              title,
              message,
              read: false,
              createdAt: Date.now(),
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (id: string) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearAll: () => set({ notifications: [] }),
      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: "tatvam-notifications",
    }
  )
);
