"use client";

import React, { useState, useEffect } from "react";
import { LearningShell } from "@/components/dashboard/learning/LearningShell";
import { LessonHeader } from "@/components/dashboard/learning/LessonHeader";
import { ConceptSection } from "@/components/dashboard/learning/ConceptSection";
import { InsightPanel } from "@/components/dashboard/learning/blocks/InsightPanel";
import { KnowledgeCallout } from "@/components/dashboard/learning/blocks/KnowledgeCallout";
import { AnalogyCard } from "@/components/dashboard/learning/blocks/AnalogyCard";
import { UnderstandingCheck } from "@/components/dashboard/learning/UnderstandingCheck";
import { AdaptiveFeedback } from "@/components/dashboard/learning/AdaptiveFeedback";
import { AIMentorPanel } from "@/components/dashboard/learning/AIMentorPanel";
import { AILearningLayer } from "@/components/dashboard/learning/blocks/AILearningLayer";
import { MemoryTip } from "@/components/dashboard/learning/blocks/MemoryTip";
import { DeepDive } from "@/components/dashboard/learning/blocks/DeepDive";
import { RelationshipExplorer } from "@/components/dashboard/learning/blocks/RelationshipExplorer";
import { PhysicsVectorVisualizer } from "@/components/dashboard/learning/blocks/PhysicsVectorVisualizer";
import { BrainCircuit } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useEngineStore } from "@/store/engine-store";
import { ContextualPractice } from "@/components/dashboard/learning/workspace/ContextualPractice";
import { ReflectionCard } from "@/components/dashboard/learning/workspace/ReflectionCard";
import { SessionSummary } from "@/components/dashboard/learning/workspace/SessionSummary";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function LessonExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  const [feedbackStatus, setFeedbackStatus] = useState<"mastered" | "confused" | "analogy" | null>(null);
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  const initializeLesson = useEngineStore((state) => state.initializeLesson);
  const initializeConcept = useEngineStore((state) => state.initializeConcept);
  const recordInteraction = useEngineStore((state) => state.recordInteraction);
  const disposeLesson = useEngineStore((state) => state.disposeLesson);

  const { data: lessonData, isLoading } = useQuery({
    queryKey: ["lesson", topicId],
    queryFn: async () => {
      const res = await apiClient.get(`/content/lessons/${topicId}`);
      return res.data.data.lesson;
    },
    enabled: !!topicId,
  });

  useEffect(() => {
    if (lessonData) {
      // Map topics/sections to a flat timeline for the engine store
      const timeline = [];
      let i = 0;
      for (const topic of lessonData.topics || []) {
        for (const section of topic.sections || []) {
          timeline.push({
            id: section.id,
            label: section.title,
            status: i === 0 ? "current" as const : "upcoming" as const,
          });
          i++;
        }
      }
      timeline.push({ id: "reflection", label: "Reflection", status: "upcoming" as const });

      initializeLesson(lessonData.id, timeline);
      initializeConcept(topicId, lessonData.title);
    }
  }, [lessonData, topicId, initializeLesson, initializeConcept]);

  useEffect(() => {
    const handleOpenMentor = () => setIsMentorOpen(true);
    window.addEventListener("open-ai-mentor" as any, handleOpenMentor);

    return () => {
      disposeLesson();
      window.removeEventListener("open-ai-mentor" as any, handleOpenMentor);
    };
  }, [disposeLesson]);

  const handleCheck = (status: "mastered" | "confused" | "analogy") => {
    setFeedbackStatus(status);
    recordInteraction(topicId, status);
  };

  const handleContinue = () => {
    router.push(ROUTES.DASHBOARD.LEARN);
  };

  if (isLoading || !lessonData) {
    return (
      <LearningShell>
        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E2E8F0]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6C5CE7]" />
        </div>
      </LearningShell>
    );
  }

  // Restore the rich interactive learning experience for newtons-laws
  const lessonConfig = {
    title: lessonData.title,
    topic: lessonData.subject?.name || "Learning",
    estimatedMinutes: Math.max(10, (lessonData.topics?.reduce((acc: number, t: any) => acc + (t.sections?.length || 0), 0) || 1) * 5),
    sections: lessonData.topics?.flatMap((t: any) => t.sections) || [],
  };

  return (
    <LearningShell>
      <LessonHeader
          title={lessonConfig.title}
          topic={lessonConfig.topic}
          estimatedMinutes={lessonConfig.estimatedMinutes}
        />

        <div className="relative">
          <button
            onClick={() => setIsMentorOpen(true)}
            className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white shadow-[0_10px_30px_-10px_rgba(108,92,231,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(108,92,231,0.6)] hover:-translate-y-1 transition-all group"
          >
            <BrainCircuit className="w-5 h-5" />
            <span className="font-bold text-[15px] tracking-wide">Ask Mentor</span>
          </button>
          
          <AIMentorPanel isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />

          {lessonConfig.sections.map((section: any) => (
            <ConceptSection key={section.id} id={section.id} title={section.title}>
              <div 
                className="text-[17px] text-[#4A5568] leading-[1.8] tracking-wide prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }} 
              />
            </ConceptSection>
          ))}

          <ConceptSection id="reflection" title="Check Understanding">
            {!feedbackStatus ? (
              <UnderstandingCheck onCheck={handleCheck} />
            ) : (
              <AdaptiveFeedback status={feedbackStatus} onContinue={handleContinue} />
            )}
          </ConceptSection>

          {feedbackStatus === "mastered" && (
            <SessionSummary />
          )}

        </div>
      </LearningShell>
  );
}
