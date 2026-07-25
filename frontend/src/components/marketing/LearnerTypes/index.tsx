"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { GlassCard } from "@/components/ui/GlassCard";

const LEARNERS = [
  { type: "School Students", desc: "Build an unbreakable foundation for exams." },
  { type: "College Students", desc: "Master complex engineering and science concepts." },
  { type: "Competitive Exams", desc: "JEE, NEET, and UPSC level adaptive practice." },
  { type: "Self Learners", desc: "Learn to code or understand history at your own pace." },
  { type: "Professionals", desc: "Upskill rapidly without wasting time on basics." }
];

export function LearnerTypes() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-16">
            <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] mb-4">
              Built For Every Learner
            </motion.h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {LEARNERS.map((learner, idx) => (
              <motion.div key={idx} variants={marketingAnimations.fadeUp} className="w-full sm:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-auto flex-grow max-w-sm">
                <GlassCard className="p-6 h-full bg-[#F8F9FF] border-[rgba(108,92,231,0.08)] hover:border-[#6C5CE7]/30 transition-colors text-center cursor-default">
                  <h3 className="text-[18px] font-bold text-[#1B1D35] mb-2">{learner.type}</h3>
                  <p className="text-[14px] text-[#6B7280]">{learner.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
