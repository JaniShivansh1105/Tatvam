"use client";

import React, { useState } from 'react';
import { Copy, RefreshCw, Bookmark, Plus, FileText, Zap, Target, BookOpen, PenTool, Lightbulb, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { workspaceEvents, EVENTS } from '../../lib/workspace-events';
import { apiClient } from '../../lib/api-client';
import { toast } from 'react-hot-toast';

import { useConversationStore } from '../../store/conversation.store';

export const MessageActions = ({ messageId, content, onAction }: { messageId: string, content: string, onAction?: (text: string) => void }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleAction = async (action: string, prompt: string, artifactType?: string) => {
    if (loadingAction || !onAction) return;
    setLoadingAction(action);
    
    try {
      const sessionId = useConversationStore.getState().sessionId;
      if (artifactType) {
        toast.loading(`Generating ${artifactType}...`, { id: 'artifact-gen' });
        const res = await apiClient.post('/ai/mentor/artifact', {
          artifactType,
          requestContent: content
        });
        
        await apiClient.post('/workspace/artifacts', {
          title: res.data.data.title || `Auto-Generated ${artifactType}`,
          artifactType,
          description: res.data.data.description || 'Generated from AI interaction',
          content: res.data.data.content,
          sourceConversationId: sessionId
        });
        
        workspaceEvents.emit(EVENTS.ArtifactCreated, null);
        toast.success(`${artifactType} saved successfully!`, { id: 'artifact-gen' });
      } else {
        onAction(prompt);
      }
    } catch (e) {
      toast.error('Action failed. Please try again.', { id: 'artifact-gen' });
    } finally {
      setLoadingAction(null);
    }
  };

  const handleBookmark = async () => {
    try {
      setLoadingAction('Bookmark');
      const sessionId = useConversationStore.getState().sessionId;
      await apiClient.post('/workspace/artifacts', {
        title: 'Saved Conversation Bookmark',
        artifactType: 'Bookmarks',
        description: content.substring(0, 50) + '...',
        content: content,
        sourceConversationId: sessionId
      });
      workspaceEvents.emit(EVENTS.ArtifactCreated, null);
      toast.success('⭐ Added to Bookmarks');
    } catch (e) {
      toast.error('Failed to add bookmark');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex flex-wrap items-center gap-1 mt-2 text-[#718096]"
    >
      <ActionButton icon={<Copy size={14} />} label="Copy" onClick={handleCopy} disabled={!!loadingAction} />
      <ActionButton icon={<RefreshCw size={14} />} label="Regenerate" onClick={() => onAction && onAction("Please regenerate the previous response.")} disabled={!!loadingAction} />
      <ActionButton icon={<Bookmark size={14} />} label="Bookmark" onClick={handleBookmark} disabled={!!loadingAction} isLoading={loadingAction === 'Bookmark'} />
      
      <div className="w-px h-3 bg-[#E2E8F0] mx-1" />
      
      <ActionButton icon={<Lightbulb size={14} />} label="Explain Further" onClick={() => handleAction('Explain', 'Can you explain the previous concept further in more detail?')} disabled={!!loadingAction} />
      <ActionButton icon={<ChevronRight size={14} />} label="Simplify" onClick={() => handleAction('Simplify', 'Can you simplify the previous explanation for me?')} disabled={!!loadingAction} />
      <ActionButton icon={<BookOpen size={14} />} label="Show Example" onClick={() => handleAction('Example', 'Can you provide a concrete example of the previous concept?')} disabled={!!loadingAction} />
      
      <div className="w-px h-3 bg-[#E2E8F0] mx-1" />

      <ActionButton icon={<Target size={14} />} label="Practice" onClick={() => handleAction('Practice', '', 'Practice Sets')} disabled={!!loadingAction} isLoading={loadingAction === 'Practice'} />
      <ActionButton icon={<FileText size={14} />} label="Notes" onClick={() => handleAction('Notes', '', 'Notes')} disabled={!!loadingAction} isLoading={loadingAction === 'Notes'} />
      <ActionButton icon={<Zap size={14} />} label="Quiz" onClick={() => handleAction('Quiz', '', 'Quizzes')} disabled={!!loadingAction} isLoading={loadingAction === 'Quiz'} />
    </motion.div>
  );
};

const ActionButton = ({ icon, label, onClick, disabled, isLoading }: any) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-[#EDF2F7] hover:text-[#4A5568] transition-colors text-[11px] font-bold disabled:opacity-50"
    title={label}
  >
    {isLoading ? <RefreshCw size={14} className="animate-spin text-[#6C5CE7]" /> : icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);
