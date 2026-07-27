"use client";

import React from 'react';
import { useViewerStore } from '../../../store/viewer.store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Search as SearchIcon, Maximize, FileText, BrainCircuit, PenTool, Bookmark, MessageSquare } from 'lucide-react';
import { useConversationStore } from '../../../store/conversation.store';
import { workspaceEvents, EVENTS } from '../../../lib/workspace-events';

export const DocumentViewer = () => {
  const { isOpen, activeDocument, closeViewer, zoomLevel, setZoomLevel } = useViewerStore();
  const { addMessage, setGenerating } = useConversationStore();

  if (!isOpen || !activeDocument) return null;

  const handleAIAction = (action: string) => {
    // Navigate to conversation panel logic or just emit an event
    closeViewer();
    // In a real app we might switch routing back to /workspace to show the conversation
    // but for now, we just populate the conversation store
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: `${action} based on ${activeDocument.title}`
    });
    setGenerating(true);
    
    // Simulate generation
    setTimeout(() => {
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'd be happy to ${action.toLowerCase()} based on **${activeDocument.title}**.`
      });
      setGenerating(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center shrink-0">
              <FileText className="text-indigo-400" size={16} />
            </div>
            <h2 className="text-sm font-semibold text-white truncate">{activeDocument.title}</h2>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              {activeDocument.type}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 shrink-0">
            <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><SearchIcon size={16} /></button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><ZoomOut size={16} /></button>
            <span className="text-xs text-slate-400 w-12 text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><ZoomIn size={16} /></button>
            <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><Maximize size={16} /></button>
            <div className="w-px h-4 bg-slate-800 mx-1" />
            <button onClick={closeViewer} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"><X size={18} /></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Viewer Area */}
          <main className="flex-1 bg-[#0f111a] overflow-auto flex justify-center p-8 custom-scrollbar">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="bg-white w-full max-w-4xl shadow-2xl rounded-sm min-h-[1056px] p-12"
            >
              <h1 className="text-3xl font-bold text-slate-900 mb-6">{activeDocument.title.replace('.pdf', '')}</h1>
              <p className="text-slate-600 leading-relaxed mb-4">
                This is a simulated document viewer rendering the content for {activeDocument.title}.
                In a full implementation, this area mounts PDF.js, a Markdown renderer, or a canvas for image rendering.
              </p>
              <div className="h-4 bg-indigo-50 w-full mb-2 rounded" />
              <div className="h-4 bg-indigo-50 w-5/6 mb-2 rounded" />
              <div className="h-4 bg-indigo-50 w-4/6 mb-8 rounded" />
              
              <h2 className="text-xl font-semibold text-slate-800 mb-4">1. Introduction</h2>
              <div className="h-4 bg-slate-100 w-full mb-2 rounded" />
              <div className="h-4 bg-slate-100 w-full mb-2 rounded" />
              <div className="h-4 bg-slate-100 w-full mb-2 rounded" />
              <div className="h-4 bg-slate-100 w-3/4 mb-2 rounded" />
            </motion.div>
          </main>

          {/* AI Sidebar */}
          <aside className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit size={14} className="text-indigo-400" /> AI Actions
              </h3>
            </div>
            
            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
              <ActionButton icon={<MessageSquare size={16} />} label="Explain Concept" onClick={() => handleAIAction('Explain the main concepts')} />
              <ActionButton icon={<FileText size={16} />} label="Summarize" onClick={() => handleAIAction('Summarize this document')} />
              <ActionButton icon={<PenTool size={16} />} label="Generate Notes" onClick={() => handleAIAction('Generate smart notes')} />
              <ActionButton icon={<BrainCircuit size={16} />} label="Generate Quiz" onClick={() => handleAIAction('Generate a practice quiz')} />
              <div className="my-4 border-t border-slate-800" />
              <ActionButton icon={<Bookmark size={16} />} label="Bookmark Page" onClick={() => {}} />
            </div>
          </aside>
        </div>
      </div>
    </AnimatePresence>
  );
};

const ActionButton = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-all text-left"
  >
    <div className="text-indigo-400">{icon}</div>
    {label}
  </button>
);
