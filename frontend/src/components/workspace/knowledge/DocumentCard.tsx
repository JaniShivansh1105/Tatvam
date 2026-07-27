"use client";

import React from 'react';
import { FileText, Image as ImageIcon, File, MoreVertical, Star, Pin, Calendar, HardDrive } from 'lucide-react';
import { KnowledgeDocument, useKnowledgeStore } from '../../../store/knowledge.store';
import { useViewerStore } from '../../../store/viewer.store';
import { motion } from 'framer-motion';

const getFileIcon = (type: string) => {
  switch (type) {
    case 'PDF': return <FileText className="text-red-400" size={24} />;
    case 'DOCX': return <FileText className="text-blue-400" size={24} />;
    case 'Image': return <ImageIcon className="text-purple-400" size={24} />;
    default: return <File className="text-slate-400" size={24} />;
  }
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

export const DocumentCard = ({ document, viewMode }: { document: KnowledgeDocument, viewMode: 'grid' | 'list' }) => {
  const { togglePin, toggleFavorite } = useKnowledgeStore();
  const { openDocument } = useViewerStore();

  const isGrid = viewMode === 'grid';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden ${isGrid ? 'p-4 flex flex-col h-48' : 'p-3 flex items-center gap-4'}`}
      onClick={() => openDocument(document)}
    >
      {/* Top Actions */}
      <div className={`absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isGrid ? '' : 'hidden'}`}>
        <button onClick={(e) => { e.stopPropagation(); togglePin(document.id); }} className={`p-1.5 rounded-md hover:bg-slate-800 ${document.isPinned ? 'text-amber-400' : 'text-slate-400'}`}>
          <Pin size={14} className={document.isPinned ? "fill-current" : ""} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(document.id); }} className={`p-1.5 rounded-md hover:bg-slate-800 ${document.isFavorite ? 'text-amber-400' : 'text-slate-400'}`}>
          <Star size={14} className={document.isFavorite ? "fill-current" : ""} />
        </button>
      </div>

      <div className={`flex items-start ${isGrid ? 'flex-col gap-3 flex-1' : 'gap-4 w-full items-center'}`}>
        <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800 group-hover:border-indigo-500/30 transition-colors">
          {getFileIcon(document.type)}
        </div>
        
        <div className={`flex-1 min-w-0 ${isGrid ? 'w-full' : 'flex items-center gap-4'}`}>
          <div className={isGrid ? '' : 'flex-1 min-w-0'}>
            <h3 className="font-semibold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
              {document.title}
            </h3>
            {isGrid && <p className="text-xs text-slate-500 mt-1 truncate">{document.subject}</p>}
          </div>

          {!isGrid && (
            <>
              <div className="w-32 text-xs text-slate-500 flex items-center gap-1.5">
                <Calendar size={12} />
                {new Date(document.uploadDate).toLocaleDateString()}
              </div>
              <div className="w-24 text-xs text-slate-500 flex items-center gap-1.5">
                <HardDrive size={12} />
                {formatSize(document.size)}
              </div>
              <div className="w-24">
                <StatusBadge status={document.status} />
              </div>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); togglePin(document.id); }} className={`p-1.5 rounded-md hover:bg-slate-800 ${document.isPinned ? 'text-amber-400' : 'text-slate-400'}`}>
                  <Pin size={14} className={document.isPinned ? "fill-current" : ""} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(document.id); }} className={`p-1.5 rounded-md hover:bg-slate-800 ${document.isFavorite ? 'text-amber-400' : 'text-slate-400'}`}>
                  <Star size={14} className={document.isFavorite ? "fill-current" : ""} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isGrid && (
        <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between">
           <StatusBadge status={document.status} />
           <span className="text-[10px] text-slate-500 font-medium">
             {formatSize(document.size)}
           </span>
        </div>
      )}
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-slate-800 text-slate-400';
  if (status === 'Indexed') color = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  if (status === 'Processing') color = 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse';
  if (status === 'Failed') color = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${color}`}>
      {status}
    </span>
  );
};
