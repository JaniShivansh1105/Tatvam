"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLayout } from "@/context/LayoutContext";
import { Search, BookOpen, BrainCircuit, Dumbbell, Target, Calendar, User, Settings, Mic, Loader2, X, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ACTIONS = [
  { label: "Dashboard", desc: "Overview of your learning progress", icon: <BookOpen className="w-4 h-4" />, href: "/dashboard" },
  { label: "Learn", desc: "Explore the interactive physics Knowledge Map", icon: <BookOpen className="w-4 h-4" />, href: "/dashboard/learn" },
  { label: "AI Mentor", desc: "Ask questions to Tatvam AI Mentor", icon: <BrainCircuit className="w-4 h-4" />, href: "/dashboard/mentor" },
  { label: "Practice Arena", desc: "Sharpen skills with targeted questions", icon: <Dumbbell className="w-4 h-4" />, href: "/dashboard/practice" },
  { label: "Assessments", desc: "Take full-length mock tests", icon: <Target className="w-4 h-4" />, href: "/dashboard/assessments" },
  { label: "Progress", desc: "Track your mastery and analytics", icon: <TrendingUp className="w-4 h-4" />, href: "/dashboard/progress" },
  { label: "Achievements", desc: "View your earned badges and XP", icon: <Trophy className="w-4 h-4" />, href: "/dashboard/achievements" },
  { label: "Study Plans", desc: "Manage your daily & weekly schedule", icon: <Calendar className="w-4 h-4" />, href: "/dashboard/plans" },
  { label: "Profile", desc: "View and update your personal information", icon: <User className="w-4 h-4" />, href: "/dashboard/profile" },
  { label: "Settings", desc: "Customize language, theme & notifications", icon: <Settings className="w-4 h-4" />, href: "/dashboard/settings" },
];

export function CommandPaletteModal() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useLayout();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);

  React.useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { apiClient } = await import("@/lib/api-client");
        const res = await apiClient.get(`/content/search?q=${encodeURIComponent(query)}`);
        if (res.data.success) setSearchResults(res.data.data);
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const [transcriptData, setTranscriptData] = useState("");
  const [recognitionObj, setRecognitionObj] = useState<any>(null);

  const toggleListen = () => {
    if (isListening && recognitionObj) {
      recognitionObj.stop();
      return;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    // Permission flow is implicitly handled by the browser when starting recognition.
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // allow continuous for live transcript
    recognition.interimResults = true;
    
    // Language detection: we can use navigator language or user language setting
    recognition.lang = navigator.language || 'en-US'; 
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscriptData("");
    };
    
    recognition.onresult = (e: any) => {
      let currentTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        currentTranscript += e.results[i][0].transcript;
      }
      setTranscriptData(currentTranscript);
      
      // Auto search if final
      if (e.results[e.results.length - 1].isFinal) {
        const finalStr = currentTranscript.trim();
        setQuery(finalStr);
        setIsListening(false);
        recognition.stop();
      }
    };
    
    recognition.onerror = (e: any) => {
      console.error("Speech error", e);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    setRecognitionObj(recognition);
    recognition.start();
  };

  const cancelListen = () => {
    if (recognitionObj) recognitionObj.abort();
    setIsListening(false);
    setTranscriptData("");
  };

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
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button 
                    onClick={toggleListen}
                    className={`p-1.5 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <kbd className="font-sans border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[11px] bg-[#F8F9FF] text-[#6B7280]">ESC</kbd>
                </div>
              </div>

              {/* Actions List or Voice Overlay */}
              {isListening ? (
                <div className="p-8 flex flex-col items-center justify-center bg-[#F8F9FF] min-h-[300px]">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-[#6C5CE7] rounded-full blur-xl opacity-30 animate-pulse"></div>
                    <div className="w-20 h-20 bg-[#6C5CE7] rounded-full flex items-center justify-center z-10 shadow-lg relative">
                      <Mic className="w-8 h-8 text-white animate-pulse" />
                      {/* Fake waveform rings */}
                      <div className="absolute inset-0 border-2 border-[#6C5CE7] rounded-full animate-ping opacity-50" style={{ animationDuration: '1.5s' }}></div>
                      <div className="absolute inset-0 border-2 border-[#6C5CE7] rounded-full animate-ping opacity-30" style={{ animationDuration: '2s', animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#1B1D35] mb-2">Listening...</h3>
                    <p className="text-[#718096] text-sm h-12 flex items-center justify-center max-w-[400px] overflow-hidden">
                      {transcriptData ? `"${transcriptData}"` : "Speak now to search across Tatvam"}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={toggleListen}
                      className="px-6 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#1B1D35] text-sm font-semibold hover:bg-gray-50 shadow-sm transition-colors"
                    >
                      {transcriptData ? "Search" : "Stop"}
                    </button>
                    <button 
                      onClick={cancelListen}
                      className="px-6 py-2 rounded-full bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-2 bg-[#F8F9FF]/50 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {query && isSearching && (
                    <div className="py-4 flex justify-center text-[#6C5CE7]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                  
                  {query && searchResults.length > 0 && !isSearching && (
                    <>
                      <div className="px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-[#A0AEC0]">
                        Global Search Results
                      </div>
                      {searchResults.map((result, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleSelect(result.href)}
                          className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-[#E2E8F0] hover:shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#E5E1FF] flex items-center justify-center text-[#6C5CE7]">
                            <Search className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[14px] font-medium text-[#1B1D35]">{result.title}</span>
                            <span className="text-[12px] text-[#718096]">{result.type} &middot; {result.desc}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

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
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
