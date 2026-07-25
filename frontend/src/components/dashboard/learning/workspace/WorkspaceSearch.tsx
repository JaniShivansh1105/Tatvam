"use client";

import React, { useEffect, useState } from "react";
import { useEngineStore } from "@/store/engine-store";
import { Search, FileText, Bookmark as BookmarkIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WorkspaceSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { notes, bookmarks } = useEngineStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(
    n => n.text.toLowerCase().includes(query.toLowerCase()) || 
         n.summary?.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredBookmarks = bookmarks.filter(
    b => b.content.toLowerCase().includes(query.toLowerCase()) ||
         b.note?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-[#1B1D35]/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0] flex flex-col"
        >
          <div className="flex items-center px-4 py-3 border-b border-[#E2E8F0]">
            <Search className="w-5 h-5 text-[#A0AEC0]" />
            <input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes and bookmarks..."
              className="flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-[#1B1D35] placeholder:text-[#A0AEC0]"
            />
            <button onClick={() => setIsOpen(false)} className="p-1 text-[#A0AEC0] hover:text-[#4A5568] transition-colors rounded-lg hover:bg-[#F8F9FF]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
            {!query ? (
              <div className="p-8 text-center text-[#A0AEC0] text-[14px]">
                Type to start searching your workspace...
              </div>
            ) : (
              <>
                {filteredNotes.length > 0 && (
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#718096] uppercase tracking-wider">Notes</div>
                    {filteredNotes.map(note => (
                      <button key={note.id} onClick={() => setIsOpen(false)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8F9FF] text-left transition-colors group">
                        <FileText className="w-5 h-5 text-[#6C5CE7] shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] text-[#1B1D35] font-medium line-clamp-1">{note.text}</span>
                          {note.summary && <span className="text-[12px] text-[#718096] line-clamp-1">{note.summary}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredBookmarks.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#718096] uppercase tracking-wider">Bookmarks</div>
                    {filteredBookmarks.map(bm => (
                      <button key={bm.id} onClick={() => setIsOpen(false)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8F9FF] text-left transition-colors group">
                        <BookmarkIcon className="w-5 h-5 text-[#F6AD55] shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <span className="text-[14px] text-[#1B1D35] font-medium line-clamp-1">{bm.content}</span>
                          {bm.note && <span className="text-[12px] text-[#718096] line-clamp-1">{bm.note}</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredNotes.length === 0 && filteredBookmarks.length === 0 && (
                  <div className="p-8 text-center text-[#A0AEC0] text-[14px]">
                    No results found for "{query}"
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="px-4 py-2 border-t border-[#E2E8F0] bg-[#F8F9FF] text-[11px] text-[#718096] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span><kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] font-sans mr-1">↑</kbd><kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] font-sans">↓</kbd> to navigate</span>
              <span><kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] font-sans mr-1">↵</kbd> to select</span>
            </div>
            <span><kbd className="bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0] font-sans mr-1">esc</kbd> to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
