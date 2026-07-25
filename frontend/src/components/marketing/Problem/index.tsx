"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { GlassCard } from "@/components/ui/GlassCard";

export function Problem() {
  return (
    <section className="py-24 relative overflow-hidden">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] text-center mb-4">
            The Broken Cycle of Education
          </motion.h2>
          <motion.p variants={marketingAnimations.fadeUp} className="text-[16px] md:text-[18px] text-[#6B7280] text-center max-w-2xl mb-16">
            Traditional learning forces you to memorize without understanding. You study for the exam, not for yourself. It&apos;s time to break the cycle.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            {/* Traditional Card */}
            <motion.div variants={marketingAnimations.fadeUp}>
              <GlassCard className="p-8 h-full bg-white/40 border-[rgba(252,129,129,0.2)] flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#FC8181] flex items-center justify-center mb-6">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-bold text-[#1B1D35] mb-8">Traditional Method</h3>
                
                <div className="flex flex-col items-center gap-3 w-full opacity-80">
                  <div className="w-full py-3 rounded-[12px] bg-white border border-[#E2E8F0] text-[14px] font-semibold text-[#4A5568]">Memorize</div>
                  <ArrowRight className="w-4 h-4 text-[#A0AEC0] rotate-90" />
                  <div className="w-full py-3 rounded-[12px] bg-white border border-[#E2E8F0] text-[14px] font-semibold text-[#4A5568]">Exam</div>
                  <ArrowRight className="w-4 h-4 text-[#A0AEC0] rotate-90" />
                  <div className="w-full py-3 rounded-[12px] bg-[#FFF5F5] border border-[#FC8181]/30 text-[14px] font-semibold text-[#FC8181]">Forget Everything</div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Tatvam Card */}
            <motion.div variants={marketingAnimations.fadeUp}>
              <GlassCard className="p-8 h-full bg-white border-[rgba(108,92,231,0.2)] shadow-[0_8px_30px_-12px_rgba(108,92,231,0.15)] flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6]" />
                <div className="w-12 h-12 rounded-full bg-[#F0E6FF] text-[#6C5CE7] flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-bold text-[#1B1D35] mb-8">The Maverick Approach</h3>
                
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="w-full py-3 rounded-[12px] bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white text-[14px] font-semibold shadow-sm">Understand</div>
                  <ArrowRight className="w-4 h-4 text-[#6C5CE7] rotate-90" />
                  <div className="w-full py-3 rounded-[12px] bg-white border border-[#E2E8F0] text-[14px] font-semibold text-[#1B1D35] shadow-sm">Practice & Analyze</div>
                  <ArrowRight className="w-4 h-4 text-[#6C5CE7] rotate-90" />
                  <div className="w-full py-3 rounded-[12px] bg-[#F0E6FF] border border-[#6C5CE7]/30 text-[14px] font-bold text-[#6C5CE7] shadow-sm">Permanent Mastery</div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
