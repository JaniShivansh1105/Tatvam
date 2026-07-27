"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Target, RefreshCw, PenTool } from 'lucide-react';
import { useConversationStore } from '../../store/conversation.store';

export const AIActionBar = () => {
  const { messages, isGenerating, addMessage, setGenerating, updateMessage } = useConversationStore();

  const handleAction = async (actionText: string) => {
    if (isGenerating) return;
    
    addMessage({ id: Date.now().toString(), role: 'user', content: actionText });
    setGenerating(true);

    const assistantId = (Date.now() + 1).toString();
    addMessage({ id: assistantId, role: 'assistant', content: '', isStreaming: true });

    // Mock response for quick actions
    let fakeText = `Sure! Let's ${actionText.toLowerCase()}. Here is a detailed breakdown...`;
    let current = "";
    for (let i = 0; i < fakeText.length; i++) {
      current += fakeText[i];
      updateMessage(assistantId, current, true);
      await new Promise(r => setTimeout(r, 20));
    }
    updateMessage(assistantId, current, false);
    setGenerating(false);
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
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors text-[13px] font-medium"
  >
    {icon} {label}
  </button>
);
