"use client";

import React, { useState } from "react";
import { useEngineStore, Flashcard } from "@/store/engine-store";
import { Brain, Search, CheckCircle2, XCircle, RotateCcw, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FlashcardReview() {
  const { flashcards, reviewFlashcard } = useEngineStore();
  const [isStudying, setIsStudying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  // Stats
  const dueCards = flashcards.filter(f => !f.nextReviewAt || new Date(f.nextReviewAt) <= new Date());
  const learningCards = flashcards.filter(f => f.status === "learning");
  const masteredCards = flashcards.filter(f => f.status === "review" && f.easeFactor > 2.5);

  const startStudy = () => {
    if (dueCards.length > 0) {
      setIsStudying(true);
      setCurrentIndex(0);
      setShowBack(false);
    }
  };

  const handleReview = (difficulty: "again" | "hard" | "good" | "easy") => {
    const currentCard = dueCards[currentIndex];
    if (currentCard) {
      reviewFlashcard(currentCard.id, difficulty);
    }
    
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowBack(false);
    } else {
      setIsStudying(false); // Session complete
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-[#6C5CE7]" />
          Flashcards
        </h4>
        <span className="text-[11px] font-medium text-[#6C5CE7] bg-[#6C5CE7]/10 px-2 py-0.5 rounded-full">
          {dueCards.length} Due
        </span>
      </div>

      {!isStudying ? (
        <div className="flex flex-col gap-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center justify-center p-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[16px] font-bold text-[#1B1D35]">{dueCards.length}</span>
              <span className="text-[10px] font-semibold text-[#718096] uppercase tracking-wider">Due</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[16px] font-bold text-[#F6AD55]">{learningCards.length}</span>
              <span className="text-[10px] font-semibold text-[#718096] uppercase tracking-wider">Learning</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm">
              <span className="text-[16px] font-bold text-[#48BB78]">{masteredCards.length}</span>
              <span className="text-[10px] font-semibold text-[#718096] uppercase tracking-wider">Mastered</span>
            </div>
          </div>

          {flashcards.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-white/50">
              <Lightbulb className="w-8 h-8 text-[#CBD5E0] mb-2" />
              <p className="text-[13px] font-medium text-[#4A5568]">No flashcards yet</p>
              <p className="text-[11px] text-[#A0AEC0] mt-1">Generate them from your notes or bookmarks.</p>
            </div>
          ) : (
            <button 
              onClick={startStudy}
              disabled={dueCards.length === 0}
              className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] text-white rounded-xl font-bold text-[13px] shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:from-[#A0AEC0] disabled:to-[#CBD5E0] disabled:cursor-not-allowed"
            >
              {dueCards.length > 0 ? "Start Review Session" : "All caught up!"}
            </button>
          )}

          {/* Queue preview */}
          {flashcards.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <h5 className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">Next in queue</h5>
              {flashcards.slice(0, 3).map(f => (
                <div key={f.id} className="p-3 bg-white border border-[#E2E8F0] rounded-lg flex items-center justify-between">
                  <p className="text-[12px] text-[#1B1D35] font-medium truncate w-[70%]">{f.front}</p>
                  <span className="text-[10px] font-semibold text-[#6C5CE7] bg-[#6C5CE7]/10 px-1.5 py-0.5 rounded">
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Active Study Session
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider">
              Card {currentIndex + 1} of {dueCards.length}
            </span>
            <button 
              onClick={() => setIsStudying(false)}
              className="text-[11px] font-bold text-[#6C5CE7] hover:text-[#5A4BDB]"
            >
              End Session
            </button>
          </div>

          <div 
            className="w-full min-h-[200px] perspective-1000 relative cursor-pointer group"
            onClick={() => setShowBack(!showBack)}
          >
            <motion.div
              initial={false}
              animate={{ rotateY: showBack ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="w-full h-full preserve-3d absolute inset-0"
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-[#E2E8F0] group-hover:border-[#6C5CE7]/50 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="absolute top-4 left-4 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">Front</span>
                <p className="text-[16px] font-semibold text-[#1B1D35]">{dueCards[currentIndex]?.front}</p>
                <span className="absolute bottom-4 text-[11px] font-medium text-[#CBD5E0]">Click to flip</span>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#1B1D35] to-[#2D3748] border-2 border-[#1B1D35] rounded-[20px] p-6 shadow-md flex flex-col items-center justify-center text-center rotate-y-180">
                <span className="absolute top-4 left-4 text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">Back</span>
                <p className="text-[15px] font-medium text-white">{dueCards[currentIndex]?.back}</p>
              </div>
            </motion.div>
          </div>

          {/* Spacer for the absolute positioned card */}
          <div className="h-[200px]"></div>

          <AnimatePresence>
            {showBack && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="grid grid-cols-4 gap-2 mt-4"
              >
                <button onClick={(e) => { e.stopPropagation(); handleReview("again"); }} className="flex flex-col items-center gap-1 p-2 bg-[#FFF5F5] text-[#E53E3E] rounded-xl hover:bg-[#FED7D7] transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Again</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleReview("hard"); }} className="flex flex-col items-center gap-1 p-2 bg-[#FFFAF0] text-[#DD6B20] rounded-xl hover:bg-[#FEEBC8] transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Hard</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleReview("good"); }} className="flex flex-col items-center gap-1 p-2 bg-[#EBF8FF] text-[#3182CE] rounded-xl hover:bg-[#BEE3F8] transition-colors">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Good</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleReview("easy"); }} className="flex flex-col items-center gap-1 p-2 bg-[#F0FFF4] text-[#38A169] rounded-xl hover:bg-[#C6F6D5] transition-colors">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Easy</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
