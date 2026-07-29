"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Target, RefreshCw, PenTool } from 'lucide-react';
import { useConversationStore } from '../../store/conversation.store';

export const AIActionBar = ({ onAction }: { onAction?: (text: string) => void }) => {
  const { messages, isGenerating } = useConversationStore();

  const handleAction = (actionText: string) => {
    if (isGenerating || !onAction) return;
    onAction(actionText);
  };

  const lastMessage = messages[messages.length - 1];
  const showActions = !isGenerating && lastMessage?.role === 'assistant';

  return (
    <AnimatePresence>
      {showActions && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="flex flex-wrap gap-2 mt-4 px-2"
        >
          <ActionPill icon={<Sparkles size={14} />} label="Explain Further" onClick={() => handleAction("Explain further in detail")} />
          <ActionPill icon={<BrainCircuit size={14} />} label="Simplify" onClick={() => handleAction("Simplify this for a beginner")} />
          <ActionPill icon={<Target size={14} />} label="Show Example" onClick={() => handleAction("Show me a practical example")} />
          <ActionPill icon={<RefreshCw size={14} />} label="Practice" onClick={() => handleAction("Give me a practice question")} />
          <ActionPill icon={<PenTool size={14} />} label="Create Notes" onClick={() => handleAction("Summarize this into smart notes")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ActionPill = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#6C5CE7]/20 bg-[#F0E6FF] hover:bg-[#6C5CE7] text-[#6C5CE7] hover:text-white transition-colors text-[13px] font-bold"
  >
    {icon} {label}
  </button>
);
