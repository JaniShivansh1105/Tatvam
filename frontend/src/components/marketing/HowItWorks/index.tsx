"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";

const STEPS = [
  {
    number: "01",
    title: "Choose Your Goal",
    description: "Tell Tatvam what you're trying to achieve—whether it's mastering Python, preparing for JEE, or improving calculus. We set the baseline.",
  },
  {
    number: "02",
    title: "Learn Concepts",
    description: "Engage with bite-sized, highly visual explanations. If you're confused, ask the AI Mentor to explain it to you like you're five.",
  },
  {
    number: "03",
    title: "AI Detects Weaknesses",
    description: "As you practice, the engine silently analyzes every answer, keystroke, and hesitation to build a probabilistic map of your knowledge.",
  },
  {
    number: "04",
    title: "Personalized Practice",
    description: "You'll never see generic quizzes. Every question is dynamically generated to specifically target the exact sub-topics you are struggling with.",
  },
  {
    number: "05",
    title: "Master the Topic",
    description: "Through adaptive spaced repetition, Tatvam ensures that once you understand a concept, you never forget it.",
  }
];

export function HowItWorks() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-32 relative bg-[#1B1D35] text-white overflow-hidden" ref={containerRef}>
      {/* Dark background radial */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#6C5CE7] opacity-10 rounded-full blur-[150px] pointer-events-none" />
      
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-24 relative z-10"
        >
          <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight mb-4">How Tatvam Works</h2>
          <p className="text-[#A0AEC0] text-[16px] md:text-[18px] max-w-2xl mx-auto">
            A frictionless learning loop designed to take you from absolute beginner to permanent mastery.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto z-10">
          {/* Animated Scroll Line */}
          <div className="absolute top-0 bottom-0 left-[28px] md:left-1/2 md:-translate-x-1/2 w-[2px] bg-white/10 hidden md:block">
            <motion.div 
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#6C5CE7] to-[#8B7CF6] shadow-[0_0_15px_rgba(108,92,231,0.5)]"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-24">
            {STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex items-center md:justify-between ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-8 md:gap-0`}>
                  
                  {/* Content Box */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`w-full md:w-[45%] ${isEven ? 'md:text-right' : 'md:text-left'} pl-16 md:pl-0`}
                  >
                    <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[24px] backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <span className="text-[#6C5CE7] font-bold text-[14px] tracking-wider mb-2 block">STEP {step.number}</span>
                      <h3 className="text-[20px] font-bold mb-3">{step.title}</h3>
                      <p className="text-[#A0AEC0] text-[14px] leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>

                  {/* Center Node */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full bg-[#1B1D35] border-4 border-[#2D3748] flex items-center justify-center z-10 shadow-lg">
                    <span className="text-[14px] font-bold text-[#A0AEC0]">{step.number}</span>
                  </div>

                  {/* Spacer for flex alignment */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </MarketingContainer>
    </section>
  );
}
