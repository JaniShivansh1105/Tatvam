"use client";

import React from 'react';
import { FileText, Image as ImageIcon, File, MoreVertical, Star, Pin, Calendar, HardDrive } from 'lucide-react';
import { KnowledgeDocument, useKnowledgeStore } from '../../../store/knowledge.store';
import { useViewerStore } from '../../../store/viewer.store';
import { motion } from 'framer-motion';

const getFileIcon = (type: string) => {
  switch (type) {
    case 'PDF': return <FileText className="text-[#E53E3E]" size={24} />;
    case 'DOCX': return <FileText className="text-[#3182CE]" size={24} />;
    case 'Image': return <ImageIcon className="text-[#805AD5]" size={24} />;
    default: return <File className="text-[#A0AEC0]" size={24} />;
  }
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { toast } from 'react-hot-toast';

export const DocumentCard = ({ document, viewMode }: { document: KnowledgeDocument, viewMode: 'grid' | 'list' }) => {
  const { togglePin, toggleFavorite, removeDocument, renameDocument, updateDocumentStatus } = useKnowledgeStore();
  const { openDocument } = useViewerStore();

  const isGrid = viewMode === 'grid';

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = window.prompt("Enter new document name:", document.title);
    if (newName && newName.trim()) {
      renameDocument(document.id, newName.trim());
      toast.success("Document renamed successfully");
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      removeDocument(document.id);
      toast.success("Document deleted");
    }
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateDocumentStatus(document.id, 'Processing');
    toast.success("Retrying document processing...");
    setTimeout(() => {
      updateDocumentStatus(document.id, 'Indexed');
      toast.success("Document successfully processed");
    }, 2000);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative bg-white border border-[#E2E8F0] rounded-[16px] hover:border-[#6C5CE7]/40 hover:shadow-md transition-all cursor-pointer overflow-hidden ${isGrid ? 'p-4 flex flex-col h-48' : 'p-3 flex items-center gap-4'}`}
      onClick={() => openDocument(document)}
    >
      {/* Top Actions */}
      <div className={`absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${isGrid ? '' : 'hidden'}`}>
        <button onClick={(e) => { e.stopPropagation(); togglePin(document.id); }} className={`p-1.5 rounded-md hover:bg-[#F8F9FF] ${document.isPinned ? 'text-[#D69E2E]' : 'text-[#A0AEC0]'}`}>
          <Pin size={14} className={document.isPinned ? "fill-current" : ""} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(document.id); }} className={`p-1.5 rounded-md hover:bg-[#F8F9FF] ${document.isFavorite ? 'text-[#D69E2E]' : 'text-[#A0AEC0]'}`}>
          <Star size={14} className={document.isFavorite ? "fill-current" : ""} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-md hover:bg-[#F8F9FF] text-[#A0AEC0]">
              <MoreVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
            {document.status === 'Failed' && (
              <DropdownMenuItem onClick={handleRetry}>Retry Processing</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:bg-red-50 focus:text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={`flex items-start ${isGrid ? 'flex-col gap-3 flex-1' : 'gap-4 w-full items-center'}`}>
        <div className="w-12 h-12 rounded-xl bg-[#F8F9FF] flex items-center justify-center shrink-0 border border-[#E2E8F0] group-hover:border-[#6C5CE7]/30 transition-colors">
          {getFileIcon(document.type)}
        </div>
        
        <div className={`flex-1 min-w-0 ${isGrid ? 'w-full' : 'flex items-center gap-4'}`}>
          <div className={isGrid ? '' : 'flex-1 min-w-0'}>
            <h3 className="font-semibold text-[#1B1D35] truncate group-hover:text-[#6C5CE7] transition-colors">
              {document.title}
            </h3>
            {isGrid && <p className="text-xs text-[#718096] mt-1 truncate">{document.subject}</p>}
          </div>

          {!isGrid && (
            <>
              <div className="w-32 text-xs text-[#718096] flex items-center gap-1.5">
                <Calendar size={12} />
                {new Date(document.uploadDate).toLocaleDateString()}
              </div>
              <div className="w-24 text-xs text-[#718096] flex items-center gap-1.5">
                <HardDrive size={12} />
                {formatSize(document.size)}
              </div>
              <div className="w-24">
                <StatusBadge status={document.status} />
              </div>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); togglePin(document.id); }} className={`p-1.5 rounded-md hover:bg-[#F8F9FF] ${document.isPinned ? 'text-[#D69E2E]' : 'text-[#A0AEC0]'}`}>
                  <Pin size={14} className={document.isPinned ? "fill-current" : ""} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(document.id); }} className={`p-1.5 rounded-md hover:bg-[#F8F9FF] ${document.isFavorite ? 'text-[#D69E2E]' : 'text-[#A0AEC0]'}`}>
                  <Star size={14} className={document.isFavorite ? "fill-current" : ""} />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-md hover:bg-[#F8F9FF] text-[#A0AEC0]">
                      <MoreVertical size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
                    {document.status === 'Failed' && (
                      <DropdownMenuItem onClick={handleRetry}>Retry Processing</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:bg-red-50 focus:text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>

      {isGrid && (
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
           <StatusBadge status={document.status} />
           <span className="text-[10px] text-[#A0AEC0] font-medium">
             {formatSize(document.size)}
           </span>
        </div>
      )}
    </motion.div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let color = 'bg-[#EDF2F7] text-[#4A5568] border-[#E2E8F0]';
  if (status === 'Indexed') color = 'bg-[#F0FFF4] text-[#38A169] border-[#C6F6D5]';
  if (status === 'Processing') color = 'bg-[#FFFFF0] text-[#D69E2E] border-[#FEFCBF] animate-pulse';
  if (status === 'Failed') color = 'bg-[#FFF5F5] text-[#E53E3E] border-[#FED7D7]';

  return (
    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${color}`}>
      {status}
    </span>
  );
};
