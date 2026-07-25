"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";

const STEPS = [
  {
    title: "Student Attempts a Question",
    desc: "Tatvam presents a challenging problem. The student selects an incorrect option based on a common misconception.",
    icon: "🤔"
  },
  {
    title: "AI Detects Conceptual Weakness",
    desc: "The engine doesn't just mark it wrong. It analyzes the specific error pattern to identify exactly which sub-concept is misunderstood.",
    icon: "🧠"
  },
  {
    title: "Knowledge Graph Updates",
    desc: "Behind the scenes, the probabilistic map of the student's brain updates in real-time, highlighting the newly discovered gap.",
    icon: "📊"
  },
  {
    title: "Learning Roadmap Changes",
    desc: "The upcoming lessons are instantly re-routed. The next module now focuses entirely on repairing that specific foundation.",
    icon: "🛤️"
  },
  {
    title: "Practice Becomes Personalized",
    desc: "Tatvam generates hyper-targeted questions and interactive visualizations directly addressing the weakness.",
    icon: "🎯"
  },
  {
    title: "Concept Mastered",
    desc: "The student successfully demonstrates understanding. The gap is closed, and the roadmap progresses forward.",
    icon: "🏆"
  }
];

export function AdaptiveIntelligence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const activeIndexRaw = useTransform(scrollYProgress, [0, 1], [0, STEPS.length - 0.1]);

  return (
    <section className="pt-12 pb-12 relative bg-[#F8F9FF] overflow-hidden" ref={containerRef}>
      <MarketingContainer>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 min-h-[800px]">
          
          {/* Left: Sticky Visualizer */}
          <div className="relative h-full hidden lg:block">
            <div className="sticky top-1/4 h-[500px] bg-white rounded-[32px] border border-[rgba(108,92,231,0.1)] shadow-[0_20px_60px_-15px_rgba(108,92,231,0.15)] overflow-hidden flex flex-col items-center p-8 relative">
              
              {/* Continuous Mastery Indicator (Background) */}
              <div className="absolute top-[20%] w-full flex justify-center">
                <ConfidenceRing activeIndexRaw={activeIndexRaw} />
              </div>

              {/* Dynamic state visualization text overlay */}
              {STEPS.map((step, idx) => (
                <StepVisualizer key={idx} step={step} idx={idx} activeIndexRaw={activeIndexRaw} />
              ))}

            </div>
          </div>

          {/* Right: Scrollable Text Content */}
          <div className="flex flex-col justify-center pt-12 pb-24">
            <div className="mb-16">
              <span className="text-[#6C5CE7] font-bold text-[14px] tracking-wider uppercase mb-2 block">Adaptive Intelligence</span>
              <h2 className="text-[40px] font-extrabold tracking-tight text-[#1B1D35] leading-[1.1]">
                A learning engine that thinks exactly like you do.
              </h2>
            </div>

            <div className="flex flex-col gap-12 lg:gap-32 pb-12">
              {STEPS.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Progress Line */}
                  {idx !== STEPS.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-[-48px] lg:bottom-[-128px] w-[2px] bg-[rgba(108,92,231,0.1)]" />
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0.3, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-6"
                  >
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center font-bold text-[#1B1D35] shrink-0 z-10">
                      {idx + 1}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-[20px] font-bold text-[#1B1D35] mb-2">{step.title}</h3>
                      <p className="text-[15px] text-[#6B7280] leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </MarketingContainer>
    </section>
  );
}

// Extracted Sub-Components to respect React Hook rules

interface Step {
  title: string;
  desc: string;
  icon: string | React.ReactNode;
}

function StepVisualizer({ step, idx, activeIndexRaw }: { step: Step; idx: number; activeIndexRaw: MotionValue<number> }) {
  const opacity = useTransform(activeIndexRaw, [idx - 0.5, idx, idx + 0.5], [0, 1, 0]);
  const scale = useTransform(activeIndexRaw, [idx - 0.5, idx, idx + 0.5], [0.9, 1, 1.1]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center pt-[20%] text-center px-12"
      style={{ opacity, scale, pointerEvents: "none" }}
    >
      <div className="w-24 h-24 rounded-full bg-[#F0E6FF] flex items-center justify-center text-4xl shadow-[inset_0_2px_10px_rgba(108,92,231,0.1)]">
        {step.icon}
      </div>
      <div className="mt-[25%] flex flex-col items-center">
        <h3 className="text-[28px] font-extrabold text-[#1B1D35] mb-4">{step.title}</h3>
        <p className="text-[16px] text-[#6B7280] leading-relaxed max-w-sm">{step.desc}</p>
      </div>
    </motion.div>
  );
}

function ConfidenceRing({ activeIndexRaw }: { activeIndexRaw: MotionValue<number> }) {
  // Map progress from 10% to 100%
  const progress = useTransform(activeIndexRaw, [0, 5], [10, 100]);
  const strokeDashoffset = useTransform(progress, (v) => 283 - (283 * v) / 100);

  // Color mapping: Red -> Yellow -> Green
  const strokeColor = useTransform(activeIndexRaw, [0, 2.5, 5], ["#FC8181", "#F6E05E", "#48BB78"]);
  
  // Pulse animation mapping: Faster when struggling, calm when mastered
  const scale = useTransform(activeIndexRaw, [0, 2.5, 5], [1.02, 1.05, 1]);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center pointer-events-none">
      {/* Background Track */}
      <svg className="absolute w-32 h-32" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#F0F4F8" strokeWidth="6" />
      </svg>
      
      {/* Animated Growth Ring */}
      <motion.svg className="absolute w-32 h-32" viewBox="0 0 100 100" style={{ scale }}>
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="283"
          style={{ strokeDashoffset }}
          className="rotate-[-90deg] origin-center transition-colors duration-700"
        />
      </motion.svg>
      
      {/* Outer ambient glow */}
      <motion.div 
        className="absolute inset-[-20%] rounded-full blur-[20px] opacity-20 -z-10"
        style={{ backgroundColor: strokeColor }}
      />
    </div>
  );
}
