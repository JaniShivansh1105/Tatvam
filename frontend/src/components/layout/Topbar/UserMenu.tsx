"use client";

import { useAuthStore } from "@/store/auth-store";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);
  
  // Simple initials fallback
  const initials = user?.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "US";

  return (
    <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center text-white shadow-sm ring-2 ring-white/50 hover:ring-[#6C5CE7]/30 transition-all cursor-pointer">
      <span className="text-[13px] font-bold tracking-wider">{initials}</span>
    </button>
  );
}
