"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";
import { KnowledgeNetwork } from "./KnowledgeNetwork";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <MarketingContainer className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-120px)]">
          
          {/* Left Text Content */}
          <motion.div
            variants={marketingAnimations.staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 max-w-2xl"
          >


            <motion.h1 variants={marketingAnimations.fadeUp} className="text-[48px] md:text-[64px] lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-[#1B1D35]">
              Learn the way your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#FC8181]">
                brain actually works.
              </span>
            </motion.h1>

            <motion.p variants={marketingAnimations.fadeUp} className="text-[18px] md:text-[20px] text-[#6B7280] leading-relaxed font-medium">
              Tatvam isn&apos;t just another platform. It&apos;s an intelligent engine that detects your exact knowledge gaps in real-time, adapting exclusively to you so you can finally stop memorizing and start understanding.
            </motion.p>

            {/* Value Props */}
            <motion.div variants={marketingAnimations.fadeUp} className="flex flex-wrap gap-4 pt-2">
              {[
                "Adaptive Learning Paths",
                "Vernacular Explanations",
                "Real-time Gap Detection",
              ].map((prop) => (
                <div key={prop} className="flex items-center gap-2 text-[14px] font-medium text-[#1B1D35]">
                  <CheckCircle2 className="w-4 h-4 text-[#48BB78]" />
                  {prop}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={marketingAnimations.fadeUp} className="flex flex-col sm:flex-row items-center gap-4 pt-6">
              <Link href={ROUTES.REGISTER} className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#1B1D35] text-white flex items-center justify-center gap-2 font-semibold text-[16px] hover:bg-[#6C5CE7] transition-all shadow-glowButton hover:shadow-[0_8px_30px_-6px_rgba(108,92,231,0.6)] group">
                Start Understanding
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#dashboard-preview" className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-[#1B1D35] flex items-center justify-center font-semibold text-[16px] hover:bg-[#F8F9FF] border border-[rgba(108,92,231,0.1)] transition-all">
                See How It Works
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual Content */}
          <div className="relative h-full flex items-center justify-center lg:justify-end">
            <KnowledgeNetwork />
          </div>

        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#A0AEC0]"
        >
          <span className="text-[12px] font-medium tracking-widest uppercase">Scroll to explore</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
