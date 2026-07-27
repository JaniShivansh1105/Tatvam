"use client";

import React, { useState, useEffect } from 'react';
import { useSearchStore } from '../../../store/search.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, FileText, ArrowRight, BrainCircuit } from 'lucide-react';
import { useViewerStore } from '../../../store/viewer.store';
import { useKnowledgeStore } from '../../../store/knowledge.store';

export const KnowledgeSearch = ({ onClose }: { onClose: () => void }) => {
  const { query, setQuery, isSearching, setSearching, results, setResults, recentSearches, addRecentSearch } = useSearchStore();
  const { documents } = useKnowledgeStore();
  const { openDocument } = useViewerStore();

  useEffect(() => {
    // Focus input on mount
    const input = document.getElementById('knowledge-search-input');
    if (input) input.focus();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearching(true);
    addRecentSearch(query);

    // Simulate semantic search via backend API
    setTimeout(() => {
      setResults([
        {
          id: 'res-1',
          documentId: 'doc-1',
          documentTitle: 'Physics Chapter 1 - Kinematics.pdf',
          matchedText: '...the velocity of an object is the rate of change of its position with respect to a frame of reference...',
          relevanceScore: 0.95
        },
        {
          id: 'res-2',
          documentId: 'doc-1',
          documentTitle: 'Physics Chapter 1 - Kinematics.pdf',
          matchedText: '...acceleration is defined as the rate at which an object changes its velocity...',
          relevanceScore: 0.88
        }
      ]);
      setSearching(false);
    }, 800);
  };

  const handleResultClick = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      onClose();
      openDocument(doc);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center p-4 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh]"
        >
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
            <Search className="text-slate-400 shrink-0" size={20} />
            <form onSubmit={handleSearch} className="flex-1">
              <input
                id="knowledge-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your knowledge base or search for concepts..."
                className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:outline-none focus:ring-0 text-lg"
              />
            </form>
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white rounded">
                <X size={16} />
              </button>
            )}
            <div className="w-px h-6 bg-slate-800 mx-2" />
            <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors">
              ESC
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {isSearching ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
                <BrainCircuit size={32} className="animate-pulse text-indigo-500" />
                <p className="text-sm">Searching semantic vectors...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2 space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">Semantic Matches</h3>
                {results.map(res => (
                  <button 
                    key={res.id}
                    onClick={() => handleResultClick(res.documentId)}
                    className="w-full text-left p-4 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium">
                        <FileText size={14} /> {res.documentTitle}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {Math.round(res.relevanceScore * 100)}% MATCH
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                      {res.matchedText}
                    </p>
                  </button>
                ))}
              </div>
            ) : query && !isSearching ? (
              <div className="p-12 text-center text-slate-500">
                <p>No semantic matches found for "{query}".</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {recentSearches.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-2">
                      <Clock size={12} /> Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((s, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setQuery(s); setTimeout(() => handleSearch({ preventDefault: () => {} } as any), 0); }}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors text-sm group"
                        >
                          <span className="flex items-center gap-3"><Search size={14} className="text-slate-500" /> {s}</span>
                          <ArrowRight size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2 flex items-center gap-2">
                      <BrainCircuit size={12} /> Suggested
                    </h3>
                    <div className="flex flex-wrap gap-2 px-2">
                      <SuggestedPill text="Summarize Kinematics" onClick={() => setQuery("Summarize Kinematics")} />
                      <SuggestedPill text="What is Big O notation?" onClick={() => setQuery("What is Big O notation?")} />
                      <SuggestedPill text="Compare BFS and DFS" onClick={() => setQuery("Compare BFS and DFS")} />
                    </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SuggestedPill = ({ text, onClick }: { text: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors"
  >
    {text}
  </button>
);
