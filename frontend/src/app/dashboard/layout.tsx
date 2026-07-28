"use client";

import { AuthGuard } from "@/components/providers/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-[100dvh] w-full bg-[#FAFAFC] text-[#1B1D35] overflow-hidden selection:bg-[#6C5CE7]/20 font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white/50 backdrop-blur-3xl m-2 rounded-[24px] border border-gray-200/50 shadow-sm">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
