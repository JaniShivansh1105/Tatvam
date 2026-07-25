"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";

const JOURNEY_STEPS = [
  { title: "Understand", desc: "Build a conceptual foundation." },
  { title: "Practice", desc: "Apply knowledge instantly." },
  { title: "Analyze", desc: "AI maps your weaknesses." },
  { title: "Improve", desc: "Targeted revision." },
  { title: "Master", desc: "Permanent retention." }
];

export function Journey() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-24 relative overflow-hidden bg-white" ref={containerRef}>
      <MarketingContainer>
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] mb-4">
            The Learning Journey
          </h2>
          <p className="text-[#6B7280] text-[16px] md:text-[18px]">
            A proven path to absolute mastery.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center hidden md:flex">
          <svg className="absolute w-full h-24 top-1/2 -translate-y-1/2 overflow-visible" viewBox="0 0 800 100">
            <path 
              d="M 50 50 Q 200 0, 400 50 T 750 50" 
              fill="none" 
              stroke="#E2E8F0" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            <motion.path 
              d="M 50 50 Q 200 0, 400 50 T 750 50" 
              fill="none" 
              stroke="url(#journeyGradient)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#FC8181" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute w-full flex justify-between px-[30px] top-1/2 -translate-y-1/2">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center relative -mt-[140px] w-32">
                <div className="w-4 h-4 rounded-full bg-white border-4 border-[#1B1D35] shadow-sm z-10 absolute top-[140px] -translate-y-1/2" />
                <div className="bg-white border border-[#E2E8F0] shadow-sm rounded-[12px] p-3 text-center mb-4 relative z-20 hover:border-[#6C5CE7]/30 transition-colors">
                  <h4 className="text-[14px] font-bold text-[#1B1D35]">{step.title}</h4>
                  <p className="text-[11px] text-[#718096] mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Fallback */}
        <div className="flex flex-col gap-6 md:hidden max-w-sm mx-auto">
          {JOURNEY_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-4 bg-white border border-[#E2E8F0] p-4 rounded-[12px]">
              <div className="w-8 h-8 rounded-full bg-[#F0E6FF] text-[#6C5CE7] flex items-center justify-center font-bold text-[12px]">
                {i + 1}
              </div>
              <div>
                <h4 className="text-[15px] font-bold text-[#1B1D35]">{step.title}</h4>
                <p className="text-[13px] text-[#718096]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
