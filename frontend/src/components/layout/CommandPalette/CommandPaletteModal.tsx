"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "@/context/LayoutContext";
import { Search, BookOpen, BrainCircuit, Dumbbell, Target, Calendar, User, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ACTIONS = [
  { label: "Dashboard", desc: "Overview of your learning progress", icon: <BookOpen className="w-4 h-4" />, href: "/dashboard" },
  { label: "Learn", desc: "Explore the interactive physics Knowledge Map", icon: <BookOpen className="w-4 h-4" />, href: "/dashboard/learn" },
  { label: "AI Mentor", desc: "Ask questions to Tatvam AI Mentor", icon: <BrainCircuit className="w-4 h-4" />, href: "/dashboard/mentor" },
  { label: "Practice Arena", desc: "Sharpen skills with targeted questions", icon: <Dumbbell className="w-4 h-4" />, href: "/dashboard/practice" },
  { label: "Assessments", desc: "Take full-length mock tests", icon: <Target className="w-4 h-4" />, href: "/dashboard/assessments" },
  { label: "Study Plans", desc: "Manage your daily & weekly schedule", icon: <Calendar className="w-4 h-4" />, href: "/dashboard/plans" },
  { label: "Profile", desc: "View and update your personal information", icon: <User className="w-4 h-4" />, href: "/dashboard/profile" },
  { label: "Settings", desc: "Customize language, theme & notifications", icon: <Settings className="w-4 h-4" />, href: "/dashboard/settings" },
];

export function CommandPaletteModal() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useLayout();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredActions = ACTIONS.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setCommandPaletteOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-[#1B1D35]/20 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-[600px] bg-white/95 backdrop-blur-2xl rounded-[24px] shadow-2xl border border-white/80 overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Search Input */}
              <div className="flex items-center px-4 h-16 border-b border-[rgba(108,92,231,0.08)]">
                <Search className="w-5 h-5 text-[#6C5CE7] shrink-0 mr-3" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What do you want to learn or navigate to?"
                  className="flex-1 bg-transparent border-none outline-none text-[#1B1D35] text-[16px] placeholder:text-[#A0AEC0]"
                  autoFocus
                />
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <kbd className="font-sans border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[11px] bg-[#F8F9FF] text-[#6B7280]">ESC</kbd>
                </div>
              </div>

              {/* Actions List */}
              <div className="p-4 flex flex-col gap-2 bg-[#F8F9FF]/50 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">
                  Quick Navigation
                </div>
                
                {filteredActions.map((action) => (
                  <div 
                    key={action.href} 
                    onClick={() => handleSelect(action.href)}
                    className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-[#E2E8F0] hover:shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E5E1FF] flex items-center justify-center text-[#6C5CE7]">
                      {action.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-[#1B1D35]">{action.label}</span>
                      <span className="text-[12px] text-[#718096]">{action.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
