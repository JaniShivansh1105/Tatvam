"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { BrainCircuit, Sparkles, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const MODES = [
  { id: "normal", label: "Normally", text: "Newton's First Law (Inertia) states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force." },
  { id: "simply", label: "Simply", text: "Things want to keep doing what they are already doing. A resting object stays resting, and a moving object keeps moving, until something else pushes or pulls it." },
  { id: "child", label: "Like I'm 10", text: "Imagine a skateboard. If you don't push it, it just sits there. But if you push it, it keeps rolling until friction (or a wall!) stops it." },
  { id: "analogy", label: "Analogy", text: "It's like being asleep in a cozy bed. You want to stay asleep (at rest) until your loud alarm clock (an unbalanced force) forces you to wake up and move!" },
  { id: "visual", label: "Visually", text: "Here is a simple visualization of inertia.", visual: true }
];

export function AIMentorDemo() {
  const [activeMode, setActiveMode] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedText, setDisplayedText] = useState(MODES[0].text);
  const [isStreaming, setIsStreaming] = useState(false);

  // Handle mode switching with thinking and streaming simulation
  const handleModeChange = (idx: number) => {
    if (idx === activeMode || isThinking || isStreaming) return;
    
    setActiveMode(idx);
    setIsThinking(true);
    setDisplayedText(""); // Clear text for thinking phase
    
    // Simulate thinking delay
    setTimeout(() => {
      setIsThinking(false);
      setIsStreaming(true);
      
      // Simulate streaming response
      const targetText = MODES[idx].text;
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(targetText.slice(0, i));
        i += 3; // Stream chunks
        if (i >= targetText.length) {
          setDisplayedText(targetText);
          setIsStreaming(false);
          clearInterval(interval);
        }
      }, 20);
    }, 800);
  };

  return (
    <section className="pt-12 pb-24 relative overflow-hidden bg-white">
      <MarketingContainer>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            variants={marketingAnimations.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col max-w-lg"
          >
            <span className="text-[#6C5CE7] font-bold text-[14px] tracking-wider uppercase mb-2 block">Intelligent Teaching</span>
            <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] leading-[1.1] mb-4">
              Meet Your AI Mentor.
            </motion.h2>
            <motion.p variants={marketingAnimations.fadeUp} className="text-[16px] md:text-[18px] text-[#6B7280] leading-relaxed mb-8">
              It doesn&apos;t just spit out answers. It teaches. Whether you need a simple analogy, a vernacular translation, or a visual breakdown, the Mentor adapts instantly to how you learn best.
            </motion.p>
            
            <motion.div variants={marketingAnimations.fadeUp} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7]">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1B1D35]">Context-Aware Responses</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1B1D35]">Real-time Vernacular Translation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1B1D35]">Generative Concept Visuals</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Chat Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full bg-[#F8F9FF] rounded-[24px] border border-[rgba(108,92,231,0.1)] shadow-[0_20px_40px_-15px_rgba(108,92,231,0.1)] overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white/60 backdrop-blur-md border-b border-[rgba(108,92,231,0.08)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center">
                  <Image src="/logos/tatvam-logo.png" alt="Tatvam" fill sizes="40px" className="object-contain p-2 filter brightness-0 invert" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#1B1D35]">Tatvam Mentor</h4>
                  <p className="text-[12px] text-[#A0AEC0]">Always active</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-6 flex-1 min-h-[400px] flex flex-col gap-6 relative">
              {/* Static Student Message */}
              <div className="self-end flex flex-col items-end max-w-[85%]">
                <div className="p-3.5 rounded-[16px] text-[14px] leading-relaxed shadow-sm bg-[#1B1D35] text-white rounded-tr-sm">
                  I don&apos;t understand Newton&apos;s First Law.
                </div>
              </div>

              {/* Dynamic AI Message */}
              <div className="self-start flex flex-col items-start w-[90%]">
                <div className="w-full">
                  {/* Mode Selector */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {MODES.map((mode, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleModeChange(idx)}
                        disabled={isThinking || isStreaming}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                          activeMode === idx
                            ? "bg-[#6C5CE7] text-white shadow-md scale-105"
                            : "bg-white text-[#A0AEC0] border border-[#E2E8F0] hover:border-[#6C5CE7] hover:text-[#6C5CE7]"
                        } ${(isThinking || isStreaming) && activeMode !== idx ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {/* Message Bubble */}
                  <div className="p-4 rounded-[16px] text-[14px] leading-relaxed shadow-sm bg-white text-[#4A5568] border border-[rgba(108,92,231,0.1)] rounded-tl-sm min-h-[100px] transition-all duration-300 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isThinking ? (
                        <motion.div
                          key="thinking"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex gap-1.5 items-center h-full pt-2"
                        >
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-[#A0AEC0]" />
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-[#A0AEC0]" />
                          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-[#A0AEC0]" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="content"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {displayedText}
                          {isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-[#6C5CE7] animate-pulse align-middle" />}
                          
                          {/* Generative Visual Placeholder */}
                          {!isStreaming && MODES[activeMode].visual && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "128px" }}
                              className="mt-4 w-full bg-[#F8F9FF] rounded-[8px] border border-[rgba(108,92,231,0.1)] flex items-center justify-center overflow-hidden relative"
                            >
                              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(108,92,231,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                              <div className="w-16 h-4 bg-[#6C5CE7] rounded-full shadow-md" />
                              <div className="w-4 h-4 bg-[#FC8181] rounded-full shadow-md ml-4" />
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input Placeholder */}
            <div className="p-4 bg-white border-t border-[rgba(108,92,231,0.08)] mt-auto">
              <div className="w-full h-10 bg-[#F8F9FF] rounded-full border border-[#E2E8F0] px-4 flex items-center text-[#A0AEC0] text-[13px]">
                Ask for an explanation...
              </div>
            </div>
          </motion.div>

        </div>
      </MarketingContainer>
    </section>
  );
}
