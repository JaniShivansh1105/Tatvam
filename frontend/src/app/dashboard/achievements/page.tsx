"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Trophy, Star, Zap, Flame, Award, Shield, CheckCircle2, Loader2, Target, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
};

export default function AchievementsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await apiClient.get("/content/achievements");
      return res.data.data;
    },
  });

  if (isLoading || !data) {
    return (
      <PageContainer>
        <ContentArea>
          <DashboardShell>
            <div className="col-span-full min-h-[600px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
            </div>
          </DashboardShell>
        </ContentArea>
      </PageContainer>
    );
  }

  const { xp, level, currentLevelXp, nextLevelXp, badges } = data;
  const progressPercent = Math.min((currentLevelXp / nextLevelXp) * 100, 100);

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className="col-span-full xl:col-span-8 flex flex-col gap-6">
            <div>
              <h1 className="text-[28px] font-bold text-[#1B1D35] tracking-tight">Achievements</h1>
              <p className="text-[15px] text-[#A0AEC0] mt-1">Track your learning milestones and unlock badges as you progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge: any, idx: number) => (
                <motion.div 
                  key={badge.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className={`bg-white rounded-3xl border p-5 flex items-center gap-5 transition-all duration-300 relative overflow-hidden ${
                    badge.earned 
                      ? 'border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#6C5CE7]/30' 
                      : 'border-[#F1F5F9] opacity-60 grayscale'
                  }`}
                >
                  {badge.earned && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#6C5CE7]/10 to-transparent rounded-bl-full pointer-events-none" />
                  )}
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                    {iconMap[badge.icon] || <Award className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1B1D35] text-[16px]">{badge.title}</h3>
                    <p className="text-[#A0AEC0] text-[13px] mt-1 leading-relaxed">{badge.description}</p>
                    {badge.earned ? (
                      <div className="mt-2 text-[#48BB78] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[#48BB78]" /> Unlocked
                      </div>
                    ) : (
                      <div className="mt-2 text-[#A0AEC0] text-[11px] font-bold uppercase tracking-wider">
                        Locked
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="col-span-full xl:col-span-4 flex flex-col gap-5 pt-0 xl:pt-[84px]">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-3xl text-[#1B1D35] shadow-sm border border-[#E2E8F0] relative overflow-hidden"
             >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#F8F9FF] rounded-2xl flex items-center justify-center border border-[#E2E8F0] shadow-sm">
                    <Award className="w-6 h-6 text-[#6C5CE7]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[20px] font-extrabold text-[#1B1D35]">Level {level}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#6C5CE7]/10 text-[#6C5CE7] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#6C5CE7]" /> Adaptive
                      </span>
                    </div>
                    <p className="text-[#A0AEC0] text-[13px] mt-0.5">Physics Master</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[13px] font-bold">
                    <span className="text-[#718096]">Total Experience</span>
                    <span className="text-[#6C5CE7] font-extrabold">{xp} XP</span>
                  </div>
                  <div className="h-3 bg-[#F1F5F9] rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] rounded-full" 
                    />
                  </div>
                  <p className="text-[#A0AEC0] text-[12px] text-center mt-3">
                    <strong className="text-[#1B1D35]">{nextLevelXp - currentLevelXp} XP</strong> until Level {level + 1}
                  </p>
                </div>
             </motion.div>
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
