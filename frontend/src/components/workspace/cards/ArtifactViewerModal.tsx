"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ChevronRight, ChevronLeft, RefreshCw, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const ArtifactViewerModal = ({ artifact, onClose }: { artifact: any, onClose: () => void }) => {
  if (!artifact) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#1B1D35]/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#F8F9FF] border border-[#E2E8F0] rounded-[24px] w-full max-w-4xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-white flex justify-between items-center z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0E6FF] to-[#E2D8FF] flex items-center justify-center shrink-0 border border-[#6C5CE7]/20 shadow-sm text-[#6C5CE7]">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1B1D35]">{artifact.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded bg-[#EDF2F7] text-[10px] text-[#4A5568] uppercase tracking-wider font-bold">
                    {artifact.artifactType || 'Resource'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-[#F8F9FF] transition-colors border border-transparent hover:border-[#E2E8F0] hover:shadow-sm">
              <X size={20} />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {renderArtifactContent(artifact)}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const renderArtifactContent = (artifact: any) => {
  const type = artifact.artifactType;
  
  if (type === 'Flashcards' || type === 'Flashcard') {
    return <FlashcardViewer flashcards={artifact.content} />;
  }
  
  if (type === 'Smart Notes' || type === 'Notes') {
    return <MarkdownViewer content={artifact.content} />;
  }

  // Fallback
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-sm">
      <pre className="whitespace-pre-wrap text-sm text-[#4A5568] font-mono bg-[#F8F9FF] p-4 rounded-lg border border-[#E2E8F0]">
        {typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content, null, 2)}
      </pre>
    </div>
  );
};

const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <div className="bg-white rounded-[16px] p-8 border border-[#E2E8F0] shadow-sm max-w-3xl mx-auto prose prose-sm max-w-none prose-headings:text-[#1B1D35] prose-p:text-[#4A5568] prose-p:leading-relaxed prose-pre:bg-[#F8F9FF] prose-pre:text-[#2D3748] prose-pre:border prose-pre:border-[#E2E8F0]">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

const FlashcardViewer = ({ flashcards }: { flashcards: any }) => {
  const cards = Array.isArray(flashcards) ? flashcards : (flashcards?.cards || flashcards?.flashcards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards.length) return <div className="text-center p-8">No flashcards found.</div>;

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((p) => (p === 0 ? cards.length - 1 : p - 1));
    }, 150);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center max-w-2xl mx-auto py-8">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <span className="text-sm font-bold text-[#A0AEC0] uppercase tracking-wider">Flashcards Review</span>
        <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-bold text-[#6C5CE7] shadow-sm">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div 
        className="relative w-full h-[320px] perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-[#E2E8F0] rounded-[24px] p-8 flex flex-col justify-center items-center text-center shadow-lg group-hover:border-[#6C5CE7]/30 transition-colors">
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#F0E6FF] flex items-center justify-center text-[#6C5CE7]">
              <span className="text-xs font-bold">Q</span>
            </div>
            <h3 className="text-2xl font-bold text-[#1B1D35] leading-relaxed">
              {currentCard.question || currentCard.front}
            </h3>
            <p className="absolute bottom-6 text-[11px] font-bold text-[#A0AEC0] uppercase tracking-widest flex items-center gap-1">
              <RefreshCw size={12} className="opacity-50" /> Click to flip
            </p>
          </div>

          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden bg-gradient-to-br from-[#6C5CE7] to-[#5A4BCC] border-2 border-[#5A4BCC] rounded-[24px] p-8 flex flex-col justify-center items-center text-center shadow-xl"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <span className="text-xs font-bold">A</span>
            </div>
            <p className="text-xl font-medium text-white leading-relaxed">
              {currentCard.answer || currentCard.back}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button onClick={prevCard} className="w-12 h-12 rounded-full bg-white border border-[#E2E8F0] text-[#718096] flex items-center justify-center hover:bg-[#F8F9FF] hover:text-[#1B1D35] hover:shadow-sm transition-all">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextCard} className="w-12 h-12 rounded-full bg-[#6C5CE7] text-white flex items-center justify-center hover:bg-[#5A4BCC] hover:shadow-lg hover:shadow-[#6C5CE7]/30 transition-all">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
