"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles } from "lucide-react";

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <GlassCard className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E5E1FF] to-[#F8F9FF] flex items-center justify-center mb-6 shadow-sm border border-white">
        <Sparkles className="w-8 h-8 text-[#6C5CE7]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[20px] font-semibold text-[#1B1D35] mb-2">{title}</h3>
      <p className="text-[15px] text-[#6B7280] max-w-[300px]">
        {description || "We're currently building this feature. Check back soon!"}
      </p>
      
      <div className="mt-8">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase bg-[#F0E6FF] text-[#6C5CE7]">
          Coming Soon
        </span>
      </div>
    </GlassCard>
  );
}
