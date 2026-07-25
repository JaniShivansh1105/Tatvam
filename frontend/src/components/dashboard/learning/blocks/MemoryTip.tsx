"use client";

import React from "react";
import { Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface MemoryTipProps {
  children: React.ReactNode;
}

export function MemoryTip({ children }: MemoryTipProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="my-8 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#F0E6FF] to-transparent rounded-[20px] opacity-50" />
      
      <div className="relative z-10 flex items-start gap-4 p-6 border-l-4 border-[#6C5CE7] rounded-r-[20px]">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 text-[#6C5CE7]">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[#6C5CE7] uppercase tracking-wider flex items-center gap-2 mb-1">
            Memory Trick <Sparkles className="w-3 h-3" />
          </h4>
          <div className="text-[16px] text-[#4A5568] leading-relaxed font-medium">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
