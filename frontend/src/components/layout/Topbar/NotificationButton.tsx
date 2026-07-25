"use client";

import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors text-[#6B7280] hover:text-[#1B1D35]">
      <Bell className="w-5 h-5" />
      {/* Active Badge */}
      <span className="absolute top-2 right-2 w-2 h-2 bg-[#FC8181] rounded-full border-2 border-[#F8F9FF]" />
    </button>
  );
}
