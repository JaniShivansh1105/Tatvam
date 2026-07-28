"use client";

import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useProgressStore } from '../../store/progress.store';
import { useArtifactStore } from '../../store/artifact.store';
import { useRecommendationStore } from '../../store/recommendation.store';
import { Brain, FileText, Zap, Target, BookOpen, Activity, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ArtifactCard } from './cards/ArtifactCard';
import { ProgressCard } from './cards/ProgressCard';
import { motion, AnimatePresence } from 'framer-motion';
import { workspaceEvents, EVENTS } from '../../lib/workspace-events';

export const ContextPanel = () => {
  const { isRightPanelOpen, activeRightPanel, setActiveRightPanel } = useWorkspaceStore();

  if (!isRightPanelOpen) return null;

  return (
    <aside className="w-full bg-[#F8F9FF] flex flex-col h-full text-[#4A5568] z-10">
      <div className="flex border-b border-[#E2E8F0] px-2 py-2 gap-1 shrink-0 bg-white">
        <TabButton 
          active={activeRightPanel === 'context'} 
          onClick={() => setActiveRightPanel('context')}
          icon={<Brain size={16} />}
          label="Context"
        />
        <TabButton 
          active={activeRightPanel === 'artifacts'} 
          onClick={() => setActiveRightPanel('artifacts')}
          icon={<FileText size={16} />}
          label="Artifacts"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeRightPanel === 'context' && (
            <motion.div key="context" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <ContextView />
            </motion.div>
          )}
          {activeRightPanel === 'artifacts' && (
            <motion.div key="artifacts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <ArtifactsView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md text-[13px] font-bold transition-all ${active ? 'bg-[#F0E6FF] text-[#6C5CE7] shadow-sm' : 'hover:bg-[#EDF2F7] text-[#718096]'}`}
  >
    {icon}
    {label}
  </button>
);

const ContextView = () => {
  const { currentTopic, learningGoal, weakConcepts } = useProgressStore();
  const { recommendations } = useRecommendationStore();
  const [retrievedContext, setRetrievedContext] = useState<string | null>(null);

  useEffect(() => {
    const unsubKnowledge = workspaceEvents.subscribe(EVENTS.KnowledgeRetrieved, (payload) => {
      setRetrievedContext(payload);
      setTimeout(() => setRetrievedContext(null), 10000); // Clear after 10s for demo
    });
    
    const unsubConversation = workspaceEvents.subscribe(EVENTS.ConversationCompleted, (payload) => {
      // In a real implementation, the backend would either include context in the chat response
      // or push it via a separate SSE channel.
    });
    
    return () => {
      unsubKnowledge();
      unsubConversation();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[16px] p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen size={14} className="text-[#6C5CE7]" /> Current Topic
        </h3>
        <p className="text-sm font-bold text-[#1B1D35]">{currentTopic}</p>
      </div>

      <div className="bg-white rounded-[16px] p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Target size={14} className="text-[#38A169]" /> Learning Goal
        </h3>
        <p className="text-sm font-bold text-[#1B1D35]">{learningGoal}</p>
      </div>

      <AnimatePresence>
        {retrievedContext && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-[#F0E6FF] rounded-[16px] p-4 border border-[#6C5CE7]/20 shadow-sm my-4">
              <h3 className="text-xs font-bold text-[#6C5CE7] uppercase tracking-wider mb-2 flex items-center gap-2">
                <Brain size={14} /> Knowledge Retrieved
              </h3>
              <p className="text-xs text-[#4A5568] leading-relaxed font-medium">{retrievedContext}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[16px] p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-[#E53E3E]" /> Focus Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {weakConcepts.map(concept => (
            <span key={concept} className="px-2 py-1 bg-[#FFF5F5] text-[#E53E3E] border border-[#FED7D7] rounded-md text-[11px] font-bold">
              {concept}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[16px] p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity size={14} className="text-[#D69E2E]" /> Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.slice(0, 2).map(rec => (
            <div key={rec.id} className="border border-[#E2E8F0] bg-[#F8F9FF] rounded-xl p-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[13px] font-bold text-[#1B1D35]">{rec.title}</h4>
                {rec.isUrgent && <div className="w-2 h-2 rounded-full bg-[#D69E2E] mt-1.5" />}
              </div>
              <p className="text-xs text-[#718096] mb-2">{rec.description}</p>
              <button className="text-xs font-bold text-[#6C5CE7] hover:text-[#8B7CF6] flex items-center gap-1 transition-colors">
                {rec.actionLabel} <ArrowUpRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

const ArtifactsView = () => {
  const { artifacts, addArtifact } = useArtifactStore();
  
  useEffect(() => {
    const unsubArtifacts = workspaceEvents.subscribe(EVENTS.ArtifactCreated, (payload) => {
      // Don't add duplicate if it somehow fires twice
      const exists = useArtifactStore.getState().artifacts.some(a => a.id === payload.id);
      if (!exists) {
        addArtifact(payload);
      }
    });
    return () => unsubArtifacts();
  }, [addArtifact]);
  
  return (
    <div className="space-y-4">
      {artifacts.length === 0 ? (
        <div className="text-center p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm">
          <FileText size={24} className="mx-auto text-[#A0AEC0] mb-2" />
          <p className="text-sm font-medium text-[#718096]">No artifacts generated yet. Ask the AI to create notes or flashcards.</p>
        </div>
      ) : (
        artifacts.map(art => (
          <ArtifactCard key={art.id} artifact={art} />
        ))
      )}
    </div>
  );
};
