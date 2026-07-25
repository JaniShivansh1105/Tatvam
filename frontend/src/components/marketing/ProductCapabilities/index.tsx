"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { GlassCard } from "@/components/ui/GlassCard";
import { BrainCircuit, GitBranch, Sparkles, RefreshCcw, BookOpen, Presentation } from "lucide-react";

const CAPABILITIES = [
  {
    title: "Adaptive Learning Engine",
    desc: "A core that continuously reshapes your curriculum based on real-time performance.",
    icon: <BrainCircuit className="w-5 h-5 text-[#6C5CE7]" />,
    color: "#6C5CE7",
    bg: "bg-[#F0E6FF]"
  },
  {
    title: "Knowledge Graph",
    desc: "A living neural map tracking the exact probabilistic state of your understanding.",
    icon: <GitBranch className="w-5 h-5 text-[#3182CE]" />,
    color: "#3182CE",
    bg: "bg-[#EBF8FF]"
  },
  {
    title: "Dynamic Roadmap",
    desc: "An intelligent pathing system that re-routes instantly when gaps are detected.",
    icon: <RefreshCcw className="w-5 h-5 text-[#48BB78]" />,
    color: "#48BB78",
    bg: "bg-[#F0FFF4]"
  },
  {
    title: "AI Teaching Mentor",
    desc: "An always-on companion that breaks down complex ideas into simple vernacular.",
    icon: <Sparkles className="w-5 h-5 text-[#ED8936]" />,
    color: "#ED8936",
    bg: "bg-[#FFFAF0]"
  },
  {
    title: "Concept Visualization",
    desc: "Generative visual aids that bridge the gap between abstract theory and intuition.",
    icon: <Presentation className="w-5 h-5 text-[#805AD5]" />,
    color: "#805AD5",
    bg: "bg-[#FAF5FF]"
  },
  {
    title: "Spaced Repetition",
    desc: "A cognitive scheduler that resurfaces concepts exactly when you are about to forget them.",
    icon: <BookOpen className="w-5 h-5 text-[#E53E3E]" />,
    color: "#E53E3E",
    bg: "bg-[#FFF5F5]"
  }
];

export function ProductCapabilities() {
  return (
    <section className="py-24 relative bg-white border-b border-[rgba(108,92,231,0.05)] overflow-hidden">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <motion.div variants={marketingAnimations.fadeUp} className="text-center mb-16">
            <h2 className="text-[32px] font-extrabold text-[#1B1D35] tracking-tight mb-4">A Living Educational Ecosystem</h2>
            <p className="text-[16px] text-[#6B7280] max-w-2xl mx-auto">
              Tatvam operates through a network of interconnected systems, each designed to optimize how human memory and understanding actually function.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => (
              <motion.div key={idx} variants={marketingAnimations.fadeUp}>
                <GlassCard className="p-6 h-full bg-white hover:border-[#6C5CE7]/30 transition-all duration-300 group overflow-hidden relative cursor-default shadow-sm hover:shadow-md">
                  {/* Subtle background glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-[#F8F9FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${cap.bg}`}>
                        {cap.icon}
                      </div>
                      <h3 className="text-[16px] font-bold text-[#1B1D35]">{cap.title}</h3>
                    </div>
                    <p className="text-[14px] text-[#6B7280] leading-relaxed flex-1">
                      {cap.desc}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
