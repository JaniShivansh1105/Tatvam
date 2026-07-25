"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ReactNode } from "react";
import { DASHBOARD_CONSTANTS } from "./constants";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-5 flex flex-col gap-3 bg-white/60 hover:bg-white/80 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#6B7280]">{label}</span>
          <div className="text-[#6C5CE7] w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center shrink-0">
            {icon}
          </div>
        </div>
        <div className="text-[28px] font-bold text-[#1B1D35] tracking-tight">
          {value}
        </div>
      </GlassCard>
    </motion.div>
  );
}
