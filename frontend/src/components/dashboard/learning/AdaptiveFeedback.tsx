"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, GitBranch, ArrowRight } from "lucide-react";

interface AdaptiveFeedbackProps {
  status: "mastered" | "confused" | "analogy";
  onContinue: () => void;
}

export function AdaptiveFeedback({ status, onContinue }: AdaptiveFeedbackProps) {
  
  const content = {
    mastered: {
      title: "Concept Mastered",
      desc: "Excellent! Your knowledge graph has been updated. You're ready to move on.",
      color: "from-[#48BB78] to-[#38A169]",
      bg: "bg-[#F0FFF4]",
      icon: <Zap className="w-6 h-6 text-[#48BB78]" />
    },
    confused: {
      title: "Roadmap Re-routed",
      desc: "That's perfectly fine. We've updated your roadmap to include a foundational review before we continue.",
      color: "from-[#FC8181] to-[#E53E3E]",
      bg: "bg-[#FFF5F5]",
      icon: <GitBranch className="w-6 h-6 text-[#FC8181]" />
    },
    analogy: {
      title: "Generating New Approach",
      desc: "Let's try a different angle. The Mentor is preparing an analogy tailored to your background.",
      color: "from-[#ED8936] to-[#DD6B20]",
      bg: "bg-[#FFF8F1]",
      icon: <GitBranch className="w-6 h-6 text-[#ED8936]" />
    }
  }[status];

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, y: 20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      className={`my-12 p-8 rounded-[24px] border border-black/5 ${content.bg} overflow-hidden relative shadow-sm`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
            {content.icon}
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[#1B1D35] mb-1">{content.title}</h3>
            <p className="text-[15px] text-[#4A5568]">{content.desc}</p>
          </div>
        </div>
        
        <button 
          onClick={onContinue}
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B1D35] text-white font-semibold text-[14px] hover:bg-[#2D3748] transition-colors"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
