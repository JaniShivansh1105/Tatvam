"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { useKnowledgeStore } from '../../../store/knowledge.store';
import { useUploadStore } from '../../../store/upload.store';
import { DocumentCard } from '../../../components/workspace/knowledge/DocumentCard';
import { UploadModal } from '../../../components/workspace/knowledge/UploadModal';
import { KnowledgeSearch } from '../../../components/workspace/knowledge/KnowledgeSearch';
import dynamic from 'next/dynamic';

const DocumentViewer = dynamic(
  () => import('../../../components/workspace/knowledge/DocumentViewer').then((mod) => mod.DocumentViewer),
  { ssr: false }
);

export default function KnowledgePageContent() {
  const { documents, folders, activeFolderId, setActiveFolder } = useKnowledgeStore();
  const { setUploadModalOpen } = useUploadStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
          <h1 className="text-[19px] font-semibold text-[#1B1D35] tracking-tight">Knowledge Library</h1>
          <div className="h-6 w-px bg-[#E2E8F0]" />
          <nav className="flex gap-1">
            <FolderTab name="All Documents" active={activeFolderId === null} onClick={() => setActiveFolder(null)} />
            {folders.map(f => (
              <FolderTab key={f.id} name={f.name} active={activeFolderId === f.id} onClick={() => setActiveFolder(f.id)} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#718096] hover:text-[#1B1D35] hover:border-[#CBD5E0] transition-colors text-sm shadow-sm"
          >
            <Search size={14} /> Search
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#EDF2F7] text-[10px] ml-2 font-bold text-[#A0AEC0]">⌘K</kbd>
          </button>
          
          <div className="flex bg-white p-0.5 rounded-lg border border-[#E2E8F0] shadow-sm">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-[#F8F9FF] text-[#6C5CE7] shadow-sm' : 'text-[#A0AEC0] hover:text-[#4A5568]'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-[#F8F9FF] text-[#6C5CE7] shadow-sm' : 'text-[#A0AEC0] hover:text-[#4A5568]'}`}>
              <List size={16} />
            </button>
          </div>

          <button 
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF6] hover:shadow-lg hover:shadow-[#6C5CE7]/30 text-white transition-all text-sm font-bold"
          >
            <Plus size={16} /> Upload
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#F8F9FF]">
        {isLoading ? (
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`bg-white border border-[#E2E8F0] rounded-[16px] animate-pulse ${viewMode === 'grid' ? 'h-48' : 'h-20'}`} />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-2 border border-[#E2E8F0] shadow-sm">
               <Plus className="text-[#A0AEC0]" size={32} />
             </div>
             <h2 className="text-[17px] font-bold text-[#1B1D35]">Your library is empty</h2>
             <p className="text-[13px] text-[#718096]">Upload PDFs, documents, or images to create your personal AI knowledge base.</p>
          </div>
        ) : (
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {documents.map(doc => (
              <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
            ))}
          </div>
        )}
      </main>

      <UploadModal />
      <DocumentViewer />
      {isSearchOpen && <KnowledgeSearch onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
}

const FolderTab = ({ name, active, onClick }: { name: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${active ? 'bg-white text-[#6C5CE7] shadow-sm border border-[#E2E8F0]' : 'text-[#718096] hover:text-[#4A5568] hover:bg-white/50 border border-transparent'}`}
  >
    {name}
  </button>
);
