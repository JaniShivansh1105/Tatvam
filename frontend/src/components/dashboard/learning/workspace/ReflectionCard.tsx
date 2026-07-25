"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2 } from "lucide-react";
import { useEngineStore } from "@/store/engine-store";

interface ReflectionCardProps {
  prompt: string;
}

export function ReflectionCard({ prompt }: ReflectionCardProps) {
  const [text, setText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { updateTimelineStatus } = useEngineStore();

  const handleSubmit = () => {
    if (!text.trim()) return;
    setIsSubmitted(true);
    updateTimelineStatus("t5", "completed");
  };

  return (
    <div className="my-16 bg-gradient-to-br from-[#1B1D35] to-[#2D3748] rounded-[24px] overflow-hidden shadow-lg text-white">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#E5E1FF]" />
          </div>
          <h4 className="text-[16px] font-bold tracking-wide text-white">Reflection</h4>
        </div>
        
        <p className="text-[18px] font-medium text-white/90 mb-6">{prompt}</p>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your explanation here..."
                className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-[16px] text-[15px] text-white resize-none outline-none focus:border-[#8B7CF6] focus:bg-white/10 transition-all custom-scrollbar placeholder:text-white/30"
              />
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="px-6 py-2.5 bg-white text-[#1B1D35] rounded-[12px] text-[14px] font-bold hover:bg-[#F8F9FF] disabled:opacity-50 transition-colors"
                >
                  Save Reflection
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-white/5 border border-white/10 rounded-[16px] flex flex-col items-center justify-center text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-[#48BB78] mb-3" />
              <h5 className="text-[16px] font-bold mb-1">Great Job!</h5>
              <p className="text-[14px] text-white/70">Reflecting on what you&apos;ve learned increases retention by up to 40%.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
