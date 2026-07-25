"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface InsightPanelProps {
  title?: string;
  children: React.ReactNode;
}

export function InsightPanel({ title = "AI Insight", children }: InsightPanelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="my-8 p-6 rounded-[24px] bg-gradient-to-br from-[#F8F9FF] to-white border border-[rgba(108,92,231,0.15)] shadow-[0_10px_30px_-15px_rgba(108,92,231,0.1)] relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E5E1FF] to-transparent opacity-30 rounded-bl-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7]">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[14px] font-bold text-[#1B1D35] uppercase tracking-wider">{title}</span>
      </div>
      
      <div className="text-[15px] text-[#4A5568] leading-relaxed relative z-10 pl-11">
        {children}
      </div>
    </motion.div>
  );
}
