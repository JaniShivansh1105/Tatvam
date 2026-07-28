"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid, List, FileText, Zap, Brain, BookMarked, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_RESOURCES = [
  { id: 1, title: 'Graph Theory Fundamentals', type: 'Notes', lastModified: '2026-07-27', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 2, title: 'Dynamic Programming Patterns', type: 'Flashcards', lastModified: '2026-07-26', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 3, title: 'System Design Basics', type: 'Revision', lastModified: '2026-07-25', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 4, title: 'Database Indexing Quiz', type: 'Quiz', lastModified: '2026-07-24', icon: BookMarked, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

export default function ResourcesPageContent() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FF] text-[#4A5568] relative overflow-hidden rounded-[24px]">
      
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-[#E2E8F0] flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-[19px] font-semibold text-[#1B1D35] tracking-tight">Study Resources</h1>
          <div className="h-6 w-px bg-[#E2E8F0]" />
          <nav className="flex gap-1">
            <ResourceTab name="All" active={true} />
            <ResourceTab name="Notes" active={false} />
            <ResourceTab name="Flashcards" active={false} />
            <ResourceTab name="Quizzes" active={false} />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#718096] hover:text-[#1B1D35] hover:border-[#CBD5E0] transition-colors text-sm shadow-sm">
            <Search size={14} /> Search
          </button>
          
          <div className="flex bg-white p-0.5 rounded-lg border border-[#E2E8F0] shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[#F8F9FF] text-[#6C5CE7] shadow-sm' : 'text-[#A0AEC0] hover:text-[#4A5568]'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[#F8F9FF] text-[#6C5CE7] shadow-sm' : 'text-[#A0AEC0] hover:text-[#4A5568]'}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#F8F9FF]">
        <div className="mb-6">
          <h2 className="text-[15px] font-bold text-[#1B1D35] flex items-center gap-2 mb-4">
            <Clock size={16} className="text-[#6C5CE7]" /> Recent
          </h2>
          
          {isLoading ? (
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`bg-white border border-[#E2E8F0] rounded-[16px] animate-pulse ${viewMode === 'grid' ? 'h-40' : 'h-16'}`} />
              ))}
            </div>
          ) : (
            <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {MOCK_RESOURCES.map(res => (
                <ResourceCard key={res.id} resource={res} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}

const ResourceTab = ({ name, active }: { name: string, active: boolean }) => (
  <button 
    className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${active ? 'bg-white text-[#6C5CE7] shadow-sm border border-[#E2E8F0]' : 'text-[#718096] hover:text-[#4A5568] hover:bg-white/50 border border-transparent'}`}
  >
    {name}
  </button>
);

const ResourceCard = ({ resource, viewMode }: { resource: any, viewMode: 'grid' | 'list' }) => {
  const isGrid = viewMode === 'grid';
  const Icon = resource.icon;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-white border border-[#E2E8F0] rounded-[16px] hover:border-[#6C5CE7]/40 hover:shadow-md transition-all cursor-pointer overflow-hidden ${isGrid ? 'p-4 flex flex-col h-40' : 'p-3 flex items-center gap-4'}`}
    >
      <div className={`flex items-start ${isGrid ? 'flex-col gap-3 flex-1' : 'gap-4 w-full items-center'}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#E2E8F0] ${resource.bg} ${resource.color}`}>
          <Icon size={24} />
        </div>
        
        <div className={`flex-1 min-w-0 ${isGrid ? 'w-full' : 'flex items-center justify-between w-full'}`}>
          <div>
            <h3 className="font-semibold text-[#1B1D35] truncate group-hover:text-[#6C5CE7] transition-colors">
              {resource.title}
            </h3>
            {isGrid && <p className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mt-1">{resource.type}</p>}
          </div>
          
          {!isGrid && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider px-2 py-1 bg-[#F8F9FF] rounded">{resource.type}</span>
              <span className="text-xs text-[#718096]">{resource.lastModified}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
