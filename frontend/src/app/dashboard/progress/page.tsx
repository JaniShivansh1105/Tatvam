"use client";

import React, { useEffect, useState } from "react";
import { useLayout } from "@/context/LayoutContext";
import { Activity, BrainCircuit, Calendar, CheckCircle, Clock, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function ProgressPage() {
  const { setMobileDrawerOpen } = useLayout();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Fetch dashboard content which has most of the progress we need, and also a dedicated progress endpoint if we had one.
        // For now, we will call /content/dashboard and /content/achievements
        const [dashRes, achRes] = await Promise.all([
          apiClient.get("/content/dashboard"),
          apiClient.get("/content/achievements")
        ]);
        
        if (dashRes.data.success && achRes.data.success) {
          setData({
            dashboard: dashRes.data.data,
            achievements: achRes.data.data
          });
        }
      } catch (err) {
        console.error("Failed to load progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F8F9FF]">
        <Loader2 className="w-8 h-8 text-[#6C5CE7] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 p-8 bg-[#F8F9FF]">
        Failed to load progress data.
      </div>
    );
  }

  const { dashboard, achievements } = data;
  const metrics = dashboard.metrics || {
    studyTime: 120,
    questionsCompleted: 45,
    averageAccuracy: 85,
    streak: 3
  };

  return (
    <main className="flex-1 min-h-screen bg-[#F8F9FF] text-[#1B1D35] font-sans pb-24 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] px-4 h-16 flex items-center gap-4">
        {isMobile && (
          <button 
            onClick={() => setMobileDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8F9FF] text-[#6C5CE7]"
          >
            <Activity className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe]">
            Learning Progress
          </h1>
          <p className="text-[12px] text-[#718096]">Track your mastery and analytics</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#E5E1FF] flex items-center justify-center text-[#6C5CE7]">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#718096]">Study Time</span>
            </div>
            <div className="text-3xl font-bold text-[#1B1D35]">{metrics.studyTime} <span className="text-lg text-[#A0AEC0] font-medium">min</span></div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#718096]">Current Streak</span>
            </div>
            <div className="text-3xl font-bold text-[#1B1D35]">{metrics.streak} <span className="text-lg text-[#A0AEC0] font-medium">days</span></div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-500">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#718096]">Accuracy</span>
            </div>
            <div className="text-3xl font-bold text-[#1B1D35]">{metrics.averageAccuracy}%</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-[#718096]">Questions</span>
            </div>
            <div className="text-3xl font-bold text-[#1B1D35]">{metrics.questionsCompleted}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Concept Mastery */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#6C5CE7]" />
                Concept Mastery
              </h2>
            </div>
            
            <div className="space-y-4">
              {dashboard.conceptMastery?.slice(0, 5).map((concept: any, i: number) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{concept.concept}</span>
                    <span className="text-[#6C5CE7] font-bold">{concept.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#F8F9FF] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] rounded-full"
                      style={{ width: `${concept.level}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!dashboard.conceptMastery || dashboard.conceptMastery.length === 0) && (
                <div className="py-8 text-center text-[#A0AEC0]">
                  Keep learning to unlock concept mastery metrics!
                </div>
              )}
            </div>
          </div>

          {/* Learning DNA */}
          <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Learning DNA Profile
              </h2>
            </div>
            
            <div className="flex items-center justify-center py-8">
               <div className="w-48 h-48 rounded-full border-8 border-[#F8F9FF] relative flex items-center justify-center shadow-inner">
                 <div className="absolute inset-0 border-8 border-transparent border-t-[#6C5CE7] border-r-emerald-400 border-b-blue-400 rounded-full opacity-80 animate-spin-slow" style={{ animationDuration: '8s' }}></div>
                 <div className="text-center z-10">
                   <div className="text-2xl font-bold text-[#1B1D35] capitalize">{dashboard.dna?.dominantTrait || "Visual"}</div>
                   <div className="text-sm text-[#718096]">Dominant Trait</div>
                 </div>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 rounded-xl bg-purple-50">
                <div className="text-sm font-medium text-purple-700">Visual Learning</div>
                <div className="text-lg font-bold">{Math.round((dashboard.dna?.visualScore || 0) * 100)}%</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-50">
                <div className="text-sm font-medium text-blue-700">Analytical</div>
                <div className="text-lg font-bold">{Math.round((dashboard.dna?.analyticalScore || 0) * 100)}%</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-50">
                <div className="text-sm font-medium text-emerald-700">Reading</div>
                <div className="text-lg font-bold">{Math.round((dashboard.dna?.readingScore || 0) * 100)}%</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-orange-50">
                <div className="text-sm font-medium text-orange-700">Auditory</div>
                <div className="text-lg font-bold">{Math.round((dashboard.dna?.auditoryScore || 0) * 100)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Recent Achievements
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements?.recent?.length > 0 ? (
              achievements.recent.map((ach: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F8F9FF] border border-[#E2E8F0] flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {ach.icon || "🏆"}
                  </div>
                  <div>
                    <div className="font-bold text-[#1B1D35]">{ach.title}</div>
                    <div className="text-xs text-[#718096]">{ach.description}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-6 text-[#A0AEC0]">
                Complete lessons and practice to earn achievements!
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
