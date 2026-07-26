"use client";

import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ContentArea } from "@/components/layout/ContentArea";
import { motion } from "framer-motion";
import Link from "next/link";
import { GitBranch, Target, CheckCircle2, Lock, ArrowRight } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

export default function TopicExplorerPage() {
  const user = useAuthStore((state) => state.user);
  
  const { data: KNOWLEDGE_GRAPH, isLoading } = useQuery({
    queryKey: ["roadmap", user?.id],
    queryFn: async () => {
      const res = await apiClient.get("/content/roadmap");
      return res.data.data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  if (isLoading || !KNOWLEDGE_GRAPH) {
    return (
      <PageContainer>
        <ContentArea>
          <div className="w-full h-full flex items-center justify-center bg-[#F8F9FF] rounded-[32px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
          </div>
        </ContentArea>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentArea>
        <div className="w-full h-full bg-[#F8F9FF] rounded-[32px] overflow-hidden flex flex-col relative border border-[rgba(108,92,231,0.05)] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
          
          <div className="p-10 lg:p-16 border-b border-[rgba(108,92,231,0.1)] relative overflow-hidden bg-white/40 backdrop-blur-md">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#E5E1FF] to-transparent rounded-full opacity-40 blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#8B7CF6] flex items-center justify-center shadow-md">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-[32px] font-extrabold text-[#1B1D35] tracking-tight">Knowledge Map</h1>
            </div>
            
            <p className="text-[16px] text-[#6B7280] max-w-2xl leading-relaxed relative z-10">
              Your personalized learning topology. Tatvam adapts this graph in real-time based on your interactions, unlocking new nodes only when foundational understanding is proven.
            </p>
          </div>

          <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar relative">
            <div className="max-w-[800px] mx-auto relative pl-10 border-l-2 border-[rgba(108,92,231,0.15)] flex flex-col gap-12">
              
              {KNOWLEDGE_GRAPH.map((node: any, idx: number) => {
                
                const isMastered = node.status === "mastered" || node.status === "completed";
                const isInProgress = node.status === "in-progress" || node.status === "current";
                const isLocked = node.status === "locked";

                return (
                  <motion.div 
                    key={node.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                    className={`relative ${isLocked ? "opacity-60 grayscale-[50%]" : ""}`}
                  >
                    {/* Timeline Node */}
                    <div className={`absolute -left-[51px] w-5 h-5 rounded-full border-4 border-[#F8F9FF] shadow-sm flex items-center justify-center ${
                      isMastered ? "bg-[#48BB78]" : isInProgress ? "bg-[#6C5CE7]" : "bg-[#E2E8F0]"
                    }`}>
                      {isMastered && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {isLocked && <Lock className="w-3 h-3 text-[#A0AEC0]" />}
                    </div>

                    <Link 
                      href={isLocked ? "#" : `/dashboard/learn/${node.id}`}
                      prefetch={true}
                      className={`block bg-white border rounded-[24px] p-6 shadow-sm transition-all duration-300 ${
                        isLocked 
                          ? "border-[#E2E8F0] cursor-not-allowed" 
                          : "border-transparent hover:border-[#6C5CE7]/30 hover:shadow-md cursor-pointer group"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`text-[20px] font-bold ${isLocked ? "text-[#A0AEC0]" : "text-[#1B1D35] group-hover:text-[#6C5CE7] transition-colors"}`}>
                          {node.title}
                        </h3>
                        {isInProgress && (
                          <span className="px-3 py-1 rounded-full bg-[#F0E6FF] text-[#6C5CE7] text-[12px] font-bold tracking-wide uppercase shadow-sm">
                            Suggested
                          </span>
                        )}
                        {isMastered && (
                          <span className="px-3 py-1 rounded-full bg-[#F0FFF4] text-[#48BB78] text-[12px] font-bold tracking-wide uppercase shadow-sm">
                            Mastered
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-[14px] text-[#A0AEC0]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Target className="w-4 h-4" />
                          {node.difficulty}
                        </span>
                        <span>•</span>
                        <span className="font-medium">{node.time}</span>
                      </div>
                      
                      {!isLocked && (
                        <div className="mt-6 flex items-center gap-2 text-[#6C5CE7] text-[14px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          {isMastered ? "Review Concept" : "Begin Learning"}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
              
            </div>
          </div>

        </div>
      </ContentArea>
    </PageContainer>
  );
}
