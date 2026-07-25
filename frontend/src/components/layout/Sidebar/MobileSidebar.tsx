"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "@/context/LayoutContext";
import { SidebarItem } from "./SidebarItem";
import { navigationConfig } from "@/config/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/config/routes";

export function MobileSidebar() {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useLayout();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    setMobileDrawerOpen(false);
    logout();
  };

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-[#1B1D35]/20 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white/95 backdrop-blur-2xl border-r border-[rgba(108,92,231,0.08)] z-50 flex flex-col md:hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-[rgba(108,92,231,0.06)] shrink-0">
              <Link href={ROUTES.DASHBOARD.HOME} className="flex items-center gap-3 outline-none" onClick={() => setMobileDrawerOpen(false)}>
                <div className="relative w-8 h-8 shrink-0">
                  <Image src="/logos/tatvam-logo.png" alt="Tatvam Logo" fill sizes="32px" className="object-contain" />
                </div>
                <span className="text-[20px] font-semibold tracking-tight text-[#1B1D35]">Tatvam</span>
              </Link>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F8F9FF] text-[#6B7280] hover:text-[#1B1D35] hover:bg-[#EDF2F7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6">
              {navigationConfig.map((group, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  {group.label && (
                    <div className="px-6 mb-2">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">
                        {group.label}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 px-4">
                    {group.items.map((item) => (
                      <SidebarItem key={item.name} item={item} onClick={() => setMobileDrawerOpen(false)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 shrink-0 border-t border-[rgba(108,92,231,0.06)]">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-[16px] transition-colors duration-200 text-[#E53E3E] hover:bg-[#FFF5F5]"
              >
                <LogOut className="w-5 h-5 mr-3 shrink-0" />
                <span className="font-medium text-[14.5px]">Log out</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
