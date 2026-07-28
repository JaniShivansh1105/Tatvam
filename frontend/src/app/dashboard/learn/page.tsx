"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, ArrowRight, Loader2, Library, Plus } from "lucide-react";
import { useSubjects } from "@/hooks/dashboard/useSubjects";

// Subject color palette — assigned by index, no hardcoding
const SUBJECT_COLORS = [
  { bg: "bg-[#E5E1FF]", text: "text-[#6C5CE7]", border: "border-[#6C5CE7]/20" },
  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  { bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
];

export default function LearnPage() {
  const { subjects, isLoading } = useSubjects();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#6C5CE7]" />
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
          <Library className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No subjects yet</h2>
        <p className="text-gray-500 text-sm max-w-sm mb-6">
          Add your subjects in your Profile to start learning. Tatvam will build personalized learning paths for each subject.
        </p>
        <Link
          href="/dashboard/profile"
          className="px-6 py-2.5 bg-[#6C5CE7] text-white font-medium rounded-full hover:bg-[#5A4FCF] transition-colors text-sm shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
      
      <header className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-[#1B1D35] tracking-tight"
        >
          Learn
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mt-1"
        >
          Choose a subject to begin your learning session.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {subjects.map((subject, idx) => {
          const color = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
          return (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={`/dashboard/learn/${subject.id}`}
                className={`group block p-6 bg-white rounded-[20px] shadow-sm border ${color.border} hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${color.bg} ${color.text} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#6C5CE7] transition-colors">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Tap to explore topics and start learning
                </p>
                <div className="flex items-center gap-1.5 text-[#6C5CE7] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Learning <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
