"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { useEngineStore, Note } from "@/store/engine-store";
import { Edit3, Sparkles, Tag, Search, Trash2, Folder, History, Type, Hash, MoreVertical, Archive } from "lucide-react";
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });
import remarkGfm from "remark-gfm";

export function SmartNotes() {
  const { notes, addNote, updateNote, removeNote, generateFlashcard } = useEngineStore(useShallow(state => ({
    notes: state.notes,
    addNote: state.addNote,
    updateNote: state.updateNote,
    removeNote: state.removeNote,
    generateFlashcard: state.generateFlashcard
  })));
  
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

  const handleSaveNew = () => {
    if (!inputText.trim()) return;
    addNote(inputText);
    setInputText("");
  };

  const handleEditStart = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title || "");
    setEditText(note.text || "");
  };

  const handleEditSave = (id: string) => {
    if (!editText.trim()) return;
    updateNote(id, { title: editTitle, text: editText });
    setEditingId(null);
  };

  // derived state for notes
  const filteredNotes = useMemo(() => {
    let result = notes;
    if (searchQuery) {
      result = result.filter(n => 
        (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
        n.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [notes, searchQuery]);

  // Auto-save logic (simple debounce simulation for the current editing item)
  useEffect(() => {
    if (!editingId) return;
    const timer = setTimeout(() => {
      // Autosave current edits to the store without closing the editor
      updateNote(editingId, { title: editTitle, text: editText });
    }, 3000); // Autosave after 3 seconds of inactivity
    return () => clearTimeout(timer);
  }, [editTitle, editText, editingId, updateNote]);

  const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length;
  const countChars = (str: string) => str.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-bold text-[#1B1D35] uppercase tracking-wider flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-[#6C5CE7]" />
          Smart Notebook
        </h4>
        <span className="text-[11px] font-medium text-[#6C5CE7] bg-[#6C5CE7]/10 px-2 py-0.5 rounded-full">
          {notes.length} Notes
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-[#E2E8F0] rounded-lg outline-none focus:border-[#6C5CE7] transition-colors shadow-sm"
        />
      </div>
      
      <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1 pb-4">
        <AnimatePresence>
          {filteredNotes.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#E2E8F0] rounded-xl bg-white/50">
              <p className="text-[13px] font-medium text-[#4A5568]">No notes found</p>
            </motion.div>
          ) : (
            filteredNotes.map((note) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={note.id} 
                className="p-4 bg-white border border-[#E2E8F0] hover:border-[#6C5CE7]/50 rounded-[16px] shadow-sm group transition-all"
              >
                {editingId === note.id ? (
                  <div className="flex flex-col gap-2">
                    <input 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Note title..."
                      className="text-[14px] font-bold text-[#1B1D35] bg-transparent outline-none border-b border-[#E2E8F0] focus:border-[#6C5CE7] pb-1"
                    />
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full text-[13px] text-[#4A5568] bg-[#F8F9FF] border border-[#E2E8F0] rounded p-2 outline-none focus:border-[#6C5CE7] min-h-[80px] resize-none mt-1"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-[10px] text-[#A0AEC0] font-medium">
                        <span className="flex items-center gap-1"><Type className="w-3 h-3" /> {countWords(editText)} w</span>
                        <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {countChars(editText)} c</span>
                        <span className="text-[#48BB78] italic">Autosaving...</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="text-[11px] font-semibold text-[#718096] px-2 py-1">Done</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-[14px] font-bold text-[#1B1D35] pr-2">
                        {note.title || note.text.split(" ").slice(0, 4).join(" ") + "..."}
                      </h5>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => handleEditStart(note)} className="p-1 rounded hover:bg-[#F8F9FF] text-[#CBD5E0] hover:text-[#1B1D35]">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeNote(note.id)} className="p-1 rounded hover:bg-[#FFF5F5] text-[#CBD5E0] hover:text-[#E53E3E]">
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none text-[#4A5568] mb-3 line-clamp-4 leading-relaxed prose-p:my-1 prose-headings:my-1 prose-ul:my-1">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{typeof note.text === 'string' ? note.text : JSON.stringify(note.text, null, 2)}</ReactMarkdown>
                    </div>
                    
                    {note.summary && (
                      <div className="p-2 bg-[#F8F9FF] rounded-lg border border-[rgba(108,92,231,0.1)] mb-3 flex gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7] mt-0.5 shrink-0" />
                        <p className="text-[12px] text-[#4A5568]">{note.summary}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 mt-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {note.folder && (
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#4A5568] bg-[#F1F5F9] px-1.5 py-0.5 rounded">
                            <Folder className="w-3 h-3" />
                            {note.folder}
                          </span>
                        )}
                        {note.versionCount && note.versionCount > 1 && (
                          <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#718096] bg-[#EDF2F7] px-1.5 py-0.5 rounded" title="Version Count">
                            <History className="w-3 h-3" />
                            v{note.versionCount}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => generateFlashcard(note.title || "Key Concept from Note", note.summary || note.text)}
                        className="text-[10px] font-bold text-[#6C5CE7] hover:text-[#5A4BDB] uppercase tracking-wider bg-[#6C5CE7]/10 hover:bg-[#6C5CE7]/20 px-2 py-1 rounded transition-colors"
                      >
                        Create Card
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-auto">
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Jot down a new thought..."
          className="w-full h-[100px] p-3 bg-white border border-[#E2E8F0] rounded-[16px] text-[13px] resize-none outline-none focus:border-[#6C5CE7] focus:ring-[3px] focus:ring-[#6C5CE7]/15 transition-all custom-scrollbar pb-10"
        />
        <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] text-[#A0AEC0] font-medium pointer-events-none">
          <span className="flex items-center gap-1"><Type className="w-3 h-3" /> {countWords(inputText)}</span>
          <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {countChars(inputText)}</span>
        </div>
        <button 
          onClick={handleSaveNew}
          disabled={!inputText.trim()}
          className="absolute bottom-2 right-2 px-3 py-1.5 bg-[#6C5CE7] text-white text-[12px] font-bold rounded-xl hover:bg-[#5A4BDB] disabled:opacity-50 transition-colors shadow-sm"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
