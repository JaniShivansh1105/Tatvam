"use client";

import React, { useCallback } from 'react';
import { useUploadStore } from '../../../store/upload.store';
import { useKnowledgeStore } from '../../../store/knowledge.store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { workspaceEvents, EVENTS } from '../../../lib/workspace-events';

export const UploadModal = () => {
  const { isUploadModalOpen, setUploadModalOpen, queue, addToQueue, updateProgress, updateStatus } = useUploadStore();
  const { addDocument } = useKnowledgeStore();

  const handleClose = () => {
    if (queue.every(q => q.status === 'Success' || q.status === 'Failed' || q.status === 'Queued')) {
      setUploadModalOpen(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newItems = files.map(f => ({
      id: `up-${Date.now()}-${f.name}`,
      file: f,
      progress: 0,
      status: 'Uploading' as const
    }));
    addToQueue(newItems);
    
    // Upload files to backend
    newItems.forEach(item => uploadFile(item.id, item.file));
  };

  const uploadFile = async (id: string, file: File) => {
    try {
      updateStatus(id, 'Uploading');
      
      const formData = new FormData();
      formData.append("file", file);

      // We'll simulate progress events using XMLHttpRequest since fetch doesn't support upload progress yet natively in all simple wrappers,
      // but for simplicity here we'll jump to 50% immediately, then wait for fetch.
      updateProgress(id, 50);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/knowledge/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const json = await res.json();
      
      updateProgress(id, 100);
      updateStatus(id, 'Success');
      workspaceEvents.emit(EVENTS.DocumentUploaded, { id, name: file.name });
      
      const document = json.data;
      
      addDocument({
        id: document.id,
        title: document.title,
        subject: 'Uncategorized',
        type: file.name.endsWith('.pdf') ? 'PDF' : file.name.endsWith('.docx') ? 'DOCX' : 'Markdown',
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'Indexed',
        lastUsed: new Date().toISOString(),
        source: 'Upload',
        isPinned: false,
        isFavorite: false
      });

      workspaceEvents.emit(EVENTS.KnowledgeIndexed, { id: document.id, title: document.title });
    } catch (error) {
      updateStatus(id, 'Failed');
    }
  };

  if (!isUploadModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#1B1D35]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border border-[#E2E8F0] rounded-[24px] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8F9FF]">
            <h2 className="text-lg font-bold text-[#1B1D35]">Upload Materials</h2>
            <button onClick={handleClose} className="p-1 rounded-md text-[#A0AEC0] hover:text-[#1B1D35] hover:bg-white transition-colors border border-transparent hover:border-[#E2E8F0] hover:shadow-sm">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
            {/* Drag Drop Zone */}
            <label 
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-[#6C5CE7]/30 hover:border-[#6C5CE7] bg-[#F0E6FF]/50 rounded-[20px] p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group mb-6"
            >
              <input type="file" multiple className="hidden" onChange={handleFileSelect} />
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all text-[#6C5CE7]">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-bold text-[#1B1D35] mb-1">Click to upload or drag and drop</p>
              <p className="text-xs font-medium text-[#718096]">PDF, DOCX, PPT, Markdown, Images (max. 50MB)</p>
            </label>

            {/* Queue */}
            {queue.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider mb-2">Upload Queue</h3>
                {queue.map(item => (
                  <div key={item.id} className="bg-[#F8F9FF] border border-[#E2E8F0] rounded-xl p-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                      <FileText className="text-[#A0AEC0]" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-bold text-[#1B1D35] truncate pr-4">{item.file.name}</p>
                        <span className="text-xs font-bold text-[#718096] shrink-0">
                          {item.status === 'Uploading' ? `${item.progress}%` : item.status}
                        </span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-[#EDF2F7] rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${item.status === 'Success' ? 'bg-[#48BB78]' : item.status === 'Failed' ? 'bg-[#E53E3E]' : 'bg-[#6C5CE7]'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 w-6 flex justify-end">
                      {item.status === 'Success' && <CheckCircle2 className="text-[#48BB78]" size={18} />}
                      {item.status === 'Processing' && <div className="w-4 h-4 border-2 border-[#6C5CE7] border-t-transparent rounded-full animate-spin" />}
                      {item.status === 'Failed' && <AlertCircle className="text-[#E53E3E]" size={18} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
