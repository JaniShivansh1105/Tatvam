"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  FileText, 
  Target, 
  BrainCircuit, 
  TrendingUp, 
  Settings,
  LogOut
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Learn", href: "/dashboard/learn", icon: BookOpen },
  { name: "Subjects", href: "/dashboard/subjects", icon: Library },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Practice", href: "/dashboard/practice", icon: Target },
  { name: "Flashcards", href: "/dashboard/flashcards", icon: BrainCircuit },
  { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-20 md:w-64 h-full flex flex-col bg-[#FAFAFC] py-6 px-3 border-r border-transparent md:border-gray-200/50 transition-all duration-300">
      
      {/* BRANDING */}
      <div className="flex items-center justify-center md:justify-start px-2 mb-10">
        <div className="w-10 h-10 bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] rounded-[14px] flex items-center justify-center shadow-sm shrink-0">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="hidden md:block ml-3 font-semibold text-xl tracking-tight text-[#1B1D35]">Tatvam</span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href} className="relative">
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute inset-0 bg-[#E5E1FF]/60 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                isActive ? "text-[#6C5CE7] font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
              }`}>
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#6C5CE7]" : "text-gray-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden md:block text-[15px]">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM ACTIONS */}
      <div className="mt-auto pt-4 flex flex-col gap-1.5 border-t border-gray-200/50">
        <Link href="/dashboard/settings" className="relative">
          {pathname === "/dashboard/settings" && (
            <motion.div 
              layoutId="sidebar-active" 
              className="absolute inset-0 bg-[#E5E1FF]/60 rounded-xl"
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
            pathname === "/dashboard/settings" ? "text-[#6C5CE7] font-medium" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
          }`}>
            <Settings className={`w-5 h-5 shrink-0 ${pathname === "/dashboard/settings" ? "text-[#6C5CE7]" : "text-gray-400"}`} strokeWidth={pathname === "/dashboard/settings" ? 2.5 : 2} />
            <span className="hidden md:block text-[15px]">Settings</span>
          </div>
        </Link>

        <button
          onClick={logout}
          className="relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-gray-500 hover:text-red-500 hover:bg-red-50/50"
        >
          <LogOut className="w-5 h-5 shrink-0 text-gray-400" strokeWidth={2} />
          <span className="hidden md:block text-[15px]">Log Out</span>
        </button>
      </div>

    </aside>
  );
}
