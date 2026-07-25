"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, X } from "lucide-react";
import { useEngineStore } from "@/store/engine-store";

interface ContextualPracticeProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptId: string;
}

export function ContextualPractice({ question, options, correctIndex, explanation, conceptId }: ContextualPracticeProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { recordInteraction } = useEngineStore();

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setIsSubmitted(true);
    
    // Log to engine
    const isCorrect = selected === correctIndex;
    recordInteraction(conceptId, isCorrect ? "mastered" : "confused");
  };

  return (
    <div className="my-10 bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-sm">
      <div className="px-6 py-4 bg-[#F8F9FF] border-b border-[#E2E8F0] flex items-center gap-3">
        <Target className="w-5 h-5 text-[#6C5CE7]" />
        <h4 className="text-[14px] font-bold text-[#1B1D35]">Quick Challenge</h4>
      </div>
      
      <div className="p-6 md:p-8">
        <p className="text-[16px] text-[#1B1D35] font-medium mb-6 leading-relaxed">{question}</p>
        
        <div className="flex flex-col gap-3">
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrectOption = idx === correctIndex;
            const showSuccess = isSubmitted && isCorrectOption;
            const showError = isSubmitted && isSelected && !isCorrectOption;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={`text-left p-4 rounded-[16px] border transition-all flex items-center justify-between ${
                  showSuccess ? "bg-[#F0FFF4] border-[#48BB78] text-[#2F855A]" :
                  showError ? "bg-[#FFF5F5] border-[#FC8181] text-[#C53030]" :
                  isSelected ? "bg-[#F8F9FF] border-[#6C5CE7] text-[#6C5CE7]" :
                  "bg-white border-[#E2E8F0] text-[#4A5568] hover:border-[#CBD5E0]"
                }`}
              >
                <span className="text-[15px]">{opt}</span>
                {showSuccess && <Check className="w-5 h-5 text-[#48BB78]" />}
                {showError && <X className="w-5 h-5 text-[#FC8181]" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {!isSubmitted && selected !== null && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <button 
                onClick={handleSubmit}
                className="px-6 py-3 bg-[#1B1D35] text-white rounded-[12px] text-[14px] font-bold hover:bg-[#2D3748] transition-colors"
              >
                Check Answer
              </button>
            </motion.div>
          )}

          {isSubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-[#F8F9FF] rounded-[16px] border border-[#E2E8F0]"
            >
              <p className="text-[14px] text-[#4A5568] leading-relaxed">
                <strong className="text-[#1B1D35]">Explanation:</strong> {explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
