"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Activity, Map, Sparkles, BookOpen } from "lucide-react";

export function NoActivity() {
  return (
    <GlassCard className="p-6 h-full flex flex-col items-center justify-center text-center bg-white/70">
      <div className="w-12 h-12 rounded-full bg-[#F8F9FF] border border-[#E2E8F0] flex items-center justify-center text-[#A0AEC0] mb-4">
        <Activity className="w-5 h-5" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#1B1D35] mb-1">No Recent Activity</h3>
      <p className="text-[13px] text-[#6B7280]">Your learning actions will appear here once you start studying.</p>
    </GlassCard>
  );
}

export function NoRoadmap() {
  return (
    <GlassCard className="p-6 h-full flex flex-col items-center justify-center text-center bg-white/70 min-h-[160px]">
      <div className="w-12 h-12 rounded-full bg-[#EBF8FF] text-[#3182CE] flex items-center justify-center mb-4">
        <Map className="w-5 h-5" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#1B1D35] mb-1">Roadmap Locked</h3>
      <p className="text-[13px] text-[#6B7280]">Complete your first assessment to unlock your personalized learning path.</p>
    </GlassCard>
  );
}

export function NoInsight() {
  return (
    <GlassCard className="p-6 h-full flex flex-col items-center justify-center text-center bg-white/70 min-h-[220px]">
      <div className="w-12 h-12 rounded-full bg-[#FFF5F5] text-[#FC8181] flex items-center justify-center mb-4">
        <Sparkles className="w-5 h-5" />
      </div>
      <h3 className="text-[15px] font-semibold text-[#1B1D35] mb-1">Gathering Insights</h3>
      <p className="text-[13px] text-[#6B7280]">AI needs a few more practice sessions to analyze your learning patterns.</p>
    </GlassCard>
  );
}

export function NoActiveLesson() {
  return (
    <GlassCard className="p-8 h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-white/90 to-white/60 min-h-[220px]">
      <div className="w-14 h-14 rounded-full bg-[#F0E6FF] text-[#6C5CE7] flex items-center justify-center mb-4 shadow-sm">
        <BookOpen className="w-6 h-6" />
      </div>
      <h3 className="text-[18px] font-semibold text-[#1B1D35] mb-2">Ready to begin?</h3>
      <p className="text-[14px] text-[#6B7280] max-w-[250px] mx-auto mb-6">
        Select a subject to start building your understanding.
      </p>
      <button className="bg-[#1B1D35] hover:bg-[#6C5CE7] text-white px-6 py-2.5 rounded-[16px] text-[14px] font-semibold transition-colors duration-300 shadow-glowButton">
        Browse Subjects
      </button>
    </GlassCard>
  );
}
