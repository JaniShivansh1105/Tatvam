"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { DASHBOARD_CONSTANTS } from "./constants";
import Link from "next/link";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

interface ContinueLearningProps {
  data: {
    id: string;
    slug: string;
    title: string;
    topic: string;
    progress: number;
    estimatedMinutes: number;
  } | null;
}

export function ContinueLearningCard({ data }: ContinueLearningProps) {
  if (!data) {
    return (
      <motion.div variants={itemVariants}>
        <GlassCard className="p-6 flex flex-col h-full bg-gradient-to-br from-white/90 to-white/60 items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F0E6FF] text-[#6C5CE7] flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1B1D35] mb-2">You're caught up!</h2>
          <p className="text-[14px] text-[#6B7280]">Check back later for more lessons.</p>
        </GlassCard>
      </motion.div>
    );
  }

  const { topic: subject, title: lesson, progress, estimatedMinutes: remainingTime } = data;

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6 flex flex-col h-full bg-gradient-to-br from-white/90 to-white/60 hover:shadow-[0_8px_30px_-10px_rgba(108,92,231,0.15)] transition-all duration-300">
        
        <div className="flex flex-col mb-6">
          <span className="text-[12px] font-bold tracking-wider uppercase text-[#A0AEC0] mb-2">
            Current Lesson
          </span>
          <h2 className="text-[22px] md:text-[24px] font-bold text-[#1B1D35] leading-tight mb-2 line-clamp-2">
            {lesson}
          </h2>
          <span className="inline-block px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase bg-[#F0E6FF] text-[#6C5CE7] self-start">
            {subject}
          </span>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[13px] font-medium text-[#6B7280]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#F8F9FF] rounded-full overflow-hidden shadow-innerInput border border-[rgba(108,92,231,0.05)]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="h-full bg-gradient-to-r from-[#8B7CF6] to-[#6C5CE7] rounded-full"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 text-[#A0AEC0] text-[13px] font-medium">
              <Clock className="w-4 h-4" />
              <span>~{remainingTime} mins left</span>
            </div>
            
            <Link href={`/dashboard/learn/${data.slug}`} className="group flex items-center gap-2 bg-[#1B1D35] hover:bg-[#6C5CE7] text-white px-5 py-2.5 rounded-[16px] text-[14px] font-semibold transition-colors duration-300 shadow-glowButton">
              Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </GlassCard>
    </motion.div>
  );
}
