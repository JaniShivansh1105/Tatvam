"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Target, RefreshCcw, BookOpen, Clock, Activity } from "lucide-react";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { GlassCard } from "@/components/ui/GlassCard";

const FEATURES = [
  {
    title: "Adaptive Learning Paths",
    description: "No two brains are the same. Tatvam generates a unique learning roadmap based exactly on what you know and what you don't.",
    icon: <Target className="w-5 h-5 text-[#6C5CE7]" />,
    bg: "bg-[#F0E6FF]",
  },
  {
    title: "Real-time Weakness Detection",
    description: "Our AI engine analyzes your practice sessions to identify exact conceptual gaps, so you never waste time studying what you already know.",
    icon: <Activity className="w-5 h-5 text-[#FC8181]" />,
    bg: "bg-[#FFF5F5]",
  },
  {
    title: "AI Mentor Guidance",
    description: "Stuck on a problem? Ask the AI Mentor for hints, vernacular explanations, or to break down a complex topic into simple analogies.",
    icon: <BrainCircuit className="w-5 h-5 text-[#3182CE]" />,
    bg: "bg-[#EBF8FF]",
  },
  {
    title: "Spaced Repetition",
    description: "Tatvam intelligently schedules reviews of previously learned concepts just as you are about to forget them, ensuring permanent retention.",
    icon: <RefreshCcw className="w-5 h-5 text-[#48BB78]" />,
    bg: "bg-[#F0FFF4]",
  },
  {
    title: "Vernacular Explanations",
    description: "Sometimes concepts are easier to grasp in your native language. Instantly translate complex technical explanations without losing context.",
    icon: <BookOpen className="w-5 h-5 text-[#ED8936]" />,
    bg: "bg-[#FFFAF0]",
  },
  {
    title: "Optimized Study Time",
    description: "Stop spending hours blindly reading textbooks. By targeting only your weak areas, Tatvam reduces study time while drastically improving grades.",
    icon: <Clock className="w-5 h-5 text-[#805AD5]" />,
    bg: "bg-[#FAF5FF]",
  },
];

export function WhyTatvam() {
  return (
    <section className="pt-24 pb-12 relative overflow-hidden bg-white/50">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] mb-4">
              Intelligence Built In.
            </motion.h2>
            <motion.p variants={marketingAnimations.fadeUp} className="text-[16px] md:text-[18px] text-[#6B7280]">
              Everything you need to master any subject, powered by a state-of-the-art personalized learning engine.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <motion.div key={idx} variants={marketingAnimations.fadeUp}>
                <GlassCard className="p-6 h-full flex flex-col bg-white hover:-translate-y-1 transition-transform duration-300 hover:shadow-md cursor-default border-transparent hover:border-[#6C5CE7]/20">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-5 ${feature.bg}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-[#1B1D35] mb-2">{feature.title}</h3>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
