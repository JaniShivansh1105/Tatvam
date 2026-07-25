"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useEngineStore } from "@/store/engine-store";

interface ConceptSectionProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
}

export function ConceptSection({ id, title, children }: ConceptSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setVisibleSection } = useEngineStore();

  useEffect(() => {
    if (!id) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibleSection(id, entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [id, setVisibleSection]);

  return (
    <motion.section 
      id={id ? `section-${id}` : undefined}
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16 flex flex-col gap-6 scroll-mt-24"
    >
      {title && (
        <h2 className="text-[24px] font-bold text-[#1B1D35] mb-2 tracking-tight">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-6 text-[17px] text-[#4A5568] leading-[1.8]">
        {children}
      </div>
    </motion.section>
  );
}
