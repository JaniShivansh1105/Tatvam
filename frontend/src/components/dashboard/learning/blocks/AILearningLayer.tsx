"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, BookOpen, Lightbulb, Image as ImageIcon } from "lucide-react";

interface AILearningLayerProps {
  term: string;
  children: React.ReactNode;
}

export function AILearningLayer({ term, children }: AILearningLayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <span className="relative inline-block" ref={containerRef}>
      <span 
        onClick={() => setIsOpen(!isOpen)}
        className={`cursor-pointer font-semibold transition-colors border-b-2 ${
          isOpen ? "text-[#6C5CE7] border-[#6C5CE7]" : "text-[#1B1D35] border-[rgba(108,92,231,0.3)] hover:text-[#6C5CE7] hover:border-[#6C5CE7] hover:bg-[#F0E6FF]"
        }`}
      >
        {children}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[280px] bg-white rounded-[16px] shadow-[0_10px_40px_-10px_rgba(108,92,231,0.3)] border border-[#E2E8F0] p-3 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2 mb-2 px-2 pt-1">
              <BrainCircuit className="w-4 h-4 text-[#6C5CE7]" />
              <span className="text-[12px] font-bold text-[#1B1D35] uppercase tracking-wider">AI Context: {term}</span>
            </div>
            
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8F9FF] text-[#4A5568] transition-colors group">
              <BookOpen className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#6C5CE7]" />
              <span className="text-[13px] font-medium">Explain Simpler</span>
            </button>
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8F9FF] text-[#4A5568] transition-colors group">
              <Lightbulb className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#ED8936]" />
              <span className="text-[13px] font-medium">Give me an analogy</span>
            </button>
            <button className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8F9FF] text-[#4A5568] transition-colors group">
              <ImageIcon className="w-4 h-4 text-[#A0AEC0] group-hover:text-[#48BB78]" />
              <span className="text-[13px] font-medium">Show visual</span>
            </button>
            
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-[#E2E8F0] rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
