"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { GlassCard } from "@/components/ui/GlassCard";
import { BrainCircuit, RefreshCcw, LayoutTemplate, Target, Zap } from "lucide-react";

const PRINCIPLES = [
  {
    title: "Active Recall",
    desc: "Tatvam forces your brain to actively retrieve information rather than passively reading, vastly strengthening memory retention.",
    icon: <Zap className="w-5 h-5 text-[#FC8181]" />
  },
  {
    title: "Spaced Repetition",
    desc: "Concepts are reintroduced just as you are about to forget them, ensuring permanent storage in long-term memory.",
    icon: <RefreshCcw className="w-5 h-5 text-[#48BB78]" />
  },
  {
    title: "Retrieval Practice",
    desc: "Low-stakes testing is used continuously to measure understanding without exam anxiety.",
    icon: <Target className="w-5 h-5 text-[#6C5CE7]" />
  },
  {
    title: "Interleaving",
    desc: "Instead of practicing one topic endlessly, Tatvam intelligently mixes subjects to improve critical thinking and problem-solving.",
    icon: <LayoutTemplate className="w-5 h-5 text-[#ED8936]" />
  },
  {
    title: "Personalized Feedback",
    desc: "Immediate, context-aware corrections prevent misconceptions from solidifying in your mind.",
    icon: <BrainCircuit className="w-5 h-5 text-[#3182CE]" />
  }
];

export function CognitiveScience() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] mb-4">
              Backed by Cognitive Science
            </motion.h2>
            <motion.p variants={marketingAnimations.fadeUp} className="text-[16px] md:text-[18px] text-[#6B7280]">
              Why does traditional learning fail? Because it ignores how the human brain actually stores information. Tatvam is built on proven educational psychology.
            </motion.p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
            {PRINCIPLES.map((principle, idx) => (
              <motion.div key={idx} variants={marketingAnimations.fadeUp} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-grow max-w-md">
                <GlassCard className="p-6 h-full bg-[#F8F9FF] border-[rgba(108,92,231,0.08)] hover:border-[#6C5CE7]/30 hover:shadow-lg transition-all duration-300 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {principle.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-[#1B1D35] mb-2">{principle.title}</h3>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed">{principle.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
