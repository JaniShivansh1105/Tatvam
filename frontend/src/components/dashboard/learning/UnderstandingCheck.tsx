"use client";

import React, { useState } from "react";
import { Check, HelpCircle, Lightbulb } from "lucide-react";

interface UnderstandingCheckProps {
  onCheck: (status: "mastered" | "confused" | "analogy") => void;
}

export function UnderstandingCheck({ onCheck }: UnderstandingCheckProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (status: "mastered" | "confused" | "analogy") => {
    setSelected(status);
    setTimeout(() => {
      onCheck(status);
    }, 400); // Give time for the animation to play
  };

  return (
    <div className="my-12 p-8 bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm flex flex-col items-center text-center">
      <h3 className="text-[20px] font-bold text-[#1B1D35] mb-2">How are you feeling about this concept?</h3>
      <p className="text-[14px] text-[#6B7280] mb-8">Tatvam will adapt your roadmap based on your honest response.</p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[600px] justify-center">
        <button
          onClick={() => handleSelect("mastered")}
          className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-[16px] border transition-all ${
            selected === "mastered" ? "bg-[#F0FFF4] border-[#48BB78] scale-105" : "bg-[#F8F9FF] border-transparent hover:border-[#CBD5E0] hover:bg-white"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected === "mastered" ? "bg-[#48BB78] text-white" : "bg-white text-[#48BB78] shadow-sm"}`}>
            <Check className="w-5 h-5" />
          </div>
          <span className="text-[14px] font-semibold text-[#1B1D35]">I understand completely</span>
        </button>

        <button
          onClick={() => handleSelect("confused")}
          className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-[16px] border transition-all ${
            selected === "confused" ? "bg-[#FFF5F5] border-[#FC8181] scale-105" : "bg-[#F8F9FF] border-transparent hover:border-[#CBD5E0] hover:bg-white"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected === "confused" ? "bg-[#FC8181] text-white" : "bg-white text-[#FC8181] shadow-sm"}`}>
            <HelpCircle className="w-5 h-5" />
          </div>
          <span className="text-[14px] font-semibold text-[#1B1D35]">I&apos;m a bit confused</span>
        </button>

        <button
          onClick={() => handleSelect("analogy")}
          className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-[16px] border transition-all ${
            selected === "analogy" ? "bg-[#FFF8F1] border-[#ED8936] scale-105" : "bg-[#F8F9FF] border-transparent hover:border-[#CBD5E0] hover:bg-white"
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected === "analogy" ? "bg-[#ED8936] text-white" : "bg-white text-[#ED8936] shadow-sm"}`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-[14px] font-semibold text-[#1B1D35]">Teach it differently</span>
        </button>
      </div>
    </div>
  );
}
