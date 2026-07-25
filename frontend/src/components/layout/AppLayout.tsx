"use client";

import { Sidebar } from "./Sidebar";
import { MobileSidebar } from "./Sidebar/MobileSidebar";
import { Topbar } from "./Topbar";
import { CommandPaletteModal } from "./CommandPalette/CommandPaletteModal";

export function AppLayout({ children }: { children: React.ReactNode }) {
  // We consume the context just to ensure we are wrapped in LayoutProvider if needed,
  // but LayoutProvider must wrap AppLayout itself. See the root layout implementation.

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#F8F9FF] selection:bg-[#6C5CE7]/20 font-sans relative">
      
      {/* Global Ambient Background (Subtle version for authenticated app) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#F8F9FF] z-0" />
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#E5E1FF] blur-[120px] opacity-30 mix-blend-multiply z-0" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#FFF0F7] blur-[100px] opacity-30 mix-blend-multiply z-0" />
      </div>

      {/* Sidebars */}
      <Sidebar />
      <MobileSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 relative overflow-hidden">
        <Topbar />
        
        {/* The children will typically be a PageContainer wrapping the page specific content */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <CommandPaletteModal />

    </div>
  );
}
