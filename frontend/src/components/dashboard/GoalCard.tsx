"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { DASHBOARD_CONSTANTS } from "./constants";
import { Target, TrendingUp } from "lucide-react";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

interface GoalCardProps {
  data: {
    current: number;
    target: number;
  }
}

export function GoalCard({ data }: GoalCardProps) {
  const { current, target } = data;
  const percentage = Math.min((current / target) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6 flex flex-col gap-6 relative overflow-hidden bg-white/80">
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-[#1B1D35] font-semibold text-[15px]">
            <Target className="w-4 h-4 text-[#6C5CE7]" />
            <span>Today&apos;s Goal</span>
          </div>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">
            {Math.round(percentage)}% Complete
          </span>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          {/* Progress Ring */}
          <div className="relative w-[90px] h-[90px] shrink-0 drop-shadow-sm">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                className="text-[#F0E6FF] stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
              />
              <motion.circle
                className="text-[#6C5CE7] stroke-current"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: 0.2, type: "spring" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[20px] font-bold text-[#1B1D35] leading-none">{current}</span>
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold mt-0.5">/{target}m</span>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[14px] text-[#1B1D35] font-medium leading-tight">
              You are <strong className="text-[#6C5CE7]">{target - current} minutes</strong> away from hitting your daily study goal.
            </p>
            <div className="flex items-center gap-1.5 mt-2 bg-[#F0FFF4] text-[#38A169] text-[12px] font-semibold px-2 py-1 rounded-lg w-fit border border-[#C6F6D5]">
              <TrendingUp className="w-3.5 h-3.5" />
              Keep the momentum!
            </div>
          </div>
        </div>

      </GlassCard>
    </motion.div>
  );
}
