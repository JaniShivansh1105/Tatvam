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

  const { initializeLesson, initializeConcept, recordInteraction, disposeLesson } = useEngineStore();

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

      initializeLesson(topicId, timeline);
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
    estimatedMinutes: 20,
    sections: lessonData.topics?.flatMap((t: any) => t.sections) || [],
  };

  if (topicId === "newtons-laws") {
    return (
      <LearningShell>
        <LessonHeader
          title={lessonConfig.title}
          topic={lessonConfig.topic}
          estimatedMinutes={lessonConfig.estimatedMinutes}
        />

        <div className="relative">

          {/* Floating Mentor Button */}
          <button
            onClick={() => setIsMentorOpen(true)}
            className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white shadow-[0_10px_30px_-10px_rgba(108,92,231,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(108,92,231,0.6)] hover:-translate-y-1 transition-all group"
          >
            <BrainCircuit className="w-5 h-5" />
            <span className="font-bold text-[15px] tracking-wide">Ask Mentor</span>
          </button>

          <AIMentorPanel isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />

          <RelationshipExplorer nodes={[
            { id: "1", title: "Kinematics", type: "prereq" },
            { id: "2", title: "Newton's Laws", type: "current" },
            { id: "3", title: "Gravitation", type: "future" },
          ]} />

          <ConceptSection id="intro" title="The Law of Inertia">
            <div className="text-[17px] text-[#4A5568] leading-[1.8] tracking-wide mb-6">
              Have you ever wondered why you lurch forward when a car suddenly hits the brakes? Or why a coffee cup resting on a dashboard stays perfectly still until you accelerate?
            </div>
            <div className="text-[17px] text-[#4A5568] leading-[1.8] tracking-wide mb-8">
              This behavior is governed by Newton&apos;s First Law, often called the <AILearningLayer term="Law of Inertia">Law of Inertia</AILearningLayer>. It states a fundamental truth about how our universe operates.
            </div>

            <KnowledgeCallout
              term="Newton&apos;s First Law"
              definition="An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."
            />

            <PhysicsVectorVisualizer />

            <InsightPanel title="Why this matters">
              <p>Before Newton, Aristotle believed that things naturally wanted to come to a stop. Newton revolutionized physics by declaring that constant motion is just as natural as standing still.</p>
            </InsightPanel>
          </ConceptSection>

          <ConceptSection id="inertia" title="Building Intuition">
            <div className="text-[17px] text-[#4A5568] leading-[1.8] tracking-wide mb-8">
              The trickiest part of this concept is the phrase <AILearningLayer term="Unbalanced Force">&quot;unbalanced force&quot;</AILearningLayer>. In our everyday life, friction and air resistance are always acting as unbalanced forces, bringing things to a stop. This makes it hard to intuitively grasp inertia.
            </div>

            <AnalogyCard>
              <p>Imagine sliding a hockey puck on a rough asphalt road. It stops quickly. Now slide it on smooth ice. It glides much further. Now imagine sliding it in the deep vacuum of space where there is no air or surface friction.</p>
              <p className="mt-2 font-semibold">It would glide forever. It requires an unbalanced force to stop it.</p>
            </AnalogyCard>

            <MemoryTip>
              Think of Inertia as &quot;Laziness&quot;. Objects are lazy. If they are sitting still, they want to keep sitting still. If they are moving, they are too lazy to stop unless something forces them to.
            </MemoryTip>

            <DeepDive title="The Mathematics of Inertia">
              In classical mechanics, inertia is directly proportional to an object&apos;s mass. The more massive an object is, the more it resists changes to its state of motion. This is why it&apos;s much harder to push a broken-down truck than a bicycle. The mathematical formulation involves <em>mass (m)</em> acting as the constant of proportionality in Newton&apos;s Second Law: <strong>F = ma</strong>.
            </DeepDive>
          </ConceptSection>

          <ConceptSection id="visual" title="Visual Understanding">
            <ContextualPractice
              question="If you slide a hockey puck on ice, it glides further than on asphalt because..."
              options={[
                "Ice is colder than asphalt.",
                "Ice exerts less opposing force (friction) on the puck.",
                "The puck gains mass on the ice.",
                "Ice creates its own forward force.",
              ]}
              correctIndex={1}
              explanation="Ice provides very little friction compared to asphalt. According to Newton's First Law, without an unbalanced force (like friction) acting on it, the puck would glide forever."
              conceptId={topicId}
            />
          </ConceptSection>

          <ConceptSection id="practice" title="Practical Application">
            <ReflectionCard
              prompt="Think of a time when you experienced inertia in real life. How would you explain what happened using Newton's First Law?"
            />
          </ConceptSection>

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

  // Fallback for other lessons — dynamic shell
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
              {/* Parse and render the section content dynamically from the DB */}
              <div 
                className="text-[17px] text-[#4A5568] leading-[1.8] tracking-wide"
                dangerouslySetInnerHTML={{ __html: section.content }} 
              />
            </ConceptSection>
          ))}

          <ConceptSection id="reflection">
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
