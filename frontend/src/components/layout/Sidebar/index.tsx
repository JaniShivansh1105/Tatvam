"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LogOut, ChevronLeft } from "lucide-react";
import { navigationConfig } from "@/config/navigation";
import { SidebarGroup } from "./SidebarGroup";
import { useLayout } from "@/context/LayoutContext";
import { useAuthStore } from "@/store/auth-store";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/routes";

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useLayout();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isSidebarCollapsed ? 90 : 260 
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="hidden md:flex flex-col h-full bg-white/40 backdrop-blur-xl border-r border-[rgba(108,92,231,0.08)] relative z-30 shrink-0"
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#6C5CE7] hover:border-[#6C5CE7] shadow-sm z-40 transition-colors"
      >
        <motion.div
          animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Header / Logo */}
      <div className={cn(
        "flex items-center h-16 shrink-0 transition-all duration-300",
        isSidebarCollapsed ? "justify-center px-0" : "px-7"
      )}>
        <Link href={ROUTES.DASHBOARD.HOME} className="flex items-center gap-3 outline-none">
          <div className="relative w-7 h-7 shrink-0">
            <Image 
              src="/logos/tatvam-logo.png" 
              alt="Tatvam Logo" 
              fill 
              sizes="32px"
              className="object-contain" 
            />
          </div>
          {!isSidebarCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[19px] font-semibold tracking-tight text-[#1B1D35]"
            >
              Tatvam
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
        {navigationConfig.map((group, idx) => (
          <div key={idx}>
            <SidebarGroup group={group} />
            {idx < navigationConfig.length - 1 && (
              <div className="mx-6 my-2 h-px bg-[rgba(108,92,231,0.06)]" />
            )}
          </div>
        ))}
      </div>

      {/* User Avatar Footer Card */}
      <div className="p-3 shrink-0 border-t border-[rgba(108,92,231,0.06)]">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full rounded-[16px] transition-colors duration-200 text-[#E53E3E] hover:bg-[#FFF5F5]",
            isSidebarCollapsed ? "justify-center h-11" : "px-3 py-2"
          )}
        >
          <LogOut className={cn("shrink-0", isSidebarCollapsed ? "w-5 h-5" : "w-4 h-4 mr-2.5")} />
          {!isSidebarCollapsed && <span className="font-semibold text-[13.5px]">Log out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
