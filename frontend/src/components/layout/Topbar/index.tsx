"use client";

import { Menu } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { SearchBar } from "./SearchBar";
import { CommandPaletteButton } from "./CommandPaletteButton";
import { NotificationButton } from "./NotificationButton";
import { UserMenu } from "./UserMenu";

export function Topbar() {
  const { setMobileDrawerOpen } = useLayout();

  return (
    <header className="h-20 shrink-0 bg-transparent flex items-center justify-between px-6 lg:px-10 z-20">
      
      {/* Mobile Toggle & Left Side Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md border border-[rgba(108,92,231,0.1)] text-[#1B1D35] hover:bg-white shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Command Palette Button replaces SearchBar on Desktop if preferred, or we show both. Let's show CommandPalette on large screens, standard Search on tablets. */}
        <div className="hidden md:block lg:hidden">
          <SearchBar />
        </div>
        <div className="hidden lg:block">
          <CommandPaletteButton />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        <NotificationButton />
        <div className="w-px h-6 bg-[rgba(108,92,231,0.1)] hidden sm:block" />
        <UserMenu />
      </div>

    </header>
  );
}
