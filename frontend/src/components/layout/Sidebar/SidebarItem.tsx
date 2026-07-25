"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/navigation";
import { useLayout } from "@/context/LayoutContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  item: NavItem;
  onClick?: () => void;
}

export function SidebarItem({ item, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useLayout();
  
  const isActive = item.exact 
    ? pathname === item.href 
    : pathname.startsWith(item.href);

  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center relative group rounded-[16px] transition-all duration-300 overflow-hidden",
        isSidebarCollapsed ? "justify-center w-11 h-11" : "px-4 py-2 w-full",
        isActive 
          ? "bg-white/80 text-[#6C5CE7] shadow-[0_4px_20px_-10px_rgba(108,92,231,0.15)] font-semibold" 
          : "text-[#6B7280] hover:bg-white/50 hover:text-[#1B1D35] font-medium"
      )}
    >
      {/* Active Indicator Line (Only in expanded mode for a subtle touch, or we keep it clean as requested) */}
      {isActive && !isSidebarCollapsed && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-[15%] bottom-[15%] w-[3px] bg-[#6C5CE7] rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <Icon 
        className={cn(
          "shrink-0 transition-transform duration-300", 
          isSidebarCollapsed ? "w-6 h-6" : "w-5 h-5 mr-3",
          isActive ? "text-[#6C5CE7]" : "group-hover:scale-110"
        )} 
        strokeWidth={isActive ? 2.5 : 2} 
      />

      <AnimatePresence mode="wait">
        {!isSidebarCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate text-[14.5px]"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (isSidebarCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className="bg-white/90 backdrop-blur-md border-white/60 text-[#1B1D35] font-medium shadow-[0_4px_20px_-10px_rgba(108,92,231,0.2)] rounded-[12px] px-3 py-1.5">
            {item.name}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}
