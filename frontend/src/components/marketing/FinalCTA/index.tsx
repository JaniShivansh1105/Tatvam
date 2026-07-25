"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { MarketingContainer } from "../shared/MarketingContainer";

export function FinalCTA() {
  return (
    <section className="py-32 relative bg-[#1B1D35] overflow-hidden text-center flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6C5CE7] opacity-20 rounded-full blur-[150px] pointer-events-none" />
      
      <MarketingContainer className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-[40px] md:text-[56px] lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.05] mb-6">
            Ready to stop memorizing?
          </h2>
          <p className="text-[18px] md:text-[22px] text-[#A0AEC0] mb-12 max-w-2xl mx-auto">
            Join the new era of personalized education. Start understanding the world today.
          </p>
          <Link href={ROUTES.REGISTER} className="h-16 px-10 rounded-full bg-white text-[#1B1D35] flex items-center justify-center gap-3 font-bold text-[18px] hover:bg-[#F8F9FF] transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] group mx-auto w-fit">
            Get Started for Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform text-[#6C5CE7]" />
          </Link>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
