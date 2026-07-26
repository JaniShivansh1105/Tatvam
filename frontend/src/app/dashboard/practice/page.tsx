"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Dumbbell, Target, Clock, ArrowRight, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function PracticePage() {
  const queryClient = useQueryClient();
  const [activeSetId, setActiveSetId] = useState<string | null>(null);

  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  const { data: practiceSets, isLoading } = useQuery({
    queryKey: ["practiceSets"],
    queryFn: async () => {
      const res = await apiClient.get("/practice");
      return res.data.data;
    }
  });

  const generateSetMutation = useMutation({
    mutationFn: async (type: string = "practice") => {
      const res = await apiClient.post("/practice/generate", { 
        lessonId: null, 
        type, 
        difficulty: "mixed" 
      });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      setActiveSetId(data.id);
      setSessionStartTime(Date.now());
    }
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string, answer: string }) => {
      const timeSpentMs = Date.now() - sessionStartTime;
      await apiClient.post(`/practice/question/${questionId}/submit`, { answer, timeSpentMs });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
    }
  });

  const completeSetMutation = useMutation({
    mutationFn: async (setId: string) => {
      await apiClient.post(`/practice/set/${setId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceSets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      setActiveSetId(null);
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

  const activeSet = practiceSets?.find((s: any) => s.id === activeSetId) || practiceSets?.find((s: any) => s.status === "in_progress");

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          
          {!activeSet ? (
            <div className="col-span-full flex flex-col gap-6">
              <div>
                <h1 className="text-[28px] font-bold text-[#1B1D35]">Practice Arena</h1>
                <p className="text-[15px] text-[#A0AEC0] mt-1">Sharpen your skills with AI-generated practice sets.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] rounded-3xl p-6 text-white relative overflow-hidden">
                  <Dumbbell className="w-12 h-12 mb-4 opacity-80" />
                  <h3 className="text-[20px] font-bold">Quick Practice</h3>
                  <p className="text-white/80 text-[14px] mt-2 mb-6">10 tailored questions based on your weakest areas.</p>
                  <button 
                    onClick={() => generateSetMutation.mutate("practice")}
                    disabled={generateSetMutation.isPending}
                    className="flex items-center gap-2 bg-white text-[#6C5CE7] px-5 py-2.5 rounded-full font-bold text-[14px] hover:shadow-lg transition-all"
                  >
                    {generateSetMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Start Now
                  </button>
                  <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                    <Dumbbell className="w-48 h-48" />
                  </div>
                </div>

                <div 
                  onClick={() => !generateSetMutation.isPending && generateSetMutation.mutate("mock_test")}
                  className="bg-white rounded-3xl p-6 border border-[#E2E8F0] hover:border-[#6C5CE7] transition-colors cursor-pointer group"
                >
                  <Target className="w-12 h-12 text-[#6C5CE7] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-[20px] font-bold text-[#1B1D35]">Mock Assessment</h3>
                  <p className="text-[#A0AEC0] text-[14px] mt-2">Full length exam simulation.</p>
                </div>
              </div>

              {practiceSets?.filter((s: any) => s.status === "completed").length > 0 && (
                <div className="mt-8">
                  <h3 className="text-[18px] font-bold text-[#1B1D35] mb-4">Past Sessions</h3>
                  <div className="space-y-4">
                    {practiceSets.filter((s: any) => s.status === "completed").map((set: any) => (
                      <div key={set.id} className="bg-white p-4 rounded-2xl border border-[#E2E8F0] flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1B1D35] capitalize">{set.type}</span>
                          <span className="text-[#A0AEC0] text-[13px]">{new Date(set.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-[#48BB78] text-[20px]">{Math.round(set.score || 0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="col-span-full xl:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[24px] font-bold text-[#1B1D35]">Active Practice Session</h2>
                  <p className="text-[14px] text-[#A0AEC0]">Answer the questions below.</p>
                </div>
                <button 
                  onClick={() => completeSetMutation.mutate(activeSet.id)}
                  className="px-6 py-2.5 bg-[#48BB78] text-white rounded-xl font-bold hover:bg-[#38A169] transition-colors"
                >
                  Finish & Score
                </button>
              </div>

              <div className="space-y-6">
                {activeSet.questions.map((q: any, idx: number) => {
                  const isAnswered = q.userAnswer != null;
                  return (
                    <motion.div 
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-6 rounded-3xl border border-[#E2E8F0]"
                    >
                      <h4 className="text-[16px] font-semibold text-[#1B1D35] mb-4">
                        <span className="text-[#6C5CE7] mr-2">Q{idx + 1}.</span> {q.text}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt: string) => {
                          const isSelected = q.userAnswer === opt;
                          const isCorrectOpt = q.correctAnswer === opt;
                          
                          let bgClass = "bg-[#F8F9FF] border-[#E2E8F0] hover:border-[#6C5CE7]";
                          if (isAnswered) {
                            if (isCorrectOpt) bgClass = "bg-[#F0FFF4] border-[#48BB78] text-[#2F855A]";
                            else if (isSelected && !isCorrectOpt) bgClass = "bg-[#FFF5F5] border-[#F56565] text-[#C53030]";
                            else bgClass = "bg-[#F8F9FF] border-[#E2E8F0] opacity-50";
                          } else if (isSelected) {
                            bgClass = "bg-[#F0E6FF] border-[#6C5CE7]";
                          }

                          return (
                            <button
                              key={opt}
                              disabled={isAnswered}
                              onClick={() => submitAnswerMutation.mutate({ questionId: q.id, answer: opt })}
                              className={`p-4 rounded-xl border text-left text-[14px] font-medium transition-all ${bgClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      
                      {isAnswered && q.explanation && (
                        <div className="mt-4 p-4 bg-[#F8F9FF] rounded-xl border border-[#E2E8F0]">
                          <p className="text-[13px] text-[#4A5568]"><strong>Explanation:</strong> {q.explanation}</p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}

        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
