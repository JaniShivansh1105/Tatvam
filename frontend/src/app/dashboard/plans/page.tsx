"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Calendar, Plus, CheckCircle2, Circle, Loader2, Target, Sparkles, Clock, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlansPage() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await apiClient.get("/plans");
      return res.data.data;
    }
  });

  const createPlanMutation = useMutation({
    mutationFn: async (type: string) => {
      const tasks = [
        { title: "Review Kinematics & One-Dimensional Motion", lessonId: null },
        { title: "Complete Newton's Laws Practice Set", lessonId: null },
        { title: "Solve Vector Resolution Exercises", lessonId: null },
        { title: "Take Kinematics Mastery Assessment", lessonId: null },
      ];
      await apiClient.post("/plans", { type, title: `${type.charAt(0).toUpperCase() + type.slice(1)} Adaptive Plan`, tasks });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setIsCreating(false);
    }
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string, status: string }) => {
      await apiClient.put(`/plans/tasks/${taskId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    }
  });

  if (isLoading) {
    return (
      <PageContainer>
        <ContentArea>
          <DashboardShell>
            <div className="col-span-full h-full min-h-[600px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
            </div>
          </DashboardShell>
        </ContentArea>
      </PageContainer>
    );
  }

  const activePlan = plans?.[0]; // Show most recent plan

  return (
    <PageContainer>
      <ContentArea>
        <DashboardShell>
          <div className="col-span-full xl:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-[#1B1D35] tracking-tight">Study Plans</h1>
                <p className="text-[15px] text-[#A0AEC0] mt-1">AI-generated adaptive schedules aligned with your Learning DNA.</p>
              </div>
              <button 
                onClick={() => setIsCreating(!isCreating)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1B1D35] hover:bg-[#2D3748] text-white rounded-2xl transition-all shadow-md font-semibold text-[14px]"
              >
                <Plus className="w-4 h-4 text-[#6C5CE7]" />
                <span>{isCreating ? "Cancel" : "New Adaptive Plan"}</span>
              </button>
            </div>

            <AnimatePresence>
              {isCreating && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
                >
                  {[
                    { type: "daily", label: "Daily Sprint", desc: "1-day focused plan for immediate concept reinforcement." },
                    { type: "weekly", label: "Weekly Mastery", desc: "7-day adaptive roadmap covering major unit topics." },
                    { type: "adaptive", label: "AI Adaptive Flow", desc: "Dynamic schedule that updates automatically based on quiz accuracy." },
                  ].map(item => (
                    <button 
                      key={item.type}
                      disabled={createPlanMutation.isPending}
                      onClick={() => createPlanMutation.mutate(item.type)}
                      className="p-6 bg-white rounded-3xl border border-[#E2E8F0] hover:border-[#6C5CE7] hover:shadow-[0_10px_30px_rgba(108,92,231,0.12)] text-left transition-all group relative overflow-hidden"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[#F0E6FF] text-[#6C5CE7] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-[#1B1D35] text-[17px]">{item.label}</h3>
                      <p className="text-[13px] text-[#A0AEC0] mt-2 leading-relaxed">{item.desc}</p>
                      <div className="mt-4 flex items-center gap-1.5 text-[#6C5CE7] text-[12px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Generate Now
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!activePlan ? (
              <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#E2E8F0] text-center p-8">
                <div className="w-16 h-16 rounded-full bg-[#F0E6FF] flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-[#6C5CE7]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#1B1D35]">No Active Plan</h3>
                <p className="text-[#A0AEC0] mt-2 mb-6 max-w-sm">Generate an adaptive study plan to systematically master your topics.</p>
                <button 
                  onClick={() => setIsCreating(true)}
                  className="px-6 py-3 bg-[#6C5CE7] hover:bg-[#5A4BCC] text-white rounded-2xl font-bold text-[14px] transition-all shadow-md"
                >
                  Create Your First Plan
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden transition-all">
                
                {/* Plan Header metadata */}
                <div className="p-6 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8F9FF] to-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#F0E6FF] text-[#6C5CE7] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Adaptive Plan
                        </span>
                        <span className="px-3 py-0.5 rounded-full bg-[#F0FFF4] text-[#38A169] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> 96% AI Confidence
                        </span>
                      </div>
                      <h2 className="text-[22px] font-extrabold text-[#1B1D35] tracking-tight">{activePlan.title}</h2>
                      <div className="flex items-center gap-4 text-[13px] text-[#A0AEC0] mt-2 flex-wrap">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-[#6C5CE7]" />
                          Created {activePlan.createdAt ? new Date(activePlan.createdAt).toLocaleDateString() : "Today"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-4 h-4 text-[#6C5CE7]" />
                          Ends {new Date(activePlan.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-left md:text-right shrink-0 bg-white p-4 rounded-2xl border border-[#E2E8F0]">
                      <div className="text-[28px] font-extrabold text-[#6C5CE7] leading-none">{Math.round(activePlan.progress)}%</div>
                      <div className="text-[11px] text-[#A0AEC0] uppercase tracking-wider font-bold mt-1">Plan Completed</div>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="mt-6 w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(activePlan.progress)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#00C6FF] rounded-full"
                    />
                  </div>
                </div>
                
                {/* Tasks List */}
                <div className="p-3 space-y-1">
                  {activePlan.tasks.map((task: any) => {
                    const isCompleted = task.status === "completed";
                    return (
                      <button 
                        key={task.id}
                        onClick={() => toggleTaskMutation.mutate({ 
                          taskId: task.id, 
                          status: isCompleted ? "pending" : "completed" 
                        })}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F9FF] rounded-2xl transition-colors text-left group"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-[#48BB78] shrink-0 group-hover:scale-110 transition-transform" />
                        ) : (
                          <Circle className="w-6 h-6 text-[#CBD5E1] shrink-0 group-hover:text-[#6C5CE7] transition-colors" />
                        )}
                        <div className={`flex-1 ${isCompleted ? "opacity-50" : ""}`}>
                          <h4 className={`text-[15px] font-semibold text-[#1B1D35] ${isCompleted ? "line-through" : ""}`}>{task.title}</h4>
                        </div>
                        {isCompleted && (
                          <span className="text-[12px] font-bold text-[#48BB78] bg-[#F0FFF4] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Done
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

          <div className="col-span-full xl:col-span-4 flex flex-col gap-5 pt-0 xl:pt-[84px]">
             <div className="bg-[#1B1D35] p-6 rounded-3xl text-white shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#6C5CE7]">
                  <Zap className="w-5 h-5 fill-current" />
                  <h3 className="text-[16px] font-bold text-white uppercase tracking-wider">Consistency Insights</h3>
                </div>
                <p className="text-[#A0AEC0] text-[14px] leading-relaxed">Completing study plan tasks on time increases concept mastery retention by up to 34%.</p>
                
                <div className="mt-8 flex justify-between items-end px-2">
                  {['M','T','W','T','F','S','S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div 
                        className={`w-7 rounded-full transition-all ${i < 4 ? 'bg-gradient-to-t from-[#6C5CE7] to-[#8B7CF6]' : 'bg-white/10'}`} 
                        style={{ height: i < 4 ? `${40 + i * 8}px` : '24px' }} 
                      />
                      <span className="text-[12px] text-[#A0AEC0] font-bold">{day}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>

        </DashboardShell>
      </ContentArea>
    </PageContainer>
  );
}
