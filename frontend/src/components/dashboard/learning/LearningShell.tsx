"use client";

import React from "react";
import { motion } from "framer-motion";
import { StudySidebarLeft } from "./workspace/StudySidebarLeft";
import { StudySidebarRight } from "./workspace/StudySidebarRight";
import { TextSelectionToolbar } from "./workspace/TextSelectionToolbar";
import { WorkspaceSearch } from "./workspace/WorkspaceSearch";
import { useEngineStore } from "@/store/engine-store";

interface LearningShellProps {
  children: React.ReactNode;
}

export function LearningShell({ children }: LearningShellProps) {
  const readingMode = useEngineStore((s) => s.readingMode);

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#F8F9FF] text-[#1B1D35]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative items-start min-h-full pt-8 pb-32">
        
        {/* Left Sidebar (Timeline & Bookmarks) */}
        {readingMode !== "focused" && (
          <div className="hidden lg:block w-[280px] sticky top-8 shrink-0 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pb-8 transition-all">
            <StudySidebarLeft />
          </div>
        )}

        {/* Main Learning Column */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex-1 w-full max-w-[800px] mx-auto"
        >
          {children}
        </motion.div>

        {/* Right Sidebar (Notes & Formulas) */}
        {readingMode !== "focused" && (
          <div className="hidden 2xl:block w-[320px] sticky top-8 shrink-0 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pb-8 transition-all">
            <StudySidebarRight />
          </div>
        )}

      </div>
      
      <TextSelectionToolbar />
      <WorkspaceSearch />
    </div>
  );
}
