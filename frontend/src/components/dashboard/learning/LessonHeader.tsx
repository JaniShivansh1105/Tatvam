"use client";

import React from "react";
import { ArrowLeft, Globe2, BookOpen, Focus, LayoutTemplate } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { useEngineStore } from "@/store/engine-store";

interface LessonHeaderProps {
  title: string;
  topic: string;
  estimatedMinutes: number;
}

export function LessonHeader({ title, topic }: LessonHeaderProps) {
  const { readingMode, setReadingMode, language, setLanguage } = useEngineStore();
  const LANGUAGES = ["English", "ગુજરાતી", "हिन्दी", "मराठी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ", "മലയാളം", "বাংলা", "ਪੰਜਾਬੀ"];

  return (
    <div className="sticky top-0 z-50 bg-[#F8F9FF]/80 backdrop-blur-xl border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Left: Navigation & Context */}
        <div className="flex flex-col gap-2">
          <Link 
            href={ROUTES.DASHBOARD.LEARN} 
            className="flex items-center gap-2 text-[14px] font-medium text-[#6B7280] hover:text-[#6C5CE7] transition-colors w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Topics
          </Link>
          
          <div>
            <span className="text-[13px] font-bold text-[#6C5CE7] uppercase tracking-wider block">
              {topic}
            </span>
            <h1 className="text-[28px] font-extrabold tracking-tight text-[#1B1D35] leading-[1.1]">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Controls (Language & Mode) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white border border-transparent hover:border-[#E2E8F0] transition-colors">
              <Globe2 className="w-4 h-4 text-[#4A5568]" />
              <span className="text-[13px] font-medium text-[#4A5568]">{language}</span>
            </button>
            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-[#E2E8F0] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1 max-h-64 overflow-y-auto custom-scrollbar z-50">
              {LANGUAGES.map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left px-4 py-2 text-[13px] hover:bg-[#F8F9FF] ${language === lang ? "font-bold text-[#6C5CE7] bg-[#F8F9FF]" : "text-[#4A5568]"}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Reading Mode Switcher */}
          <div className="flex bg-white rounded-full p-1 border border-[#E2E8F0] shadow-sm">
            <button 
              onClick={() => setReadingMode("balanced")}
              className={`p-1.5 rounded-full transition-all ${readingMode === "balanced" ? "bg-[#F0E6FF] text-[#6C5CE7]" : "text-[#A0AEC0] hover:text-[#4A5568]"}`}
              title="Balanced Mode"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setReadingMode("focused")}
              className={`p-1.5 rounded-full transition-all ${readingMode === "focused" ? "bg-[#F0E6FF] text-[#6C5CE7]" : "text-[#A0AEC0] hover:text-[#4A5568]"}`}
              title="Focused Mode (Hide Sidebars)"
            >
              <Focus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setReadingMode("revision")}
              className={`p-1.5 rounded-full transition-all ${readingMode === "revision" ? "bg-[#F0E6FF] text-[#6C5CE7]" : "text-[#A0AEC0] hover:text-[#4A5568]"}`}
              title="Revision Mode (Key Points Only)"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
