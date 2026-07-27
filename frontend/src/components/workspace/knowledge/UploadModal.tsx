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
    
    // Simulate upload and processing pipeline
    newItems.forEach(item => simulateUpload(item.id, item.file));
  };

  const simulateUpload = async (id: string, file: File) => {
    // 1. Uploading phase
    for (let i = 10; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      updateProgress(id, i);
    }
    
    // 2. Processing phase
    updateStatus(id, 'Processing');
    workspaceEvents.emit(EVENTS.DocumentUploaded, { id, name: file.name });
    
    await new Promise(r => setTimeout(r, 1500));
    
    // 3. Success phase
    updateStatus(id, 'Success');
    
    // Add to Knowledge Store
    const docId = `doc-${Date.now()}`;
    addDocument({
      id: docId,
      title: file.name,
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
    
    workspaceEvents.emit(EVENTS.KnowledgeIndexed, { id: docId, title: file.name });
  };

  if (!isUploadModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-lg font-semibold text-white">Upload Materials</h2>
            <button onClick={handleClose} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {/* Drag Drop Zone */}
            <label 
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/5 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group mb-6"
            >
              <input type="file" multiple className="hidden" onChange={handleFileSelect} />
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="text-indigo-400" size={24} />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500">PDF, DOCX, PPT, Markdown, Images (max. 50MB)</p>
            </label>

            {/* Queue */}
            {queue.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Queue</h3>
                {queue.map(item => (
                  <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                      <FileText className="text-slate-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <p className="text-sm font-medium text-slate-200 truncate pr-4">{item.file.name}</p>
                        <span className="text-xs font-medium text-slate-500 shrink-0">
                          {item.status === 'Uploading' ? `${item.progress}%` : item.status}
                        </span>
                      </div>
                      
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${item.status === 'Success' ? 'bg-emerald-500' : item.status === 'Failed' ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="shrink-0 w-6 flex justify-end">
                      {item.status === 'Success' && <CheckCircle2 className="text-emerald-500" size={18} />}
                      {item.status === 'Processing' && <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
                      {item.status === 'Failed' && <AlertCircle className="text-rose-500" size={18} />}
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
