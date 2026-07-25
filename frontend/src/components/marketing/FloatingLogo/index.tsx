"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function FloatingLogo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show logo after scrolling past the main hero/navbar area
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-6 left-6 z-[60] hidden md:flex items-center justify-center w-12 h-12 rounded-[14px] bg-white/70 backdrop-blur-md border border-[rgba(108,92,231,0.15)] shadow-[0_8px_30px_rgba(108,92,231,0.15)] outline-none group"
        >
          <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-[#6C5CE7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative w-7 h-7 flex items-center justify-center">
            <Image 
              src="/logos/tatvam-logo.png" 
              alt="Tatvam" 
              fill 
              sizes="28px"
              className="object-contain filter brightness-0" 
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
