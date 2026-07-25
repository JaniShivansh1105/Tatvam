"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Calendar, Plus, CheckCircle2, Circle, Loader2, Target } from "lucide-react";
import { motion } from "framer-motion";

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
      // For demo, creating a generic plan with default tasks
      const tasks = [
        { title: "Review Kinematics Basics", lessonId: null },
        { title: "Complete Newton's Laws Practice", lessonId: null },
        { title: "Watch Vectors Deep Dive", lessonId: null },
      ];
      await apiClient.post("/plans", { type, title: `${type.charAt(0).toUpperCase() + type.slice(1)} Plan`, tasks });
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
                <h1 className="text-[28px] font-bold text-[#1B1D35]">Study Plans</h1>
                <p className="text-[15px] text-[#A0AEC0] mt-1">Manage your learning schedule and goals.</p>
              </div>
              <button 
                onClick={() => setIsCreating(!isCreating)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B1D35] text-white rounded-xl hover:bg-[#2D3748] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-semibold text-[14px]">New Plan</span>
              </button>
            </div>

            {isCreating && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
              >
                {["daily", "weekly", "adaptive"].map(type => (
                  <button 
                    key={type}
                    onClick={() => createPlanMutation.mutate(type)}
                    className="p-6 bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#6C5CE7] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-left transition-all group"
                  >
                    <Target className="w-6 h-6 text-[#6C5CE7] mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-bold text-[#1B1D35] text-[16px] capitalize">{type} Plan</h3>
                    <p className="text-[13px] text-[#A0AEC0] mt-1">Generate a curated {type} study plan based on your DNA.</p>
                  </button>
                ))}
              </motion.div>
            )}

            {!activePlan ? (
              <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-[#E2E8F0]">
                <Calendar className="w-12 h-12 text-[#CBD5E1] mb-4" />
                <h3 className="text-[18px] font-bold text-[#1B1D35]">No Active Plan</h3>
                <p className="text-[#A0AEC0] mt-2 mb-6">Create a new study plan to stay on track.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden">
                <div className="p-6 border-b border-[#E2E8F0] bg-[#F8F9FF] flex items-center justify-between">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#1B1D35]">{activePlan.title}</h2>
                    <p className="text-[14px] text-[#A0AEC0]">Ends on {new Date(activePlan.endDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-extrabold text-[#6C5CE7]">{Math.round(activePlan.progress)}%</div>
                    <div className="text-[13px] text-[#A0AEC0] uppercase tracking-wide font-bold">Completed</div>
                  </div>
                </div>
                
                <div className="p-2">
                  {activePlan.tasks.map((task: any, idx: number) => (
                    <button 
                      key={task.id}
                      onClick={() => toggleTaskMutation.mutate({ 
                        taskId: task.id, 
                        status: task.status === "completed" ? "pending" : "completed" 
                      })}
                      className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F9FF] rounded-xl transition-colors text-left"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="w-6 h-6 text-[#48BB78] shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#CBD5E1] shrink-0" />
                      )}
                      <div className={`flex-1 ${task.status === "completed" ? "opacity-50" : ""}`}>
                        <h4 className={`text-[15px] font-semibold text-[#1B1D35] ${task.status === "completed" ? "line-through" : ""}`}>{task.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-full xl:col-span-4 flex flex-col gap-5 pt-0 xl:pt-[84px]">
             {/* Secondary calendar / overview card could go here */}
             <div className="bg-[#1B1D35] p-6 rounded-3xl text-white">
                <h3 className="text-[18px] font-bold mb-2">Plan Consistency</h3>
                <p className="text-[#A0AEC0] text-[14px] leading-relaxed">Sticking to your adaptive plans increases knowledge retention by 34%.</p>
                
                <div className="mt-6 flex justify-between items-end">
                  {['M','T','W','T','F','S','S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-8 rounded-full ${i < 3 ? 'bg-[#6C5CE7]' : 'bg-[rgba(255,255,255,0.1)]'}`} style={{ height: i < 3 ? '60px' : '30px' }} />
                      <span className="text-[12px] text-[#A0AEC0] font-semibold">{day}</span>
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
