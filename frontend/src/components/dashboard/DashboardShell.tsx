"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DASHBOARD_CONSTANTS } from "./constants";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      duration: DASHBOARD_CONSTANTS.animations.pageEntrance
    }
  }
};

export function DashboardShell({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn("w-full h-full flex flex-col gap-4", className)}
    >
      {/* 
        Grid Layout: 
        Desktop: 12 columns. Left column spans 8, right column spans 4.
        Tablet: 12 columns, different spans or single column.
        Mobile: single column.
      */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start pb-4">
        {children}
      </div>
    </motion.div>
  );
}
