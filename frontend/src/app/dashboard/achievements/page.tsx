"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Trophy, Star, Zap, Flame, Award, Shield, CheckCircle2, Loader2, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

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
              <h1 className="text-[28px] font-bold text-[#1B1D35]">Achievements</h1>
              <p className="text-[15px] text-[#A0AEC0] mt-1">Track your milestones and collect badges.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge: any) => (
                <div 
                  key={badge.id}
                  className={`bg-white rounded-2xl border p-5 flex items-center gap-5 transition-all ${badge.earned ? 'border-[#E2E8F0] hover:shadow-md' : 'border-[#F1F5F9] opacity-60 grayscale'}`}
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                    {iconMap[badge.icon] || <Award className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1B1D35] text-[16px]">{badge.title}</h3>
                    <p className="text-[#A0AEC0] text-[13px] mt-1 leading-relaxed">{badge.description}</p>
                    {badge.earned && (
                      <div className="mt-2 text-[#48BB78] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#48BB78]" /> Unlocked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-full xl:col-span-4 flex flex-col gap-5 pt-0 xl:pt-[84px]">
             <div className="bg-[#1B1D35] p-6 rounded-3xl text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#6C5CE7] rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-white">Level {level}</h3>
                    <p className="text-[#A0AEC0] text-[13px]">Physics Learner</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[13px] font-bold">
                    <span className="text-[#A0AEC0]">Experience</span>
                    <span className="text-white">{xp} XP Total</span>
                  </div>
                  <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00C6FF] rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[#A0AEC0] text-[12px] text-center mt-3">
                    {nextLevelXp - currentLevelXp} XP until Level {level + 1}
                  </p>
                </div>
             </div>
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
