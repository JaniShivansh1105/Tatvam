"use client";

import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../store/workspace.store';
import { useProgressStore } from '../../store/progress.store';
import { useArtifactStore } from '../../store/artifact.store';
import { useRecommendationStore } from '../../store/recommendation.store';
import { Brain, FileText, Zap, Target, BookOpen, Activity, AlertCircle, ArrowUpRight, MessageSquare, Clock, Plus, Search, MoreVertical, Edit2, Trash2, Pin, Star, CheckSquare } from 'lucide-react';
import { ArtifactCard } from './cards/ArtifactCard';
import { ProgressCard } from './cards/ProgressCard';
import { motion, AnimatePresence } from 'framer-motion';
import { workspaceEvents, EVENTS } from '../../lib/workspace-events';
import { useConversationStore } from '../../store/conversation.store';
import { apiClient } from '../../lib/api-client';
import toast from 'react-hot-toast';

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
          active={activeRightPanel === 'history'} 
          onClick={() => setActiveRightPanel('history')}
          icon={<MessageSquare size={16} />}
          label="History"
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
          {activeRightPanel === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              <HistoryView />
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
  const { currentTopic, learningGoal } = useProgressStore();
  const [retrievedContext, setRetrievedContext] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<{term: string, definition: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await apiClient.get('/knowledge/context');
        if (res.data?.data) {
          setConcepts(res.data.data.concepts || []);
          setDefinitions(res.data.data.definitions || []);
        }
      } catch (err) {
        console.error("Failed to fetch knowledge context", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();

    const unsubKnowledge = workspaceEvents.subscribe(EVENTS.KnowledgeRetrieved, (payload) => {
      setRetrievedContext(payload);
      setTimeout(() => setRetrievedContext(null), 10000); // Clear after 10s for demo
    });
    
    return () => {
      unsubKnowledge();
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
          <Brain size={14} className="text-[#38A169]" /> Extracted Concepts
        </h3>
        {loading ? (
          <div className="h-8 bg-[#EDF2F7] rounded animate-pulse w-full"></div>
        ) : concepts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {concepts.map(concept => (
              <span key={concept} className="px-2 py-1 bg-[#F0E6FF] text-[#6C5CE7] border border-[#D6BCFA] rounded-md text-[11px] font-bold">
                {concept}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#718096]">No concepts extracted yet.</p>
        )}
      </div>

      <div className="bg-white rounded-[16px] p-4 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-3 flex items-center gap-2">
          <FileText size={14} className="text-[#D69E2E]" /> Key Definitions
        </h3>
        <div className="space-y-3">
          {loading ? (
             <div className="space-y-2">
               <div className="h-10 bg-[#EDF2F7] rounded animate-pulse w-full"></div>
               <div className="h-10 bg-[#EDF2F7] rounded animate-pulse w-full"></div>
             </div>
          ) : definitions.length > 0 ? definitions.map((def, idx) => (
            <div key={idx} className="border border-[#E2E8F0] bg-[#F8F9FF] rounded-xl p-3">
              <h4 className="text-[13px] font-bold text-[#1B1D35] mb-1">{def.term}</h4>
              <p className="text-xs text-[#718096]">{def.definition}</p>
            </div>
          )) : (
            <p className="text-xs text-[#718096]">Upload documents to generate definitions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CATEGORIES = [
  { id: 'Bookmarks', icon: Star, color: 'text-yellow-500' },
  { id: 'Notes', icon: FileText, color: 'text-blue-500' },
  { id: 'Flashcards', icon: Zap, color: 'text-purple-500' },
  { id: 'Quizzes', icon: CheckSquare, color: 'text-green-500' },
  { id: 'Revision Sheets', icon: BookOpen, color: 'text-indigo-500' },
  { id: 'Cheat Sheets', icon: FileText, color: 'text-pink-500' },
  { id: 'Practice Sets', icon: Target, color: 'text-red-500' },
];

const ArtifactsView = () => {
  const { artifacts, fetchArtifacts } = useArtifactStore();
  
  useEffect(() => {
    fetchArtifacts();
    const unsub = workspaceEvents.subscribe(EVENTS.ArtifactCreated, () => fetchArtifacts());
    return () => unsub();
  }, [fetchArtifacts]);

  const categorized = CATEGORIES.map(cat => ({
    ...cat,
    items: artifacts.filter(a => a.artifactType === cat.id || (a.artifactType === 'Smart Notes' && cat.id === 'Notes'))
  })).filter(cat => cat.items.length > 0);
  
  return (
    <div className="space-y-6">
      {categorized.length === 0 ? (
        <div className="text-center p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm">
          <FileText size={24} className="mx-auto text-[#A0AEC0] mb-2" />
          <p className="text-sm font-medium text-[#718096] mb-2">Your AI Library is empty.</p>
          <p className="text-[11px] text-[#A0AEC0]">Generate Notes, Flashcards, Quizzes or Bookmarks. Everything will automatically appear here.</p>
        </div>
      ) : (
        categorized.map(category => (
          <div key={category.id} className="space-y-3">
            <h4 className="text-xs font-bold text-[#4A5568] flex items-center gap-2 uppercase tracking-wider">
              <category.icon size={14} className={category.color} />
              {category.id} <span className="text-[#A0AEC0]">({category.items.length})</span>
            </h4>
            <div className="space-y-2">
              {category.items.map(art => (
                <ArtifactCard key={art.id} artifact={art} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const HistoryView = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  
  const { sessionId: currentSessionId, setSessionId, clearMessages, addMessage, createNewSession } = useConversationStore();

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/ai/mentor/history');
      setSessions(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const unsub = workspaceEvents.subscribe(EVENTS.ConversationCompleted, () => fetchHistory());
    return () => unsub();
  }, []);

  const handleSelectSession = (session: any) => {
    clearMessages();
    setSessionId(session.id);
    session.messages.forEach((m: any) => {
      addMessage({ id: m.id, role: m.role as any, content: m.content });
    });
  };

  const handleNewChat = () => {
    createNewSession();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await apiClient.delete(`/ai/mentor/sessions/${id}`);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) createNewSession();
      toast.success("Conversation deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
    setMenuOpenFor(null);
  };

  const handlePin = async (e: React.MouseEvent, id: string, isPinned: boolean) => {
    e.stopPropagation();
    try {
      await apiClient.patch(`/ai/mentor/sessions/${id}`, { isPinned: !isPinned });
      setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !isPinned } : s));
    } catch (err) {
      toast.error("Failed to pin");
    }
    setMenuOpenFor(null);
  };

  const handleRename = async (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    const newTitle = prompt("Enter new title:", currentTitle);
    if (newTitle && newTitle.trim() !== "") {
      try {
        await apiClient.patch(`/ai/mentor/sessions/${id}`, { title: newTitle.substring(0, 40) });
        setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle.substring(0, 40) } : s));
      } catch (err) {
        toast.error("Failed to rename");
      }
    }
    setMenuOpenFor(null);
  };

  const filteredSessions = sessions.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (s.title || "").toLowerCase().includes(q) || 
           (s.isPinned && "pinned".includes(q)) || 
           new Date(s.updatedAt).toLocaleDateString().includes(q);
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const pinnedSessions = filteredSessions.filter(s => s.isPinned);
  const unpinnedSessions = filteredSessions.filter(s => !s.isPinned);

  if (loading) return <div className="p-4 text-center text-sm text-[#718096]">Loading history...</div>;

  return (
    <div className="space-y-4">
      <button 
        onClick={handleNewChat}
        className="w-full flex items-center justify-center gap-2 bg-[#6C5CE7] hover:bg-[#5A4BCC] text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
      >
        <Plus size={16} /> New Chat
      </button>

      {sessions.length > 0 && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
          <input 
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="text-center p-6 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm">
          <Clock size={24} className="mx-auto text-[#A0AEC0] mb-2" />
          <p className="text-sm font-medium text-[#718096] mb-2">Start your first AI conversation.</p>
          <p className="text-[11px] text-[#A0AEC0]">Ask any academic question to begin learning.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pinnedSessions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider px-1 flex items-center gap-1">
                <Pin size={12} /> Pinned
              </h4>
              {pinnedSessions.map(session => <SessionCard key={session.id} session={session} isActive={session.id === currentSessionId} handleSelect={handleSelectSession} handleRename={handleRename} handlePin={handlePin} handleDelete={handleDelete} menuOpenFor={menuOpenFor} setMenuOpenFor={setMenuOpenFor} />)}
            </div>
          )}
          
          {unpinnedSessions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider px-1">Recent</h4>
              {unpinnedSessions.map(session => <SessionCard key={session.id} session={session} isActive={session.id === currentSessionId} handleSelect={handleSelectSession} handleRename={handleRename} handlePin={handlePin} handleDelete={handleDelete} menuOpenFor={menuOpenFor} setMenuOpenFor={setMenuOpenFor} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SessionCard = ({ session, isActive, handleSelect, handleRename, handlePin, handleDelete, menuOpenFor, setMenuOpenFor }: any) => {
  return (
    <div 
      onClick={() => handleSelect(session)}
      className={`relative w-full text-left bg-white border ${isActive ? 'border-[#6C5CE7] bg-[#F0E6FF]/50 border-l-4' : 'border-[#E2E8F0]'} hover:border-[#6C5CE7] hover:shadow-sm transition-all rounded-[12px] p-3 flex justify-between items-start group cursor-pointer`}
    >
      <div className="flex flex-col gap-1 pr-6 overflow-hidden">
        <h4 className={`text-[13px] font-bold truncate ${isActive ? 'text-[#6C5CE7]' : 'text-[#1B1D35]'}`}>{session.title || "Conversation"}</h4>
        <span className="text-[11px] text-[#A0AEC0]">{new Date(session.updatedAt).toLocaleDateString()}</span>
      </div>
      
      <div className="absolute right-2 top-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setMenuOpenFor(menuOpenFor === session.id ? null : session.id); }}
          className={`p-1 rounded-md text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-[#F8F9FF] transition-colors ${menuOpenFor === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <MoreVertical size={16} />
        </button>
        
        {menuOpenFor === session.id && (
          <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1 z-20 overflow-hidden">
            <button onClick={(e) => handleRename(e, session.id, session.title)} className="w-full text-left px-3 py-2 text-xs font-medium text-[#4A5568] hover:bg-[#F8F9FF] flex items-center gap-2">
              <Edit2 size={12} /> Rename
            </button>
            <button onClick={(e) => handlePin(e, session.id, session.isPinned)} className="w-full text-left px-3 py-2 text-xs font-medium text-[#4A5568] hover:bg-[#F8F9FF] flex items-center gap-2">
              <Pin size={12} /> {session.isPinned ? "Unpin" : "Pin"}
            </button>
            <button onClick={(e) => handleDelete(e, session.id)} className="w-full text-left px-3 py-2 text-xs font-medium text-[#E53E3E] hover:bg-[#FFF5F5] flex items-center gap-2">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
