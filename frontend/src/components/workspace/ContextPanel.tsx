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
    <aside className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full text-slate-300">
      <div className="flex border-b border-slate-800 px-2 py-2 gap-1 shrink-0">
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
        <TabButton 
          active={activeRightPanel === 'progress'} 
          onClick={() => setActiveRightPanel('progress')}
          icon={<Zap size={16} />}
          label="Progress"
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
          {activeRightPanel === 'progress' && (
            <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <ProgressView />
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
    className={`flex items-center justify-center gap-2 flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${active ? 'bg-slate-800 text-white' : 'hover:bg-slate-900 text-slate-400'}`}
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
      // Simulate backend pushing retrieved knowledge after a chat completes
      setTimeout(() => {
        workspaceEvents.emit(EVENTS.KnowledgeRetrieved, "Graph Traversal techniques (BFS, DFS) were recently covered in your module. Recalling these visual patterns increases retention by 34%.");
      }, 500);
    });
    
    return () => {
      unsubKnowledge();
      unsubConversation();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen size={14} className="text-indigo-400" /> Current Topic
        </h3>
        <p className="text-sm font-medium text-slate-200">{currentTopic}</p>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Target size={14} className="text-emerald-400" /> Learning Goal
        </h3>
        <p className="text-sm font-medium text-slate-200">{learningGoal}</p>
      </div>

      <AnimatePresence>
        {retrievedContext && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-indigo-950/30 rounded-xl p-4 border border-indigo-500/20 shadow-sm my-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Brain size={14} /> Knowledge Retrieved
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{retrievedContext}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-rose-400" /> Focus Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {weakConcepts.map(concept => (
            <span key={concept} className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-xs font-medium">
              {concept}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity size={14} className="text-amber-400" /> Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.slice(0, 2).map(rec => (
            <div key={rec.id} className="border border-slate-800 bg-slate-950/50 rounded-lg p-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium text-slate-200">{rec.title}</h4>
                {rec.isUrgent && <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />}
              </div>
              <p className="text-xs text-slate-400 mb-2">{rec.description}</p>
              <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
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
        <div className="text-center p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <FileText size={24} className="mx-auto text-slate-600 mb-2" />
          <p className="text-sm text-slate-400">No artifacts generated yet. Ask the AI to create notes or flashcards.</p>
        </div>
      ) : (
        artifacts.map(art => (
          <ArtifactCard key={art.id} artifact={art} />
        ))
      )}
    </div>
  );
};

const ProgressView = () => {
  const { recentMasteryChanges } = useProgressStore();
  
  return (
    <div className="space-y-4">
      <ProgressCard />
      
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm mt-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" /> Recent Mastery
        </h3>
        <div className="space-y-3">
          {recentMasteryChanges.map((change, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-slate-300">{change.concept}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{Math.round(change.masteryLevel * 100)}%</span>
                <span className={`text-xs font-bold ${change.recentDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {change.recentDelta > 0 ? '+' : ''}{Math.round(change.recentDelta * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
