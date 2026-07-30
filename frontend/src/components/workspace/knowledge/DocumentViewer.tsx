"use client";

import React, { useState, useEffect } from 'react';
import { useViewerStore } from '../../../store/viewer.store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Search as SearchIcon, Maximize, FileText, BrainCircuit, PenTool, Bookmark, MessageSquare, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useConversationStore } from '../../../store/conversation.store';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const DocumentViewer = () => {
  const { isOpen, activeDocument, closeViewer, zoomLevel, setZoomLevel } = useViewerStore();
  const { addMessage, setGenerating } = useConversationStore();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    // In a real app, this would be the actual file URL from backend
    // For this MVP, if it's not available, we use a placeholder or handle blob
    if (activeDocument) {
      setPdfUrl(activeDocument.fileUrl || '');
      setPageNumber(1);
    }
  }, [activeDocument]);

  if (!isOpen || !activeDocument) return null;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleAIAction = (action: string) => {
    closeViewer();
    const { workspaceEvents, EVENTS } = require('../../../lib/workspace-events');
    workspaceEvents.emit(EVENTS.TriggerChat, { 
      text: `${action} based on ${activeDocument.title} (Page ${pageNumber})`,
      context: {
        documentId: activeDocument.id,
        pageNumber: pageNumber,
        source: 'DocumentViewer'
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#1B1D35]/50 backdrop-blur-md z-40 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-[#E2E8F0] bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#F0E6FF] flex items-center justify-center shrink-0 border border-[#6C5CE7]/20">
              <FileText className="text-[#6C5CE7]" size={16} />
            </div>
            <h2 className="text-sm font-bold text-[#1B1D35] truncate">{activeDocument.title}</h2>
            <span className="px-2 py-0.5 rounded-md bg-[#EDF2F7] text-[10px] text-[#4A5568] uppercase tracking-wider font-bold">
              {activeDocument.type}
            </span>
          </div>

          <div className="flex items-center gap-3 px-4 shrink-0">
            {/* Pagination */}
            <div className="flex items-center gap-2 bg-[#F8F9FF] border border-[#E2E8F0] rounded-lg p-1">
              <button 
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="p-1 text-[#A0AEC0] hover:text-[#1B1D35] disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-[#4A5568] px-2">
                Page {pageNumber} of {numPages || '-'}
              </span>
              <button 
                onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))}
                disabled={pageNumber >= (numPages || 1)}
                className="p-1 text-[#A0AEC0] hover:text-[#1B1D35] disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="w-px h-4 bg-[#E2E8F0] mx-1" />
            
            <button onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))} className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded hover:bg-[#F8F9FF] transition-colors"><ZoomOut size={16} /></button>
            <span className="text-xs font-bold text-[#4A5568] w-12 text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded hover:bg-[#F8F9FF] transition-colors"><ZoomIn size={16} /></button>
            
            <div className="w-px h-4 bg-[#E2E8F0] mx-1" />
            
            <button className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded hover:bg-[#F8F9FF] transition-colors" title="Search (Coming soon)">
              <SearchIcon size={16} />
            </button>
            <button className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded hover:bg-[#F8F9FF] transition-colors" title="Download">
              <Download size={16} />
            </button>
            <button onClick={closeViewer} className="p-1.5 text-[#A0AEC0] hover:text-[#1B1D35] rounded hover:bg-[#F8F9FF] transition-colors"><X size={18} /></button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Viewer Area */}
          <main className="flex-1 bg-[#F1F3F9] overflow-auto flex justify-center p-8 custom-scrollbar relative shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex justify-center"
            >
              {activeDocument.type === 'PDF' && (
                <div className="shadow-xl rounded-sm border border-[#E2E8F0] bg-white overflow-hidden w-full max-w-4xl min-h-[800px] flex justify-center">
                   {pdfUrl ? (
                     <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="p-12 text-[#A0AEC0] w-full text-center mt-20">Loading PDF...</div>}
                        error={
                          <div className="p-12 text-[#A0AEC0] flex flex-col items-center mt-20 w-full text-center">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p>Cannot load PDF.</p>
                            <p className="text-xs mt-2">The file may be corrupted or unavailable.</p>
                          </div>
                        }
                      >
                        <Page 
                          pageNumber={pageNumber} 
                          scale={zoomLevel / 100} 
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="shadow-sm"
                        />
                      </Document>
                   ) : (
                      <div className="p-12 text-[#A0AEC0] flex flex-col items-center mt-20 w-full text-center">
                        <FileText size={48} className="mb-4 opacity-50 text-[#6C5CE7]" />
                        <p className="text-lg font-semibold text-[#1B1D35]">No PDF File Available</p>
                        <p className="text-sm mt-2">This document does not have an active file attached.</p>
                      </div>
                   )}
                </div>
              )}

              {activeDocument.type === 'IMAGE' && (
                <div className="bg-white w-full max-w-4xl shadow-xl rounded-sm p-12 border border-[#E2E8F0] flex justify-center items-center" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
                  {pdfUrl ? <img src={pdfUrl} alt={activeDocument.title} className="max-w-full h-auto rounded-md shadow-sm" /> : <p>No image available</p>}
                </div>
              )}

              {(activeDocument.type === 'DOCX' || activeDocument.type === 'PPTX') && (
                <div className="bg-white w-full max-w-5xl shadow-xl rounded-sm border border-[#E2E8F0] flex flex-col" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', minHeight: '800px' }}>
                  {pdfUrl ? (
                    <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pdfUrl)}`} width="100%" height="800px" frameBorder="0"></iframe>
                  ) : (
                    <div className="p-12 text-[#A0AEC0] flex flex-col items-center mt-20 w-full text-center">
                      <FileText size={48} className="mb-4 opacity-50 text-[#6C5CE7]" />
                      <p>No document file available</p>
                    </div>
                  )}
                </div>
              )}

              {(activeDocument.type === 'TXT' || activeDocument.type === 'Markdown') && (
                <div className="bg-white w-full max-w-4xl shadow-xl rounded-sm min-h-[1056px] p-12 border border-[#E2E8F0] text-left" style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}>
                  <h1 className="text-3xl font-bold text-[#1B1D35] mb-6 border-b pb-4">{activeDocument.title}</h1>
                  <div className="prose prose-lg max-w-none text-[#4A5568]">
                    {/* In a real implementation, we would fetch the raw text from backend and render with ReactMarkdown */}
                    <p className="italic text-gray-500">Document content rendering...</p>
                    {pdfUrl && (
                      <iframe src={pdfUrl} width="100%" height="800px" className="border-0 mt-4 rounded-md bg-gray-50"></iframe>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </main>

          {/* AI Sidebar */}
          <aside className="w-72 bg-white border-l border-[#E2E8F0] flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.02)] z-10">
            <div className="p-4 border-b border-[#E2E8F0] bg-[#F8F9FF]">
              <h3 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit size={14} className="text-[#6C5CE7]" /> AI Actions (Page {pageNumber})
              </h3>
            </div>
            
            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
              <ActionButton icon={<MessageSquare size={16} />} label="Explain Concept" onClick={() => handleAIAction('Explain the main concepts')} />
              <ActionButton icon={<FileText size={16} />} label="Summarize" onClick={() => handleAIAction('Summarize this document')} />
              <ActionButton icon={<PenTool size={16} />} label="Generate Notes" onClick={() => handleAIAction('Generate smart notes')} />
              <ActionButton icon={<BrainCircuit size={16} />} label="Generate Quiz" onClick={() => handleAIAction('Generate a practice quiz')} />
              <div className="my-4 border-t border-[#E2E8F0]" />
              <ActionButton icon={<Bookmark size={16} />} label="Bookmark Page" onClick={() => handleAIAction('Bookmark this page')} />
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
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#6C5CE7]/40 hover:bg-[#F8F9FF] hover:shadow-sm text-sm font-bold text-[#4A5568] hover:text-[#1B1D35] transition-all text-left"
  >
    <div className="text-[#6C5CE7]">{icon}</div>
    {label}
  </button>
);
