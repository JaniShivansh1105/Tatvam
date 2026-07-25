"use client";

import React from "react";
import { BookOpen } from "lucide-react";

interface KnowledgeCalloutProps {
  term: string;
  definition: React.ReactNode;
}

export function KnowledgeCallout({ term, definition }: KnowledgeCalloutProps) {
  return (
    <div className="my-6 pl-6 py-2 border-l-4 border-[#6C5CE7] bg-gradient-to-r from-[#F8F9FF] to-transparent rounded-r-[16px]">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
        <span className="text-[15px] font-extrabold text-[#1B1D35]">{term}</span>
      </div>
      <div className="text-[15px] text-[#4A5568] leading-relaxed">
        {definition}
      </div>
    </div>
  );
}
