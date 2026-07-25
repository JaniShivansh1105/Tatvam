"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { Check, X } from "lucide-react";

const COMPARISON = [
  { feature: "Goal", tatvam: "Understanding & Mastery", traditional: "Rote Memorization", chatbot: "Answers without context" },
  { feature: "Learning Path", tatvam: "Dynamically Adaptive", traditional: "Static & Linear", chatbot: "None" },
  { feature: "Weakness Detection", tatvam: "Real-time AI Analysis", traditional: "Post-Exam Discovery", chatbot: "None" },
  { feature: "Retention Strategy", tatvam: "Spaced Repetition", traditional: "Cramming", chatbot: "None" },
  { feature: "Language", tatvam: "Seamless Vernacular", traditional: "Rigid English Only", chatbot: "Basic Translation" },
];

export function Comparison() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#F8F9FF]">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center"
        >
          <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] text-center mb-16">
            Why Tatvam is Different
          </motion.h2>

          <div className="w-full max-w-5xl overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-4 border-b border-[#E2E8F0] text-[16px] font-bold text-[#1B1D35] w-[25%]">Feature</th>
                  <th className="p-4 border-b border-[#E2E8F0] text-[18px] font-bold text-[#6C5CE7] w-[25%] bg-[#F0E6FF]/50 rounded-tl-[16px] rounded-tr-[16px]">Tatvam</th>
                  <th className="p-4 border-b border-[#E2E8F0] text-[16px] font-bold text-[#A0AEC0] w-[25%]">Traditional LMS</th>
                  <th className="p-4 border-b border-[#E2E8F0] text-[16px] font-bold text-[#A0AEC0] w-[25%]">Generic Chatbots</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <motion.tr key={idx} variants={marketingAnimations.fadeUp} className="group hover:bg-white/50 transition-colors">
                    <td className="p-4 border-b border-[#E2E8F0] text-[14px] font-semibold text-[#4A5568]">{row.feature}</td>
                    <td className="p-4 border-b border-[#E2E8F0] text-[14px] font-bold text-[#1B1D35] bg-[#F0E6FF]/50">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#6C5CE7]" />
                        {row.tatvam}
                      </div>
                    </td>
                    <td className="p-4 border-b border-[#E2E8F0] text-[14px] text-[#718096]">
                      <div className="flex items-center gap-2 opacity-70">
                        <X className="w-4 h-4 text-[#FC8181]" />
                        {row.traditional}
                      </div>
                    </td>
                    <td className="p-4 border-b border-[#E2E8F0] text-[14px] text-[#718096]">
                      <div className="flex items-center gap-2 opacity-70">
                        <X className="w-4 h-4 text-[#FC8181]" />
                        {row.chatbot}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
