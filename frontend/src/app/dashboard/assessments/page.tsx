"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Target, Timer, Loader2, Play, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AssessmentsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: practiceSets, isLoading } = useQuery({
    queryKey: ["practiceSets"],
    queryFn: async () => {
      const res = await apiClient.get("/practice");
      return res.data.data;
    }
  });

  const generateAssessmentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post("/practice/generate", { 
        lessonId: null, 
        type: "mock_test", 
        difficulty: "hard" 
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      // In a real app we'd navigate to a dedicated assessment taking page,
      // but for product completion we'll send them to practice which handles in_progress sets.
      router.push("/dashboard/practice");
    }
  });

  if (isLoading) {
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

  const assessments = practiceSets?.filter((s: any) => s.type === "mock_test") || [];
  const completedAssessments = assessments.filter((s: any) => s.status === "completed");
  const avgScore = completedAssessments.length > 0 
    ? Math.round(completedAssessments.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / completedAssessments.length) 
    : 0;

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className="col-span-full xl:col-span-8 flex flex-col gap-6">
            <div>
              <h1 className="text-[28px] font-bold text-[#1B1D35]">Assessments</h1>
              <p className="text-[15px] text-[#A0AEC0] mt-1">Take full-length mock tests to evaluate your mastery.</p>
            </div>

            <div className="bg-[#1B1D35] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
              <div className="z-10 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#48BB78]/20 text-[#48BB78] rounded-full text-[12px] font-bold uppercase tracking-wider mb-4">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Recommended
                </div>
                <h3 className="text-[24px] font-bold mb-2">Mid-Term Mock Test</h3>
                <p className="text-[#A0AEC0] text-[14px] leading-relaxed mb-6">A comprehensive 50-question test covering Kinematics and Dynamics. Time limit: 60 minutes.</p>
                <button 
                  onClick={() => generateAssessmentMutation.mutate()}
                  className="flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#5A4BCC] text-white px-6 py-3 rounded-xl font-bold text-[14px] transition-all"
                >
                  {generateAssessmentMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-white" />}
                  Start Assessment
                </button>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none md:translate-x-1/4">
                <Target className="w-64 h-64 text-[#6C5CE7]" />
              </div>
            </div>

            {completedAssessments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[18px] font-bold text-[#1B1D35] mb-4">Your Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedAssessments.map((set: any, idx: number) => (
                    <div key={set.id} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#6C5CE7] transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7] font-bold">
                          {idx + 1}
                        </div>
                        <div className="text-right">
                          <div className="text-[24px] font-extrabold text-[#1B1D35]">{Math.round(set.score || 0)}%</div>
                          <div className="text-[11px] text-[#A0AEC0] font-bold uppercase tracking-wider">Score</div>
                        </div>
                      </div>
                      <h4 className="font-bold text-[#1B1D35] mb-1">Mock Test #{idx + 1}</h4>
                      <div className="flex items-center gap-2 text-[#A0AEC0] text-[13px]">
                        <Timer className="w-4 h-4" />
                        <span>Completed {new Date(set.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="col-span-full xl:col-span-4 flex flex-col gap-5 pt-0 xl:pt-[84px]">
             <div className="bg-white p-6 rounded-3xl border border-[#E2E8F0]">
                <h3 className="text-[18px] font-bold text-[#1B1D35] mb-4">Readiness</h3>
                
                <div className="relative w-40 h-40 mx-auto mb-4">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                     <circle cx="50" cy="50" r="45" fill="none" stroke="#6C5CE7" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * avgScore) / 100} />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-[32px] font-extrabold text-[#1B1D35]">{avgScore}%</span>
                   </div>
                </div>
                
                <p className="text-center text-[#4A5568] text-[14px] leading-relaxed">
                  Based on your practice and assessments, you are <strong className="text-[#6C5CE7]">{avgScore}% ready</strong> for your final exams.
                </p>
             </div>
          </div>
        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
