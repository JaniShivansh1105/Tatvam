"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";

export function Philosophy() {
  return (
    <section className="py-32 relative bg-white">
      <MarketingContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex items-center justify-center text-center"
        >
          <h2 className="text-[40px] md:text-[60px] lg:text-[72px] font-extrabold tracking-tight text-[#1B1D35] leading-[1.1] max-w-4xl mx-auto">
            Learning isn&apos;t about <span className="text-[#A0AEC0]">remembering more.</span><br/>
            It&apos;s about <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6]">understanding deeper.</span>
          </h2>
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
