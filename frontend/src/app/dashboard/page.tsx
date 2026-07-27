"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { ContinueLearningCard } from "@/components/dashboard/ContinueLearningCard";
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

function DashboardSkeleton() {
  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className={`${DASHBOARD_CONSTANTS.layout.leftColSpan} flex flex-col gap-5 animate-pulse`}>
            <div className="h-24 bg-white/70 rounded-3xl border border-white/80" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="h-56 bg-white/70 rounded-3xl border border-white/80" />
              <div className="h-56 bg-white/70 rounded-3xl border border-white/80" />
            </div>
            <div className="h-32 bg-white/70 rounded-3xl border border-white/80" />
            <div className="h-64 bg-white/70 rounded-3xl border border-white/80" />
          </div>
          <div className={`${DASHBOARD_CONSTANTS.layout.rightColSpan} flex flex-col gap-5 pt-0 xl:pt-[84px] animate-pulse`}>
            <div className="h-44 bg-white/70 rounded-3xl border border-white/80" />
            <div className="h-56 bg-white/70 rounded-3xl border border-white/80" />
            <div className="h-44 bg-white/70 rounded-3xl border border-white/80" />
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: async () => {
      const res = await apiClient.get("/content/dashboard");
      return res.data.data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  if (!dashboardData) {
    return (
      <PageContainer>
        <ContentArea>
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/70 rounded-3xl border border-white/80">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Could not load dashboard</h2>
            <p className="text-gray-600">There was a problem retrieving your learning data. Please try refreshing the page.</p>
          </div>
        </ContentArea>
      </PageContainer>
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
