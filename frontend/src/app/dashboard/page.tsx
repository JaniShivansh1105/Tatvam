"use client";

import { useAuthStore } from "@/store/auth-store";
import { motion } from "framer-motion";
import { 
  PlayCircle, 
  Sparkles, 
  UploadCloud, 
  Target, 
  BrainCircuit, 
  BookOpen,
  GraduationCap,
  Globe,
  Trophy,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardHome() {
  const user = useAuthStore((state) => state.user);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!user) return null;

  const firstName = user.fullName?.split(" ")[0] || "Student";
  const initials = user.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "T";
  
  const completionPercent = user.profileCompletion || 0;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative p-6 md:p-10">
      
      {/* HEADER */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-semibold text-[#1B1D35] tracking-tight"
          >
            {greeting}, {firstName}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-500 mt-1"
          >
            Ready to continue your learning journey?
          </motion.p>
        </div>

        <Link href="/dashboard/profile" className="shrink-0 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-[2px] shadow-sm transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#6C5CE7] font-semibold text-lg">{initials}</span>
              )}
            </div>
          </div>
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Profile Summary & Stats */}
        <div className="xl:col-span-1 flex flex-col gap-8">
          
          {/* PROFILE SUMMARY CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E5E1FF] to-transparent rounded-bl-full opacity-50 pointer-events-none" />
            
            <div className="flex items-start gap-4 mb-6 relative">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] p-[2px] shadow-sm">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#6C5CE7] font-semibold text-xl">{initials}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="font-semibold text-lg text-[#1B1D35] leading-tight">{user.fullName}</h3>
                <span className="text-sm font-medium text-[#6C5CE7] uppercase tracking-wider">{user.accountType}</span>
              </div>
            </div>

            <div className="space-y-4 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Academic</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {user.profile?.gradeClass ? `${user.profile.gradeClass} • ` : ""}
                    {user.profile?.board || "Not set"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Medium / Lang</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {user.profile?.medium || "English"} 
                    {user.preference?.preferredLanguage?.name ? ` • ${user.preference.preferredLanguage.name}` : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Learning Goals</span>
                  <span className="text-sm text-gray-900 font-medium truncate max-w-[200px]">
                    {user.profile?.learningInterests?.length ? user.profile.learningInterests.join(", ") : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Profile Completion</span>
                <span className="text-sm font-bold text-[#6C5CE7]">{completionPercent}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: `${completionPercent}%` }} transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]"
                />
              </div>
              {completionPercent < 100 && (
                <Link href="/dashboard/profile" className="block mt-4 text-center text-sm font-medium text-[#6C5CE7] hover:text-[#5A4FCF] transition-colors">
                  Complete your profile →
                </Link>
              )}
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN - Actions & Activity */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* QUICK ACTIONS */}
          <section>
            <h2 className="text-lg font-semibold text-[#1B1D35] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6C5CE7]" /> Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              
              <Link href="/dashboard/learn" className="group p-5 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E5E1FF] text-[#6C5CE7] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Continue Learning</span>
              </Link>

              <Link href="/dashboard/mentor" className="group p-5 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Ask Tatvam AI</span>
              </Link>

              <button className="group p-5 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Upload Document</span>
              </button>

              <Link href="/dashboard/practice" className="group p-5 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Practice Quiz</span>
              </Link>

              <Link href="/dashboard/flashcards" className="group p-5 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Revision</span>
              </Link>

              <Link href="/dashboard/subjects" className="group p-5 bg-white rounded-[20px] shadow-sm border border-gray-100 hover:border-[#6C5CE7]/30 hover:shadow-md transition-all flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900 text-sm">Subjects</span>
              </Link>

            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section>
            <h2 className="text-lg font-semibold text-[#1B1D35] mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" /> Recent Activity
            </h2>
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[200px]">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">No activity yet</h3>
              <p className="text-gray-500 text-sm max-w-sm">When you start reading documents, taking quizzes, or interacting with Tatvam AI, your progress will appear here.</p>
              <Link href="/dashboard/learn" className="mt-6 px-6 py-2.5 bg-[#6C5CE7] text-white font-medium rounded-full hover:bg-[#5A4FCF] transition-colors text-sm shadow-sm">
                Start Learning
              </Link>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
