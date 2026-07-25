"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Beaker } from "lucide-react";

interface DeepDiveProps {
  title: string;
  children: React.ReactNode;
}

export function DeepDive({ title, children }: DeepDiveProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-8 rounded-[24px] border border-[#E2E8F0] overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-[#FAFAFC] to-white focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#4A5568]">
            <Beaker className="w-4 h-4" />
          </div>
          <span className="text-[16px] font-bold text-[#1B1D35]">Deep Dive: {title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-[#A0AEC0]">
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-[15px] text-[#4A5568] leading-relaxed border-t border-[#E2E8F0] mt-4 bg-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
