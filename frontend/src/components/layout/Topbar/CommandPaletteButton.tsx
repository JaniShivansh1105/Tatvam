"use client";

import { useLayout } from "@/context/LayoutContext";
import { Search } from "lucide-react";

export function CommandPaletteButton() {
  const { setCommandPaletteOpen } = useLayout();

  return (
    <button
      onClick={() => setCommandPaletteOpen(true)}
      className="hidden lg:flex items-center gap-3 h-10 px-4 bg-white/50 backdrop-blur-md border border-[rgba(108,92,231,0.1)] rounded-full text-[13px] text-[#6B7280] font-medium hover:bg-white/80 hover:border-[rgba(108,92,231,0.2)] hover:text-[#1B1D35] transition-all shadow-sm group"
    >
      <Search className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#6C5CE7] transition-colors" />
      <span>Quick search...</span>
      <div className="flex items-center gap-1 opacity-60">
        <kbd className="font-sans border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[11px] bg-white">Ctrl</kbd>
        <span className="text-[10px]">+</span>
        <kbd className="font-sans border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[11px] bg-white">K</kbd>
      </div>
    </button>
  );
}
