"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import { useKnowledgeStore } from '../../../store/knowledge.store';
import { useUploadStore } from '../../../store/upload.store';
import { DocumentCard } from '../../../components/workspace/knowledge/DocumentCard';
import { UploadModal } from '../../../components/workspace/knowledge/UploadModal';
import { DocumentViewer } from '../../../components/workspace/knowledge/DocumentViewer';
import { KnowledgeSearch } from '../../../components/workspace/knowledge/KnowledgeSearch';

export default function KnowledgePage() {
  const { documents, folders, activeFolderId, setActiveFolder } = useKnowledgeStore();
  const { setUploadModalOpen } = useUploadStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-300 relative overflow-hidden">
      
      {/* Header */}
      <header className="flex-shrink-0 h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white tracking-tight">Knowledge Library</h1>
          <div className="h-6 w-px bg-slate-800" />
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <Search size={14} /> Search
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] ml-2">⌘K</kbd>
          </button>
          
          <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>
              <List size={16} />
            </button>
          </div>

          <button 
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-sm font-medium shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} /> Upload
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {documents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 opacity-70">
             <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-2 border border-slate-800">
               <Plus className="text-slate-500" size={32} />
             </div>
             <h2 className="text-lg font-medium text-slate-200">Your library is empty</h2>
             <p className="text-sm text-slate-400">Upload PDFs, documents, or images to create your personal AI knowledge base.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
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
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
  >
    {name}
  </button>
);
