"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { GlassCard } from "@/components/ui/GlassCard";

const TESTIMONIALS = [
  { quote: "For the first time, I actually understand Calculus instead of just memorizing the formulas.", author: "Arjun K.", role: "Engineering Student" },
  { quote: "The AI Mentor feels like having a personal tutor who knows exactly where you are stuck.", author: "Priya S.", role: "High School Student" },
  { quote: "My retention has skyrocketed. The spaced repetition is incredibly well-timed.", author: "Rahul M.", role: "Self-Taught Developer" }
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#F8F9FF]">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] mb-4">
            Learner Stories
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div key={idx} variants={marketingAnimations.fadeUp}>
              <GlassCard className="p-6 h-full bg-white flex flex-col border-[rgba(108,92,231,0.1)]">
                <p className="text-[15px] text-[#4A5568] leading-relaxed mb-6 italic">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-auto">
                  <h4 className="text-[14px] font-bold text-[#1B1D35]">{testimonial.author}</h4>
                  <p className="text-[12px] text-[#A0AEC0]">{testimonial.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </MarketingContainer>
    </section>
  );
}
