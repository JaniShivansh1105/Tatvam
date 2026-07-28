"use client";

import React from 'react';
import { Copy, RefreshCw, Bookmark, Plus, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { workspaceEvents, EVENTS } from '../../lib/workspace-events';

export const MessageActions = ({ messageId, content }: { messageId: string, content: string }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleCreateNotes = () => {
    workspaceEvents.emit(EVENTS.ArtifactCreated, {
      id: `art-${Date.now()}`,
      title: 'Auto-Generated Notes',
      type: 'Smart Notes',
      description: 'Extracted from conversation context.',
      content: content,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex items-center gap-1 mt-2 text-[#718096]"
    >
      <ActionButton icon={<Copy size={14} />} label="Copy" onClick={handleCopy} />
      <ActionButton icon={<RefreshCw size={14} />} label="Regenerate" onClick={() => {}} />
      <ActionButton icon={<Bookmark size={14} />} label="Bookmark" onClick={() => {}} />
      <div className="w-px h-3 bg-[#E2E8F0] mx-1" />
      <ActionButton icon={<FileText size={14} />} label="Save as Notes" onClick={handleCreateNotes} />
      <ActionButton icon={<Zap size={14} />} label="Generate Quiz" onClick={() => {}} />
    </motion.div>
  );
};

const ActionButton = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#EDF2F7] hover:text-[#4A5568] transition-colors text-[11px] font-bold"
    title={label}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);
