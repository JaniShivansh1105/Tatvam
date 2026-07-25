"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, ArrowRight, Brain, Clock } from "lucide-react";
import { DASHBOARD_CONSTANTS } from "./constants";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

interface AIInsightProps {
  data: {
    observation: string;
    weakness: string;
    recommendation: string;
    confidence: string;
    basis: string;
    timestamp: string;
  }
}

export function AIInsightCard({ data }: AIInsightProps) {
  const { observation, weakness, recommendation, confidence, basis, timestamp } = data;

  return (
    <motion.div variants={itemVariants} className="h-full">
      <GlassCard className="p-6 h-full flex flex-col relative overflow-hidden bg-gradient-to-br from-white/90 to-[#F8F9FF]/80">
        
        {/* Decorative ambient glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E5E1FF] blur-[40px] opacity-60 rounded-full pointer-events-none" />

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#6C5CE7] font-semibold text-[14px]">
              <Sparkles className="w-4 h-4" />
              <span>AI Insight</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#A0AEC0] font-medium">
              <Clock className="w-3 h-3" />
              {timestamp}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[12px] font-bold uppercase tracking-wider px-2 py-0.5 bg-white rounded border border-[#E2E8F0] text-[#1B1D35]">
              {confidence} <span className="text-[#6B7280] font-medium lowercase">confidence</span>
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 mb-6">
          <p className="text-[15px] text-[#1B1D35] font-medium leading-relaxed">
            {observation}
          </p>
          <div className="bg-[#FFF5F5] border border-[#FED7D7] rounded-[12px] p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[12px] text-[#C53030] font-semibold uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" /> Area to Improve
            </div>
            <p className="text-[14px] text-[#1B1D35]">{weakness}</p>
          </div>
          <p className="text-[12px] text-[#718096] italic pl-1 border-l-2 border-[#E2E8F0]">
            Based on: {basis}
          </p>
        </div>

        <button className="mt-auto relative z-10 flex items-center justify-between w-full p-3 rounded-[16px] bg-white border border-[#E2E8F0] hover:border-[#6C5CE7] hover:shadow-sm transition-all group text-left">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#6B7280] font-medium mb-0.5">Recommended action</span>
            <span className="text-[14px] text-[#1B1D35] font-semibold group-hover:text-[#6C5CE7] transition-colors">
              {recommendation}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F8F9FF] flex items-center justify-center text-[#6C5CE7] group-hover:bg-[#6C5CE7] group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

      </GlassCard>
    </motion.div>
  );
}
