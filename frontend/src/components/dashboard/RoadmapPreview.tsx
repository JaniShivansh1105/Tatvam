"use client";

import { motion, Variants } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Check, Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_CONSTANTS } from "./constants";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: DASHBOARD_CONSTANTS.animations.spring }
};

interface RoadmapNode {
  id: string;
  label: string;
  status: "completed" | "current" | "locked";
  progress?: number;
}

interface RoadmapPreviewProps {
  data: RoadmapNode[];
}

export function RoadmapPreview({ data }: RoadmapPreviewProps) {
  // Find current node index for the progress line
  const currentIndex = data.findIndex(n => n.status === "current");
  const progressPercentage = currentIndex === -1 ? 0 : (currentIndex / (data.length - 1)) * 100;

  return (
    <motion.div variants={itemVariants}>
      <GlassCard className="p-6 bg-white/70 overflow-hidden relative">
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-[16px] font-semibold text-[#1B1D35]">Learning Roadmap</h3>
          <button className="text-[13px] font-medium text-[#6C5CE7] hover:text-[#5A4CD1] transition-colors flex items-center">
            View full path <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="relative z-10 flex items-center justify-between px-2">
          {/* Connecting Line Background */}
          <div className="absolute top-5 left-[5%] right-[5%] h-[3px] bg-[#F0E6FF] -translate-y-1/2 z-0 rounded-full" />
          
          {/* Animated Connecting Line Progress */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
            className="absolute top-5 left-[5%] h-[3px] bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] -translate-y-1/2 z-0 rounded-full shadow-[0_0_10px_rgba(108,92,231,0.5)]" 
          />

          {data.map((node) => (
            <div key={node.id} className="relative z-10 flex flex-col items-center gap-2 group">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white border-4 border-white transition-all duration-300 shadow-sm relative",
                node.status === "completed" && "bg-[#6C5CE7] hover:scale-110",
                node.status === "current" && "bg-[#6C5CE7] shadow-[0_0_20px_rgba(108,92,231,0.6)] scale-110",
                node.status === "locked" && "bg-[#E2E8F0] text-[#A0AEC0]"
              )}>
                
                {/* Current Stage Glow Animation */}
                {node.status === "current" && (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-[#6C5CE7] -z-10"
                  />
                )}

                {node.status === "completed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </motion.div>
                )}
                {node.status === "current" && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                {node.status === "locked" && <Lock className="w-4 h-4" />}
              </div>
              
              <div className="flex flex-col items-center mt-1">
                <span className={cn(
                  "text-[12px] font-bold tracking-wide uppercase transition-colors",
                  (node.status === "completed" || node.status === "current") ? "text-[#1B1D35]" : "text-[#A0AEC0]"
                )}>
                  {node.label}
                </span>
                
                {/* Tiny Percentage for Current Stage */}
                {node.status === "current" && typeof node.progress !== "undefined" && (
                  <span className="text-[10px] font-semibold text-[#6C5CE7] mt-0.5 bg-[#F0E6FF] px-1.5 py-0.5 rounded-sm">
                    {node.progress}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </GlassCard>
    </motion.div>
  );
}
