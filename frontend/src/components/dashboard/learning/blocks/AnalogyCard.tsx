"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

interface AnalogyCardProps {
  title?: string;
  children: React.ReactNode;
}

export function AnalogyCard({ title = "Think of it like this...", children }: AnalogyCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="my-8 p-8 rounded-[24px] bg-[#FFF8F1] border border-[#FEEBC8] shadow-sm relative overflow-hidden"
    >
      <div className="flex items-start gap-4 relative z-10">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#FEEBC8] flex items-center justify-center text-[#ED8936] shrink-0 mt-1">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-[16px] font-bold text-[#DD6B20] mb-2">{title}</h4>
          <div className="text-[16px] text-[#7B341E] leading-relaxed italic">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
