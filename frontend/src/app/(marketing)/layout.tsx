"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Scroll Restoration: Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-[#F8F9FF] text-[#1B1D35] overflow-x-hidden selection:bg-[#6C5CE7] selection:text-white">
      {/* Global Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#E0E7FF] to-transparent blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-gradient-to-bl from-[#F3E8FF] to-transparent blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-gradient-to-tr from-[#E0E7FF] to-transparent blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col min-h-screen w-full">
        {children}
      </main>
    </div>
  );
}
