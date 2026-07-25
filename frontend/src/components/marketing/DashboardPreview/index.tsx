"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MarketingContainer } from "../shared/MarketingContainer";
import { marketingAnimations } from "../shared/animations";

// Import exact dashboard components
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RoadmapPreview } from "@/components/dashboard/RoadmapPreview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DASHBOARD_CONSTANTS } from "@/components/dashboard/constants";

const mockDashboardData: any = {
  user: { name: "Shivansh", streak: 12, points: 2450 },
  continueLearning: {
    id: "newtons-laws",
    title: "Newton's Laws of Motion",
    topic: "Physics",
    progress: 45,
    estimatedMinutes: 20
  },
  stats: { conceptsMastered: 42, learningHours: 24.5, currentStreak: 12 },
  goal: { title: "Complete Mechanics Module", progress: 80, total: 100, daysLeft: 5 },
  aiInsight: { message: "You're learning 20% faster than average!", type: "insight" },
  roadmap: [],
  quickActions: [],
  recentActivity: []
};

export function MarketingDashboardPreview() {
  const data = mockDashboardData;
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section id="dashboard-preview" className="py-32 relative overflow-hidden bg-white" ref={containerRef}>
      <MarketingContainer>
        <motion.div
          variants={marketingAnimations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <motion.h2 variants={marketingAnimations.fadeUp} className="text-[32px] md:text-[40px] font-extrabold tracking-tight text-[#1B1D35] mb-4">
            See the Engine in Action
          </motion.h2>
          <motion.p variants={marketingAnimations.fadeUp} className="text-[16px] md:text-[18px] text-[#6B7280] max-w-2xl">
            This isn&apos;t a mockup. This is the exact personalized dashboard you will see when you log in. Clean, focused, and incredibly powerful.
          </motion.p>
        </motion.div>

        {/* Dashboard Wrapper with Parallax & Browser Frame */}
        <motion.div 
          style={{ scale, y }}
          className="w-full max-w-[1200px] mx-auto rounded-[16px] overflow-hidden border border-[#E2E8F0] shadow-[0_30px_100px_-20px_rgba(108,92,231,0.25)] bg-[#F8F9FF] relative"
        >
          {/* Ambient Glow Behind Frame */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#6C5CE7] opacity-20 blur-[100px] pointer-events-none" />

          {/* Premium Browser Header */}
          <div className="h-12 bg-[#F8F9FF] border-b border-[#E2E8F0] flex items-center px-4 relative z-10">
            <div className="flex gap-2 w-20">
              <div className="w-3 h-3 rounded-full bg-[#FC8181]" />
              <div className="w-3 h-3 rounded-full bg-[#F6E05E]" />
              <div className="w-3 h-3 rounded-full bg-[#48BB78]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-6 py-1 bg-white border border-[#E2E8F0] rounded-md text-[11px] font-medium text-[#A0AEC0] shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#48BB78] animate-pulse" />
                app.tatvam.ai
              </div>
            </div>
            <div className="w-20" /> {/* Spacer for flex centering */}
          </div>

          <div className="p-4 md:p-8 max-h-[800px] overflow-y-auto relative bg-white">
            {/* Floating Callouts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-[20%] left-[5%] z-20 bg-white px-4 py-2 rounded-xl shadow-lg border border-[rgba(108,92,231,0.2)] text-[12px] font-bold text-[#6C5CE7] flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-pulse" />
              Real-time Weakness Detection
            </motion.div>


            {/* We reuse the actual Dashboard architecture here! */}
            {/* We intercept clicks to prevent redirection since this is just a preview */}
            <div onClickCapture={(e) => e.preventDefault()}>
              <DashboardShell>
                <div className={`${DASHBOARD_CONSTANTS.layout.leftColSpan} flex flex-col gap-5`}>
                  <WelcomeHero />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ContinueLearningCard data={data.continueLearning} />
                    <AIInsightCard data={data.aiInsight} />
                  </div>
                  <StatsGrid data={data.stats} streak={data.user.streak} />
                  <RoadmapPreview data={data.roadmap} />
                </div>
                
                <div className={`${DASHBOARD_CONSTANTS.layout.rightColSpan} flex flex-col gap-5`}>
                  <GoalCard data={data.goal} />
                  <QuickActions data={data.quickActions} />
                  <RecentActivity data={data.recentActivity} />
                </div>
              </DashboardShell>
            </div>
          </div>
          
          
          {/* Fade out bottom overlay to indicate it's a preview */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </motion.div>
      </MarketingContainer>
    </section>
  );
}
