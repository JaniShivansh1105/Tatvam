"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { ChevronDown } from "lucide-react";
import { marketingAnimations } from "../shared/animations";

const FAQS = [
  { q: "How is Tatvam different from ChatGPT?", a: "Tatvam isn't a chatbot. It's a structured learning engine. Instead of just giving you answers, Tatvam builds a personalized roadmap, tracks your weaknesses, and uses spaced repetition to ensure you actually learn the material." },
  { q: "Is it suitable for school students?", a: "Yes. Tatvam adapts to any learning level. Whether you're in high school or college, the AI adjusts its explanations and difficulty to perfectly match your current understanding." },
  { q: "What does 'Vernacular Explanations' mean?", a: "If you're struggling with a complex English explanation, Tatvam can instantly translate the concept into your native language (like Hindi) while retaining the technical context, making it much easier to grasp." },
  { q: "Is the platform free?", a: "Tatvam offers a generous free tier for all essential features. Premium plans are available for unlimited AI Mentor interactions and advanced analytics." }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative bg-white">
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto"
        >
          <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] text-center mb-12">
            Frequently Asked Questions
          </motion.h2>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <motion.div key={idx} variants={marketingAnimations.fadeUp} className="border border-[#E2E8F0] rounded-[16px] overflow-hidden bg-white">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-[16px] font-bold text-[#1B1D35] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#A0AEC0] transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-[15px] text-[#6B7280] leading-relaxed"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
