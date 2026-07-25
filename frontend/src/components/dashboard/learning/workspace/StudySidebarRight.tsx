"use client";

import React from "react";
import { SmartNotes } from "./SmartNotes";
import { FormulaCard } from "./FormulaCard";
import { FlashcardReview } from "./FlashcardReview";
import { useEngineStore } from "@/store/engine-store";
import { Lightbulb } from "lucide-react";

export function StudySidebarRight() {
  const { activeSectionId } = useEngineStore();

  return (
    <div className="w-full h-full flex flex-col gap-8 pl-4">
      <FlashcardReview />
      <SmartNotes />
      
      {/* Adaptive Context Panel */}
      {activeSectionId === "intro" && (
        <div className="bg-[#F8F9FF] border border-[#E2E8F0] p-4 rounded-[16px]">
          <h4 className="text-[12px] font-bold text-[#6C5CE7] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" /> Key Takeaway
          </h4>
          <p className="text-[13px] text-[#4A5568]">Newton&apos;s First Law is also known as the Law of Inertia. It explains why objects don&apos;t move unless pushed.</p>
        </div>
      )}

      {(activeSectionId === "visual" || activeSectionId === "practice") && (
        <FormulaCard 
          formula="F = ma" 
          meaning="Force equals mass times acceleration" 
          variables={[
            { symbol: "F", name: "Force", unit: "Newtons (N)" },
            { symbol: "m", name: "Mass", unit: "Kilograms (kg)" },
            { symbol: "a", name: "Acceleration", unit: "m/s²" }
          ]}
          realLife="Pushing a heavy broken-down truck requires much more force than pushing a bicycle to achieve the same acceleration."
          mistake="Forgetting that mass must be in kilograms (kg), not grams (g)."
          memoryTrick="F is the father (Force), carrying the mother (mass) and child (acceleration)."
        />
      )}

      {activeSectionId === "reflection" && (
        <div className="bg-gradient-to-br from-[#1B1D35] to-[#2D3748] p-4 rounded-[16px] text-white shadow-md">
          <h4 className="text-[12px] font-bold text-[#E5E1FF] uppercase tracking-wider mb-2">Revision Tip</h4>
          <p className="text-[13px] text-white/80">Connecting physics laws to your personal life experiences is the strongest way to commit them to long-term memory.</p>
        </div>
      )}
    </div>
  );
}
