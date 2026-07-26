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
    </div>
  );
}
