"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { LearningDNACard } from "@/components/dashboard/LearningDNACard";
import { ConceptMasteryCard } from "@/components/dashboard/ConceptMasteryCard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RoadmapPreview } from "@/components/dashboard/RoadmapPreview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";

import { DASHBOARD_CONSTANTS } from "@/components/dashboard/constants";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: async () => {
      const res = await apiClient.get("/content/dashboard");
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  const data = dashboardData;

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          
          {/* Main Content Column (Left on Desktop) */}
          <div className={`${DASHBOARD_CONSTANTS.layout.leftColSpan} flex flex-col gap-5`}>
            <WelcomeHero streak={data.stats.currentStreak} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ContinueLearningCard data={data.continueLearning} />
              <LearningDNACard />
            </div>

            <StatsGrid data={data.stats} streak={data.user.streak} />
            
            <RoadmapPreview data={data.roadmap} />
          </div>

          {/* Sidebar Content Column (Right on Desktop) */}
          <div className={`${DASHBOARD_CONSTANTS.layout.rightColSpan} flex flex-col gap-5 pt-0 xl:pt-[84px]`}>
            <GoalCard data={data.goal} />
            <ConceptMasteryCard lessonId={data.continueLearning?.id} />
            <QuickActions data={data.quickActions} />
            <RecentActivity data={data.recentActivity} />
          </div>

        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
