"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SidebarItem } from "./SidebarItem";
import type { NavGroup } from "@/config/navigation";
import { useLayout } from "@/context/LayoutContext";

interface SidebarGroupProps {
  group: NavGroup;
  onItemClick?: () => void;
}

export function SidebarGroup({ group, onItemClick }: SidebarGroupProps) {
  const { isSidebarCollapsed } = useLayout();

  return (
    <div className="flex flex-col mb-4 last:mb-0">
      <AnimatePresence mode="wait">
        {group.label && !isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider mb-2 px-4"
          >
            {group.label}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-1 px-3">
        {group.items.map((item) => (
          <SidebarItem key={item.name} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
}
